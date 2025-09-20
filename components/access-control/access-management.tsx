"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  User,
  Clock,
  Lock,
  Eye,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Key,
  UserCheck,
  Timer,
} from "lucide-react"

interface AccessGrant {
  id: string
  grantedTo: string
  role: string
  organization: string
  permissions: string[]
  grantedDate: string
  expiryDate: string
  status: "active" | "expired" | "revoked" | "pending"
  recordTypes: string[]
  granularity: "full" | "partial" | "specific"
  zkProofRequired: boolean
}

interface AccessRequest {
  id: string
  requester: string
  role: string
  organization: string
  requestedPermissions: string[]
  requestDate: string
  reason: string
  urgency: "low" | "medium" | "high" | "emergency"
  status: "pending" | "approved" | "denied"
}

const mockAccessGrants: AccessGrant[] = [
  {
    id: "ACL-001",
    grantedTo: "Dr. Sarah Smith",
    role: "Cardiologist",
    organization: "City General Hospital",
    permissions: ["read", "write", "share"],
    grantedDate: "2024-01-10",
    expiryDate: "2024-07-10",
    status: "active",
    recordTypes: ["cardiology", "lab-results", "imaging"],
    granularity: "partial",
    zkProofRequired: true,
  },
  {
    id: "ACL-002",
    grantedTo: "Dr. Michael Johnson",
    role: "Radiologist",
    organization: "Metro Medical Center",
    permissions: ["read"],
    grantedDate: "2024-01-08",
    expiryDate: "2024-04-08",
    status: "active",
    recordTypes: ["imaging", "radiology"],
    granularity: "specific",
    zkProofRequired: true,
  },
  {
    id: "ACL-003",
    grantedTo: "Nurse Jennifer Davis",
    role: "Registered Nurse",
    organization: "Heart Care Institute",
    permissions: ["read"],
    grantedDate: "2023-12-15",
    expiryDate: "2024-01-15",
    status: "expired",
    recordTypes: ["vitals", "medications"],
    granularity: "specific",
    zkProofRequired: false,
  },
]

const mockAccessRequests: AccessRequest[] = [
  {
    id: "REQ-001",
    requester: "Dr. Emily Wilson",
    role: "Emergency Physician",
    organization: "Emergency Medical Center",
    requestedPermissions: ["read", "emergency-access"],
    requestDate: "2024-01-16",
    reason: "Patient admitted to ER with chest pain, need immediate access to cardiac history",
    urgency: "emergency",
    status: "pending",
  },
  {
    id: "REQ-002",
    requester: "Dr. Robert Chen",
    role: "Endocrinologist",
    organization: "Diabetes Care Clinic",
    requestedPermissions: ["read", "write"],
    requestDate: "2024-01-15",
    reason: "Ongoing diabetes management and treatment plan updates",
    urgency: "medium",
    status: "pending",
  },
]

export function AccessManagement() {
  const [activeTab, setActiveTab] = useState("grants")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewGrantForm, setShowNewGrantForm] = useState(false)
  const [selectedGrant, setSelectedGrant] = useState<AccessGrant | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "expired":
        return "bg-muted/20 text-muted-foreground border-muted/30"
      case "revoked":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "pending":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "high":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "medium":
        return "bg-accent/20 text-accent border-accent/30"
      case "low":
        return "bg-muted/20 text-muted-foreground border-muted/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />
      case "expired":
        return <Clock className="w-3 h-3" />
      case "revoked":
        return <X className="w-3 h-3" />
      case "pending":
        return <Timer className="w-3 h-3" />
      default:
        return <Shield className="w-3 h-3" />
    }
  }

  const handleApproveRequest = (requestId: string) => {
    console.log("Approving request:", requestId)
    // Implementation would handle blockchain transaction
  }

  const handleDenyRequest = (requestId: string) => {
    console.log("Denying request:", requestId)
    // Implementation would handle blockchain transaction
  }

  const handleRevokeAccess = (grantId: string) => {
    console.log("Revoking access:", grantId)
    // Implementation would handle blockchain transaction
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Control Management</h2>
          <p className="text-muted-foreground">Manage permissions and control who can access your health records</p>
        </div>
        <Button onClick={() => setShowNewGrantForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Grant Access
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="grants" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Active Grants
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Pending Requests
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Privacy Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grants" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search access grants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
              />
            </div>
          </div>

          {/* Access Grants List */}
          <div className="grid gap-4">
            {mockAccessGrants.map((grant) => (
              <Card
                key={grant.id}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{grant.grantedTo}</CardTitle>
                        <CardDescription>
                          {grant.role} • {grant.organization}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(grant.status)} border text-xs`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(grant.status)}
                          {grant.status}
                        </div>
                      </Badge>
                      {grant.zkProofRequired && (
                        <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                          <Key className="w-3 h-3 mr-1" />
                          ZK-Proof
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {grant.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Record Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {grant.recordTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Granted: {new Date(grant.grantedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Expires: {new Date(grant.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedGrant(grant)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRevokeAccess(grant.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Lock className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid gap-4">
            {mockAccessRequests.map((request) => (
              <Card key={request.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{request.requester}</CardTitle>
                        <CardDescription>
                          {request.role} • {request.organization}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getUrgencyColor(request.urgency)} border text-xs`}>{request.urgency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Reason for Access:</span>
                    <p className="text-sm mt-1">{request.reason}</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Requested Permissions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {request.requestedPermissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-chart-3 hover:bg-chart-3/90 text-white"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDenyRequest(request.id)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Default Privacy Settings
                </CardTitle>
                <CardDescription>Configure default access controls for new requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Require Zero-Knowledge Proof</Label>
                    <p className="text-xs text-muted-foreground">
                      Always require ZK-proof for data access verification
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-approve Emergency Access</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically grant emergency access to verified providers
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Audit All Access</Label>
                    <p className="text-xs text-muted-foreground">Log all data access attempts on blockchain</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Access Duration</Label>
                  <Select defaultValue="6months">
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-chart-1" />
                  Emergency Access Protocol
                </CardTitle>
                <CardDescription>Configure emergency access procedures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-chart-1 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Emergency Override</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        In life-threatening situations, verified emergency providers can access critical health data
                        with automatic blockchain logging and patient notification.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Configure Emergency Contacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Grant Detail Modal */}
      {selectedGrant && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Access Grant Details</CardTitle>
                  <CardDescription>ID: {selectedGrant.id}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGrant(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Granted To</Label>
                  <p className="font-medium">{selectedGrant.grantedTo}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Role</Label>
                  <p className="font-medium">{selectedGrant.role}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Organization</Label>
                  <p className="font-medium">{selectedGrant.organization}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className={`${getStatusColor(selectedGrant.status)} border text-xs mt-1`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedGrant.status)}
                      {selectedGrant.status}
                    </div>
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGrant.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Accessible Record Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGrant.recordTypes.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Granted Date</Label>
                  <p className="font-medium">{new Date(selectedGrant.grantedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                  <p className="font-medium">{new Date(selectedGrant.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleRevokeAccess(selectedGrant.id)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Revoke Access
                </Button>
                <Button className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Modify Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
