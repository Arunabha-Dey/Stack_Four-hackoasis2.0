"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hash, Clock, Search, Eye, Download, CheckCircle, Timer, AlertTriangle } from "lucide-react"
import { blockchainClient, type BlockchainTransaction } from "@/lib/blockchain/client"

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<BlockchainTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        // In real implementation, this would fetch from the blockchain
        const txHistory = await blockchainClient.getTransactionHistory("UHR-2024-001")
        setTransactions(txHistory)
        setFilteredTransactions(txHistory)
      } catch (error) {
        console.error("Failed to fetch transaction history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, filterType])

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "record_hash":
        return "bg-primary/20 text-primary border-primary/30"
      case "access_grant":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "access_revoke":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "access_request":
        return "bg-accent/20 text-accent border-accent/30"
      case "audit_log":
        return "bg-muted/20 text-muted-foreground border-muted/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "pending":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "failed":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Timer className="w-3 h-3" />
      case "failed":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Blockchain Transaction History
          </CardTitle>
          <CardDescription>Complete audit trail of all blockchain transactions for your health records</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions by ID, hash, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="record_hash">Record Hash</SelectItem>
                <SelectItem value="access_grant">Access Grant</SelectItem>
                <SelectItem value="access_revoke">Access Revoke</SelectItem>
                <SelectItem value="access_request">Access Request</SelectItem>
                <SelectItem value="audit_log">Audit Log</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{formatTransactionType(transaction.type)}</h4>
                        <Badge className={`${getTransactionTypeColor(transaction.type)} border text-xs`}>
                          {transaction.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(transaction.status)} border text-xs`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{new Date(transaction.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="bg-muted/20 p-3 rounded font-mono text-xs break-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Transaction Hash:</span>
                    </div>
                    <span className="text-foreground">{transaction.hash}</span>
                  </div>

                  {transaction.previousHash !== "0x0" && (
                    <div className="bg-muted/10 p-3 rounded font-mono text-xs break-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Previous Hash:</span>
                      </div>
                      <span className="text-muted-foreground">{transaction.previousHash}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">Patient ID: {transaction.patientId}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Hash className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "Your blockchain transaction history will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
