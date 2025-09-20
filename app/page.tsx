import { VascularBackground } from "@/components/vascular-background"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Activity, Lock, Zap, Database } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <VascularBackground />

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </a>
            <a href="#integration" className="text-muted-foreground hover:text-foreground transition-colors">
              Integration
            </a>
            <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Analytics
            </Link>
            <Link href="/blockchain" className="text-muted-foreground hover:text-foreground transition-colors">
              Blockchain
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Blockchain-Powered Healthcare Infrastructure
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Universal Health Records
            <span className="block bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Powered by Blockchain
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Secure, decentralized, and patient-controlled health data management. Experience the future of healthcare
            with immutable records and zero-knowledge privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Launch Patient Dashboard
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 bg-transparent"
              >
                View AI Analytics
              </Button>
            </Link>
            <Link href="/blockchain">
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 bg-transparent"
              >
                View Blockchain Status
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Healthcare Infrastructure for the Future</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on blockchain technology with patient-centric design and enterprise-grade security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Zero-Knowledge Privacy</CardTitle>
                <CardDescription>
                  Advanced cryptographic proofs ensure data access without revealing content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Patients control who sees what, when, and for how long with granular permissions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <Database className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Immutable Records</CardTitle>
                <CardDescription>Blockchain-secured health data with tamper-proof audit trails</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every access and modification is permanently logged for complete transparency
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-chart-3/50 transition-colors">
              <CardHeader>
                <Users className="w-8 h-8 text-chart-3 mb-2" />
                <CardTitle>EHR Integration</CardTitle>
                <CardDescription>Seamless compatibility with existing healthcare systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  FHIR-compliant APIs enable smooth data exchange with legacy systems
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Activity className="w-8 h-8 text-primary mb-2" />
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>Predictive insights from anonymized health data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Early risk detection and clinical decision support powered by machine learning
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <Lock className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Biometric Security</CardTitle>
                <CardDescription>Multi-factor authentication with biometric verification</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Touch ID, Face ID, and cryptographic keys ensure only authorized access
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-chart-3/50 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-chart-3 mb-2" />
                <CardTitle>High Performance</CardTitle>
                <CardDescription>1000+ TPS blockchain with sub-2 second data retrieval</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Horizontally scalable architecture supporting millions of users
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Analytics
              </Link>
              <Link href="/blockchain" className="text-muted-foreground hover:text-foreground transition-colors">
                Blockchain
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2025 Stack Four. Transforming healthcare through blockchain technology.
          </div>
        </div>
      </footer>
    </div>
  )
}
