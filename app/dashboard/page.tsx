"use client"

import { VascularBackground } from "@/components/vascular-background"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecordsList } from "@/components/medical-records/records-list"
import { RecordUpload } from "@/components/medical-records/record-upload"
import { AccessManagement } from "@/components/access-control/access-management"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/lib/auth/auth-context"
import {
  Activity,
  Shield,
  FileText,
  Users,
  Bell,
  Settings,
  Heart,
  Brain,
  Thermometer,
  Droplets,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Share,
  Upload,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { useState } from "react"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, logout } = useAuth()

  // Redirect to login if not authenticated
  if (!user) {
    return null // This will be handled by the auth context
  }

  return (
    <div className="min-h-screen relative">
      <VascularBackground />

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Logo />
              <div className="hidden md:block h-6 w-px bg-border" />
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Patient ID: {user.patientId}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://hss-3z.vercel.app', '_blank')}
                className="border-chart-3 text-chart-3 hover:bg-chart-3/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Hind Svasth Seva
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full pulse-glow" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share Access
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Records</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Providers</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Health Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">92/100</div>
                  <Progress value={92} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Excellent overall health</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Active Records</CardTitle>
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">47</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="text-chart-3">+3</span> this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Access Grants</CardTitle>
                    <Shield className="w-4 h-4 text-chart-3" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">12</div>
                  <p className="text-xs text-muted-foreground mt-2">Active permissions</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
                    <Zap className="w-4 h-4 text-primary pulse-glow" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-chart-3 rounded-full pulse-glow" />
                    <span className="text-sm font-medium text-chart-3">Synced</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last sync: 2 min ago</p>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 backdrop-blur-sm border-destructive/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-destructive">Account</CardTitle>
                    <LogOut className="w-4 h-4 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        await logout()
                      } catch (error) {
                        console.error('Logout failed:', error)
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Securely end your session</p>
                </CardContent>
              </Card>
            </div>

            {/* Hind Svasth Seva Integration */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-chart-3" />
                  Hind Svasth Seva Integration
                </CardTitle>
                <CardDescription>
                  Access comprehensive healthcare services through our partner platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open('https://hss-3z.vercel.app', '_blank')}
                  className="w-full border-chart-3 text-chart-3 hover:bg-chart-3/10"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit Hind Svasth Seva
                </Button>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Connect with healthcare providers, book appointments, and access medical services
                </p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-chart-3 rounded-full mt-2 pulse-glow" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lab Results Added</p>
                      <p className="text-xs text-muted-foreground">Blood work from City Hospital</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Access Granted</p>
                      <p className="text-xs text-muted-foreground">Dr. Smith - Cardiology</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Prescription Updated</p>
                      <p className="text-xs text-muted-foreground">Medication dosage adjusted</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-chart-3" />
                    Health Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
                    <AlertTriangle className="w-4 h-4 text-chart-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Medication Reminder</p>
                      <p className="text-xs text-muted-foreground">Take evening medication in 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <Calendar className="w-4 h-4 text-accent mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upcoming Appointment</p>
                      <p className="text-xs text-muted-foreground">Cardiology checkup tomorrow at 2 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vaccination Due</p>
                      <p className="text-xs text-muted-foreground">Annual flu shot recommended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                    <Heart className="w-4 h-4 text-primary pulse-glow" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">72 BPM</div>
                  <p className="text-xs text-muted-foreground mt-2">Normal range</p>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary vascular-flow" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                    <Droplets className="w-4 h-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">120/80</div>
                  <p className="text-xs text-muted-foreground mt-2">Optimal</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <Thermometer className="w-4 h-4 text-chart-3" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">98.6°F</div>
                  <p className="text-xs text-muted-foreground mt-2">Normal</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Oxygen Sat</CardTitle>
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <p className="text-xs text-muted-foreground mt-2">Excellent</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <AccessManagement />
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <RecordsList />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <RecordUpload />
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Healthcare Providers</CardTitle>
                <CardDescription>Manage your healthcare team and provider access</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Provider management system in development</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>Personalized health recommendations and risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI analytics engine will be implemented in the final phase</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
