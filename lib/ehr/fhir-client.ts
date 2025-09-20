export interface FHIRResource {
  resourceType: string
  id: string
  meta?: {
    versionId?: string
    lastUpdated?: string
    profile?: string[]
  }
}

export interface Patient extends FHIRResource {
  resourceType: "Patient"
  identifier?: Array<{
    use?: string
    type?: {
      coding?: Array<{
        system?: string
        code?: string
        display?: string
      }>
    }
    value?: string
  }>
  name?: Array<{
    use?: string
    family?: string
    given?: string[]
  }>
  telecom?: Array<{
    system?: string
    value?: string
    use?: string
  }>
  gender?: "male" | "female" | "other" | "unknown"
  birthDate?: string
  address?: Array<{
    use?: string
    line?: string[]
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }>
}

export interface Observation extends FHIRResource {
  resourceType: "Observation"
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled"
  category?: Array<{
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
  }>
  code: {
    coding?: Array<{
      system?: string
      code?: string
      display?: string
    }>
    text?: string
  }
  subject: {
    reference: string
    display?: string
  }
  effectiveDateTime?: string
  valueQuantity?: {
    value?: number
    unit?: string
    system?: string
    code?: string
  }
  valueString?: string
  valueBoolean?: boolean
}

export class FHIRClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/fhir+json",
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`FHIR API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPatient(patientId: string): Promise<Patient> {
    return this.request<Patient>(`/Patient/${patientId}`)
  }

  async searchPatients(params: Record<string, string>): Promise<{ entry: Array<{ resource: Patient }> }> {
    const searchParams = new URLSearchParams(params)
    return this.request<{ entry: Array<{ resource: Patient }> }>(`/Patient?${searchParams}`)
  }

  async getObservations(patientId: string): Promise<{ entry: Array<{ resource: Observation }> }> {
    return this.request<{ entry: Array<{ resource: Observation }> }>(`/Observation?patient=${patientId}`)
  }

  async createObservation(observation: Omit<Observation, "id">): Promise<Observation> {
    return this.request<Observation>("/Observation", {
      method: "POST",
      body: JSON.stringify(observation),
    })
  }

  async updatePatient(patientId: string, patient: Patient): Promise<Patient> {
    return this.request<Patient>(`/Patient/${patientId}`, {
      method: "PUT",
      body: JSON.stringify(patient),
    })
  }

  // Simulate EHR system connections
  async syncWithEHR(
    ehrSystemId: string,
    patientId: string,
  ): Promise<{
    success: boolean
    recordsSynced: number
    lastSync: string
  }> {
    // Simulate API call to EHR system
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: Math.random() > 0.1, // 90% success rate
      recordsSynced: Math.floor(Math.random() * 50) + 1,
      lastSync: new Date().toISOString(),
    }
  }

  async validateFHIRResource(resource: FHIRResource): Promise<{
    valid: boolean
    errors: string[]
  }> {
    const errors: string[] = []

    if (!resource.resourceType) {
      errors.push("Missing required field: resourceType")
    }

    if (!resource.id) {
      errors.push("Missing required field: id")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Mock FHIR client for development
export const mockFHIRClient = new FHIRClient(
  process.env.NEXT_PUBLIC_FHIR_BASE_URL || "https://mock-fhir-server.com/fhir",
  process.env.FHIR_API_KEY || "mock-api-key",
)
