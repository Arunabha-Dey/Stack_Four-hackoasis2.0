"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Activity, Database, RefreshCw, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"

interface EHRSystem {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "syncing" | "error"
  lastSync: string
  recordCount: number
  fhirCompliant: boolean
}

interface SyncStatus {
  inProgress: boolean
  progress: number
  currentStep: string
  recordsSynced: number
  errors: string[]
}

export default function EHRIntegration() {
  const [ehrSystems, setEHRSystems] = useState<EHRSystem[]>([
    {
      id: "epic-001",
      name: "Epic MyChart",
      type: "Epic",
      status: "connected",
      lastSync: "2024-01-15T10:30:00Z",
      recordCount: 1247,
      fhirCompliant: true,
    },
    {
      id: "cerner-001",
      name: "Cerner PowerChart",
      type: "Cerner",
      status: "connected",
      lastSync: "2024-01-15T09:15:00Z",
      recordCount: 892,
      fhirCompliant: true,
    },
    {
      id: "allscripts-001",
      name: "Allscripts EHR",
      type: "Allscripts",
      status: "disconnected",
      lastSync: "2024-01-10T14:22:00Z",
      recordCount: 0,
      fhirCompliant: false,
    },
  ])

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    inProgress: false,
    progress: 0,
    currentStep: "",
    recordsSynced: 0,
    errors: [],
  })

  const [autoSync, setAutoSync] = useState(true)
  const [selectedSystem, setSelectedSystem] = useState<string>("")

  const handleSync = async (systemId: string) => {
    setSyncStatus({
      inProgress: true,
      progress: 0,
      currentStep: "Connecting to EHR system...",
      recordsSynced: 0,
      errors: [],
    })

    const steps = [
      "Connecting to EHR system...",
      "Authenticating with FHIR endpoint...",
      "Fetching patient records...",
      "Validating FHIR resources...",
      "Encrypting sensitive data...",
      "Storing on blockchain...",
      "Updating local cache...",
      "Sync completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSyncStatus((prev) => ({
        ...prev,
        progress: ((i + 1) / steps.length) * 100,
        currentStep: steps[i],
        recordsSynced: Math.floor(Math.random() * 50) + i * 10,
      }))
    }

    // Update EHR system status
    setEHRSystems((prev) =>
      prev.map((system) =>
        system.id === systemId
          ? {
              ...system,
              status: "connected",
              lastSync: new Date().toISOString(),
              recordCount: system.recordCount + Math.floor(Math.random() * 20),
            }
          : system,
      ),
    )

    setSyncStatus((prev) => ({ ...prev, inProgress: false }))
  }

  const getStatusIcon = (status: EHRSystem["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: EHRSystem["status"]) => {
    switch (status) {
      case "connected":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "syncing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">EHR Integration</h2>
          <p className="text-gray-400">Manage connections to Electronic Health Record systems</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-sync" className="text-sm text-gray-300">
              Auto Sync
            </Label>
            <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
          <Button
            onClick={() => selectedSystem && handleSync(selectedSystem)}
            disabled={!selectedSystem || syncStatus.inProgress}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.inProgress ? "animate-spin" : ""}`} />
            Sync Now
          </Button>
        </div>
      </div>

      <Tabs defaultValue="systems" className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="systems" className="data-[state=active]:bg-red-600">
            EHR Systems
          </TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-red-600">
            Sync Status
          </TabsTrigger>
          <TabsTrigger value="mapping" className="data-[state=active]:bg-red-600">
            Data Mapping
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-red-600">
            FHIR Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4">
            {ehrSystems.map((system) => (
              <Card key={system.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-red-400" />
                      <div>
                        <CardTitle className="text-white">{system.name}</CardTitle>
                        <CardDescription className="text-gray-400">{system.type} EHR System</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(system.status)}
                      <Badge className={getStatusColor(system.status)}>{system.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Records</p>
                      <p className="text-lg font-semibold text-white">{system.recordCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Sync</p>
                      <p className="text-sm text-white">{new Date(system.lastSync).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">FHIR Compliant</p>
                      <p className="text-sm text-white">{system.fhirCompliant ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Actions</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSystem(system.id)
                            handleSync(system.id)
                          }}
                          disabled={syncStatus.inProgress}
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          Sync
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-red-400" />
                Synchronization Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncStatus.inProgress ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{syncStatus.currentStep}</span>
                      <span className="text-gray-300">{Math.round(syncStatus.progress)}%</span>
                    </div>
                    <Progress value={syncStatus.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Records Synced</p>
                      <p className="text-2xl font-bold text-red-400">{syncStatus.recordsSynced}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-sm text-blue-400 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        In Progress
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <p className="text-white font-semibold">All systems synchronized</p>
                  <p className="text-gray-400 text-sm">Last sync completed successfully</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">FHIR Data Mapping</CardTitle>
              <CardDescription className="text-gray-400">Configure how EHR data maps to FHIR resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Source Field</Label>
                    <Input placeholder="patient.demographics.name" className="bg-gray-800 border-gray-600" />
                  </div>
                  <div>
                    <Label className="text-gray-300">FHIR Resource</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Select FHIR resource" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient.name</SelectItem>
                        <SelectItem value="observation">Observation.value</SelectItem>
                        <SelectItem value="condition">Condition.code</SelectItem>
                        <SelectItem value="medication">MedicationRequest.medication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">Add Mapping Rule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-red-400" />
                FHIR Compliance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">98%</div>
                    <div className="text-sm text-gray-400">Resource Validation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">R4</div>
                    <div className="text-sm text-gray-400">FHIR Version</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">2.1s</div>
                    <div className="text-sm text-gray-400">Avg Response Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
