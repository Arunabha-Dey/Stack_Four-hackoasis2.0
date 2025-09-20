import { VascularBackground } from "@/components/vascular-background"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockchainStatus } from "@/components/blockchain/blockchain-status"
import { TransactionHistory } from "@/components/blockchain/transaction-history"
import { Activity, Hash, Shield, Settings, User, Bell, Share } from "lucide-react"

export default function BlockchainPage() {
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
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Patient ID: UHR-2024-001</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Blockchain Infrastructure</h1>
          <p className="text-muted-foreground">Monitor your health data on the Stack Four blockchain network</p>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Network Status
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security & Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <BlockchainStatus />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Security audit and compliance dashboard coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
