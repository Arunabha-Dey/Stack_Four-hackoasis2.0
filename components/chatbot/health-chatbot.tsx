"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain, 
  Activity,
  Stethoscope,
  Dna,
  Microscope
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const HEALTH_TECH_PROMPT = `You are a Health Tech AI Assistant specializing in healthcare, medical information, and biological systems. Your responses should be:

1. **Medically Accurate**: Provide evidence-based health information
2. **Educational**: Explain complex medical concepts in accessible terms
3. **Safety-Focused**: Always recommend consulting healthcare professionals for serious concerns
4. **Comprehensive**: Cover anatomy, physiology, diseases, treatments, and prevention
5. **Up-to-Date**: Base information on current medical knowledge and guidelines

Areas of expertise include:
- Human anatomy and physiology
- Common diseases and conditions
- Medical treatments and procedures
- Preventive healthcare
- Nutrition and wellness
- Mental health awareness
- Biological systems and processes
- Medical technology and innovations

Always include relevant medical disclaimers and encourage professional medical consultation when appropriate.`

const SUGGESTED_QUESTIONS = [
  "What are the symptoms of diabetes?",
  "How does the immune system work?",
  "What is the difference between a virus and bacteria?",
  "How can I improve my heart health?",
  "What causes high blood pressure?",
  "Explain how vaccines work"
]

export function HealthChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Health Tech AI Assistant. I can provide information about health, diseases, and biological systems. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      // Ensure input stays visible and accessible
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      }, 100)
    }
  }, [messages, isTyping])

  const generateHealthResponse = async (userMessage: string): Promise<string> => {
    // Check if Google API key is configured
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    
    if (!googleKey || googleKey === 'your_google_api_key_here') {
      console.log('No Google AI API key configured, using enhanced local simulation')
      return simulateHealthAI(userMessage)
    }

    try {
      // Use Google AI/Gemini API
      return await generateGoogleAIResponse(userMessage, googleKey)
    } catch (error) {
      console.error('Google AI API failed, falling back to local simulation', error)
      // Fallback to enhanced local AI simulation
      return simulateHealthAI(userMessage)
    }
  }



  const generateGoogleAIResponse = async (userMessage: string, apiKey: string): Promise<string> => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${HEALTH_TECH_PROMPT}\n\nUser Question: ${userMessage}\n\nPlease provide a comprehensive medical response:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`)
    }
  }

  const simulateHealthAI = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Enhanced health-related keyword responses with more detailed information
    if (lowerMessage.includes("diabetes")) {
      return "Diabetes is a chronic metabolic disorder characterized by elevated blood glucose levels. Type 1 diabetes is an autoimmune condition where the immune system destroys insulin-producing beta cells in the pancreas. Type 2 diabetes involves insulin resistance and relative insulin deficiency. Symptoms include polyuria (frequent urination), polydipsia (excessive thirst), polyphagia (increased hunger), fatigue, and blurred vision. Diagnosis involves fasting glucose tests, HbA1c, and glucose tolerance tests. Management includes blood glucose monitoring, medications (metformin, insulin), dietary modifications, regular exercise, and complication screening. Complications can affect eyes (retinopathy), kidneys (nephropathy), nerves (neuropathy), and cardiovascular system."
    }
    
    if (lowerMessage.includes("immune system")) {
      return "The immune system is a sophisticated defense network comprising innate and adaptive components. Innate immunity provides immediate, non-specific protection through physical barriers, phagocytes, and complement proteins. Adaptive immunity develops targeted responses via B cells (antibody production) and T cells (cell-mediated immunity). Key organs include bone marrow, thymus, lymph nodes, and spleen. The system maintains immune memory for rapid secondary responses. Dysfunction can lead to immunodeficiency, autoimmunity, or allergies. Support strategies include adequate sleep, balanced nutrition rich in vitamins C, D, and zinc, regular exercise, stress management, and proper vaccination schedules."
    }
    
    if (lowerMessage.includes("virus") && lowerMessage.includes("bacteria")) {
      return "Bacteria and viruses represent fundamentally different pathogenic agents. Bacteria are prokaryotic organisms with cellular structures (cell wall, ribosomes, DNA), capable of independent reproduction through binary fission. They're often susceptible to antibiotics. Viruses are acellular infectious agents requiring host cellular machinery for replication. They consist of genetic material (DNA or RNA) enclosed in protein capsids, sometimes with lipid envelopes. Size difference: bacteria are typically 0.2-5.0 μm, viruses 0.02-0.3 μm. Treatment approaches differ significantly - bacterial infections may respond to targeted antibiotics, while viral infections often require supportive care, antiviral medications, or vaccination prevention."
    }
    
    if (lowerMessage.includes("heart health")) {
      return "Cardiovascular health involves multiple interconnected factors. Primary prevention includes dietary modifications (Mediterranean diet, omega-3 fatty acids, reduced saturated fats), regular aerobic exercise (150 minutes moderate intensity weekly), weight management (BMI 18.5-24.9), blood pressure control (<120/80 mmHg), cholesterol optimization (LDL <100 mg/dL), diabetes management, stress reduction techniques, adequate sleep (7-9 hours), and tobacco cessation. Secondary prevention involves medication compliance, regular monitoring, and lifestyle adherence. Warning signs include chest pain/pressure, dyspnea, palpitations, syncope, and unusual fatigue. Regular healthcare provider consultations are essential for risk assessment and intervention."
    }
    
    if (lowerMessage.includes("blood pressure")) {
      return "Hypertension is defined as consistent blood pressure ≥140/90 mmHg (or ≥130/80 mmHg per ACC/AHA guidelines). Primary hypertension has no identifiable cause, while secondary hypertension results from underlying conditions (renal disease, endocrine disorders). Risk factors include age, family history, obesity, sedentary lifestyle, high sodium intake, excessive alcohol consumption, stress, and certain medications. It's often asymptomatic, earning the moniker 'silent killer.' Target organ damage affects heart (LVH, heart failure), brain (stroke, dementia), kidneys (proteinuria, renal failure), and vasculature (atherosclerosis). Management includes lifestyle modifications (DASH diet, exercise, weight loss) and various antihypertensive medications."
    }
    
    if (lowerMessage.includes("vaccine")) {
      return "Vaccines are biological preparations that induce active acquired immunity against specific diseases. They contain antigens (weakened pathogens, inactivated organisms, subunit proteins, or mRNA) that stimulate immune responses without causing disease. The adaptive immune system produces antibodies and memory cells, providing long-term protection. Types include live-attenuated, inactivated, subunit, toxoid, and mRNA vaccines. Vaccination has eradicated smallpox and dramatically reduced diseases like polio, measles, and diphtheria. Herd immunity protects vulnerable populations. Vaccines undergo extensive safety testing and continuous monitoring. They're considered one of medicine's most significant achievements, preventing millions of deaths annually."
    }
    
    // Enhanced responses for more health topics
    if (lowerMessage.includes("cancer")) {
      return "Cancer represents uncontrolled cellular growth and division. It develops through genetic mutations affecting proto-oncogenes, tumor suppressor genes, and DNA repair genes. Hallmarks include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. Risk factors include genetic predisposition, environmental exposures (tobacco, radiation), infections (HPV, H. pylori), lifestyle factors, and aging. Treatment modalities include surgery, chemotherapy, radiation therapy, immunotherapy, targeted therapy, and hormone therapy. Early detection through screening significantly improves outcomes. Prevention involves lifestyle modifications, vaccination, and avoiding carcinogens."
    }
    
    if (lowerMessage.includes("mental health")) {
      return "Mental health encompasses emotional, psychological, and social well-being. Common conditions include depression (persistent sadness, loss of interest), anxiety disorders (excessive worry, panic attacks), bipolar disorder (mood cycling), schizophrenia (psychosis, disorganized thinking), and PTSD (trauma-related symptoms). Contributing factors include genetics, brain chemistry, life experiences, and family history. Treatment approaches include psychotherapy (CBT, DBT, psychodynamic), medications (antidepressants, anxiolytics, mood stabilizers), lifestyle interventions, and support systems. Early intervention improves outcomes. Maintaining mental wellness involves stress management, social connections, physical activity, adequate sleep, and professional support when needed."
    }
    
    // Default response with more substance
    return `Based on your health question about "${userMessage}", I can provide general medical information. However, healthcare is highly individualized, and this information shouldn't replace professional medical advice. Key principles include understanding your personal risk factors, maintaining regular healthcare provider relationships, seeking prompt evaluation for concerning symptoms, and following evidence-based prevention strategies. For specific medical concerns, always consult qualified healthcare professionals who can perform appropriate examinations, order necessary tests, and provide personalized treatment recommendations based on your complete medical history and current health status.`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await generateHealthResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your health question. Please try again or consult with a healthcare professional for urgent medical concerns.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground z-50 transition-all duration-200 hover:scale-105"
      >
        <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 w-[calc(100vw-2rem)] h-[400px] sm:w-[380px] sm:h-[450px] max-w-[400px] shadow-2xl z-50 bg-card border-border flex flex-col rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Health Tech AI</CardTitle>
            <Badge variant="secondary" className="text-xs font-medium">
              <Activity className="w-2 h-2 mr-1" />
              Online
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 p-0 rounded-full hover:bg-primary/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 min-h-0 max-h-[calc(100%-140px)]" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.role === 'assistant' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-primary" />
                    ) : (
                      <User className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className={`rounded-xl p-4 shadow-sm ${
                    message.role === 'assistant' 
                      ? 'bg-primary/5 border border-primary/10 rounded-tl-none' 
                      : 'bg-accent/5 border border-accent/10 rounded-tr-none'
                  }`}>
                    <p className="text-sm leading-relaxed mb-2">{message.content}</p>
                    <p className="text-xs text-muted-foreground opacity-70">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="rounded-xl p-4 bg-primary/5 border border-primary/10 rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm flex-shrink-0">
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs h-6 px-3 bg-background/50 hover:bg-background/80 border-primary/20 hover:border-primary/40 transition-all duration-200"
                >
                  {question.length > 25 ? question.substring(0, 22) + '...' : question}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your health question..."
              className="flex-1 bg-background/80 text-sm h-10 rounded-xl border-primary/20 focus:border-primary/40"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isTyping}
              className="px-3 h-10 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 flex-shrink-0"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}