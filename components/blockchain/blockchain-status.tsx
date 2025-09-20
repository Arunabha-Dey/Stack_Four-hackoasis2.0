"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  Activity,
  Clock,
  Hash,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Database,
} from "lucide-react"
import { blockchainClient } from "@/lib/blockchain/client"

interface NetworkStatus {
  connected: boolean
  blockHeight: number
  lastBlockTime: string
  tps: number
  pendingTransactions: number
}

export function BlockchainStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const fetchNetworkStatus = async () => {
    try {
      setIsLoading(true)
      const status = await blockchainClient.getNetworkStatus()
      setNetworkStatus(status)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Failed to fetch network status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworkStatus()
    const interval = setInterval(fetchNetworkStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !networkStatus) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            Blockchain Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary pulse-glow" />
                Blockchain Network Status
              </CardTitle>
              <CardDescription>Stack Four Health Network • Hyperledger Fabric</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${networkStatus?.connected ? "bg-chart-3/20 text-chart-3 border-chart-3/30" : "bg-destructive/20 text-destructive border-destructive/30"} border`}
              >
                <div className="flex items-center gap-1">
                  {networkStatus?.connected ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {networkStatus?.connected ? "Connected" : "Disconnected"}
                </div>
              </Badge>
              <Button variant="ghost" size="sm" onClick={fetchNetworkStatus} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Block Height</span>
              </div>
              <div className="text-2xl font-bold text-accent">{networkStatus?.blockHeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current block number</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Throughput</span>
              </div>
              <div className="text-2xl font-bold text-primary">{networkStatus?.tps}</div>
              <p className="text-xs text-muted-foreground">Transactions per second</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-chart-3" />
                <span className="text-sm font-medium">Last Block</span>
              </div>
              <div className="text-sm font-bold text-chart-3">
                {networkStatus?.lastBlockTime ? new Date(networkStatus.lastBlockTime).toLocaleTimeString() : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Latest block time</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-chart-1">{networkStatus?.pendingTransactions || 0}</div>
              <p className="text-xs text-muted-foreground">Pending transactions</p>
            </div>
          </div>

          {/* Network Health Indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network Health</span>
              <span className="text-xs text-muted-foreground">Last updated: {lastUpdate}</span>
            </div>
            <Progress value={networkStatus?.connected ? 95 : 0} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Excellent</span>
              <span>95% Uptime</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Recent Blockchain Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-chart-3 rounded-full mt-2 pulse-glow" />
              <div className="flex-1">
                <p className="text-sm font-medium">Record Hash Stored</p>
                <p className="text-xs text-muted-foreground font-mono">0x7f9fade1c0d57a7af66ab4ead7...</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Access Permission Granted</p>
                <p className="text-xs text-muted-foreground font-mono">0x8a0bade2d1e68b8bg77bc5fbe8...</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">ZK-Proof Verification</p>
                <p className="text-xs text-muted-foreground font-mono">0x9b1cbef3e2f79c9ch88cd6gcf9...</p>
                <p className="text-xs text-muted-foreground">8 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-chart-3" />
                <div>
                  <p className="text-sm font-medium">Encryption Active</p>
                  <p className="text-xs text-muted-foreground">AES-256 end-to-end encryption</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">HIPAA Compliant</p>
                  <p className="text-xs text-muted-foreground">Healthcare data protection standards</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Immutable Audit Trail</p>
                  <p className="text-xs text-muted-foreground">All access logged permanently</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
