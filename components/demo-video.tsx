"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function DemoVideo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See VoiceViz in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how easy it is to transform your voice queries into powerful visualizations
          </p>
        </div>

        <motion.div
          className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={() => setIsOpen(true)}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent text-white">
              <h3 className="text-xl font-semibold">Voice to Visualization Demo</h3>
              <p className="text-sm opacity-90">See how to analyze sales data with just your voice</p>
            </div>
          </div>
        </motion.div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="/placeholder.svg?height=480&width=854"
                title="Voice to Visualization Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

