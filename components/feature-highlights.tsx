"use client"

import { motion } from "framer-motion"
import { Mic, BarChart3, Globe, FileAudio, MessageSquare, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureHighlights() {
  const features = [
    {
      icon: Mic,
      title: "Voice-to-SQL Query",
      description: "Speak naturally and our AI converts your voice into precise SQL queries.",
    },
    {
      icon: BarChart3,
      title: "AI-Generated Visualizations",
      description: "Get instant, beautiful visualizations of your data in the most appropriate format.",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Query your data in multiple languages with our advanced language processing.",
    },
    {
      icon: FileAudio,
      title: "Audio File Upload",
      description: "Upload audio files for batch processing of voice queries.",
    },
    {
      icon: MessageSquare,
      title: "AI Chat for Insights",
      description: "Ask follow-up questions and get deeper insights from your data.",
    },
    {
      icon: Zap,
      title: "Smart Query Autocorrection",
      description: "Our AI automatically corrects misheard words and phrases for accurate results.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines voice recognition, AI, and data visualization to provide a seamless experience.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-border/50 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <feature.icon size={24} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

