"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  BarChart3,
  LineChart,
  RefreshCw,
} from "lucide-react"
import { aiAnalyticsEngine, type PredictiveInsight, type AnalyticsModel } from "@/lib/ai/analytics-engine"

export default function AnalyticsDashboard() {
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [models, setModels] = useState<AnalyticsModel[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [healthReport, setHealthReport] = useState<any>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsAnalyzing(true)
    try {
      // Load models
      const modelData = await aiAnalyticsEngine.getModelPerformance()
      setModels(modelData)

      // Generate sample health metrics for analysis
      const sampleMetrics = [
        {
          id: "1",
          name: "Systolic Blood Pressure",
          value: 135,
          unit: "mmHg",
          timestamp: new Date().toISOString(),
          category: "vital" as const,
          riskLevel: "medium" as const,
        },
        {
          id: "2",
          name: "Heart Rate",
          value: 78,
          unit: "bpm",
          timestamp: new Date().toISOString(),
          category: "vital" as const,
          riskLevel: "low" as const,
        },
        {
          id: "3",
          name: "Metformin",
          value: 1,
          unit: "dose",
          timestamp: new Date().toISOString(),
          category: "medication" as const,
          riskLevel: "medium" as const,
        },
      ]

      // Analyze health data
      const analysisResults = await aiAnalyticsEngine.analyzeHealthData("patient-123", sampleMetrics)
      setInsights(analysisResults)

      // Generate health report
      const report = await aiAnalyticsEngine.generateHealthReport("patient-123")
      setHealthReport(report)
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    await loadInitialData()
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
      case "medium":
        return <Activity className="h-4 w-4 text-yellow-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Brain className="h-6 w-6 mr-2 text-red-400" />
            AI Analytics Engine
          </h2>
          <p className="text-gray-400">Predictive insights and health analytics powered by machine learning</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runAnalysis} disabled={isAnalyzing} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="insights" className="data-[state=active]:bg-red-600">
            Predictive Insights
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-red-600">
            AI Models
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-red-600">
            Health Trends
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-red-600">
            Analytics Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {isAnalyzing ? (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-red-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-white font-semibold">AI Analysis in Progress</p>
                  <p className="text-gray-400 text-sm">Processing health data and generating insights...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPriorityIcon(insight.priority)}
                        <div>
                          <CardTitle className="text-white">{insight.title}</CardTitle>
                          <CardDescription className="text-gray-400">{insight.type.replace("_", " ")}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                        <Badge variant="outline" className="text-gray-300">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{insight.description}</p>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <Target className="h-3 w-3 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Data Points Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.dataPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-400">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{model.name}</CardTitle>
                      <CardDescription className="text-gray-400">{model.description}</CardDescription>
                    </div>
                    <Badge
                      className={
                        model.status === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }
                    >
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-white font-semibold capitalize">{model.type.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Accuracy</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={model.accuracy * 100} className="h-2 flex-1" />
                        <span className="text-white font-semibold text-sm">{Math.round(model.accuracy * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Trained</p>
                      <p className="text-white text-sm">{new Date(model.lastTrained).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Actions</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                      >
                        Retrain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {healthReport && (
            <div className="grid gap-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-red-400" />
                    Health Trends Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {healthReport.trends.map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTrendIcon(trend.trend)}
                          <div>
                            <p className="text-white font-semibold">{trend.metric}</p>
                            <p className="text-sm text-gray-400 capitalize">{trend.trend}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${trend.change > 0 ? "text-green-400" : trend.change < 0 ? "text-red-400" : "text-gray-400"}`}
                          >
                            {trend.change > 0 ? "+" : ""}
                            {Math.round(trend.change * 100)}%
                          </p>
                          <p className="text-xs text-gray-400">vs last period</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {healthReport && (
            <div className="grid gap-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-red-400" />
                    Health Summary Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Executive Summary</h4>
                    <p className="text-gray-300">{healthReport.summary}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Risk Factors</h4>
                    <ul className="space-y-2">
                      {healthReport.riskFactors.map((risk: string, index: number) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <AlertTriangle className="h-4 w-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">AI Recommendations</h4>
                    <ul className="space-y-2">
                      {healthReport.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
