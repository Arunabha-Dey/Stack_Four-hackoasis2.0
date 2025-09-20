"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Calendar, User, Hospital, Search, Download, Eye, Lock, Unlock, Hash, Clock } from "lucide-react"

interface MedicalRecord {
  id: string
  title: string
  type: string
  date: string
  provider: string
  hospital: string
  status: "verified" | "pending" | "encrypted"
  blockchainHash: string
  description: string
  category: string
}

const mockRecords: MedicalRecord[] = [
  {
    id: "UHR-001",
    title: "Complete Blood Count (CBC)",
    type: "Lab Results",
    date: "2024-01-15",
    provider: "Dr. Sarah Smith",
    hospital: "City General Hospital",
    status: "verified",
    blockchainHash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    description: "Routine blood work showing normal values across all parameters",
    category: "Laboratory",
  },
  {
    id: "UHR-002",
    title: "Chest X-Ray Report",
    type: "Imaging",
    date: "2024-01-10",
    provider: "Dr. Michael Johnson",
    hospital: "Metro Medical Center",
    status: "verified",
    blockchainHash: "0x8a0bade2d1e68b8bg77bc5fbe8a0bade2d1e68b8bg77bc5fbe8d3d3fc8c22ba2496",
    description: "Clear chest X-ray with no abnormalities detected",
    category: "Radiology",
  },
  {
    id: "UHR-003",
    title: "Cardiology Consultation",
    type: "Consultation",
    date: "2024-01-08",
    provider: "Dr. Emily Davis",
    hospital: "Heart Care Institute",
    status: "verified",
    blockchainHash: "0x9b1cbef3e2f79c9ch88cd6gcf9b1cbef3e2f79c9ch88cd6gcf9e4e4gd9d33cb3507",
    description: "Routine cardiac evaluation with EKG and stress test",
    category: "Cardiology",
  },
  {
    id: "UHR-004",
    title: "Prescription Update",
    type: "Medication",
    date: "2024-01-05",
    provider: "Dr. Sarah Smith",
    hospital: "City General Hospital",
    status: "pending",
    blockchainHash: "0xa2cdcf4f3g80ad0di99de7hda2cdcf4f3g80ad0di99de7hdaaf5f5he0e44dc4618",
    description: "Updated dosage for blood pressure medication",
    category: "Pharmacy",
  },
  {
    id: "UHR-005",
    title: "Annual Physical Exam",
    type: "Examination",
    date: "2023-12-20",
    provider: "Dr. Robert Wilson",
    hospital: "Primary Care Clinic",
    status: "verified",
    blockchainHash: "0xb3dede5g4h91be1ej00ef8ieb3dede5g4h91be1ej00ef8iebbg6g6if1f55ed5729",
    description: "Comprehensive annual health assessment",
    category: "Primary Care",
  },
]

export function RecordsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || record.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "pending":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "encrypted":
        return "bg-accent/20 text-accent border-accent/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Unlock className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "encrypted":
        return <Lock className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search records, providers, or hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="bg-card/50 backdrop-blur-sm"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "laboratory" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("laboratory")}
            className="bg-card/50 backdrop-blur-sm"
          >
            Lab
          </Button>
          <Button
            variant={selectedCategory === "radiology" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("radiology")}
            className="bg-card/50 backdrop-blur-sm"
          >
            Imaging
          </Button>
          <Button
            variant={selectedCategory === "cardiology" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("cardiology")}
            className="bg-card/50 backdrop-blur-sm"
          >
            Cardiology
          </Button>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRecords.map((record) => (
          <Card
            key={record.id}
            className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedRecord(record)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold text-balance">{record.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {record.type} • {record.category}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(record.status)} border text-xs`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(record.status)}
                    {record.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{record.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(record.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {record.provider}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Hospital className="w-3 h-3" />
                {record.hospital}
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground bg-muted/20 p-2 rounded">
                <Hash className="w-3 h-3" />
                <span className="truncate">{record.blockchainHash}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">ID: {record.id}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No records found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Record Detail Modal would go here */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedRecord.title}</CardTitle>
                  <CardDescription>
                    {selectedRecord.type} • {selectedRecord.category}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Provider:</span>
                  <p className="font-medium">{selectedRecord.provider}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hospital:</span>
                  <p className="font-medium">{selectedRecord.hospital}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={`${getStatusColor(selectedRecord.status)} border text-xs mt-1`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedRecord.status)}
                      {selectedRecord.status}
                    </div>
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Description:</span>
                <p className="mt-1">{selectedRecord.description}</p>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Blockchain Hash:</span>
                <p className="mt-1 font-mono text-xs bg-muted/20 p-2 rounded break-all">
                  {selectedRecord.blockchainHash}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Record
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
