import AnalyticsDashboard from "@/components/ai/analytics-dashboard"
import VascularBackground from "@/components/vascular-background"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <VascularBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
