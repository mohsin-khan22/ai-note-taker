import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Download } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload or Record',
    description: 'Drop an audio file or record live from your microphone.',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Transcribe, review, and summarize with key points and action items.',
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'Download professional TXT, DOCX, or PDF reports.',
  },
]

const HowItWorks = ({ health }) => (
  <section className="space-y-8">
    <h2 className="text-2xl font-bold text-center">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="card text-center space-y-3"
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <f.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg">{f.title}</h3>
          <p className="text-sm text-muted">{f.description}</p>
        </motion.div>
      ))}
    </div>
    {health && (
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted">
        <span className="px-3 py-1 rounded-full bg-background border border-border">
          AI: {health.ai_provider}
        </span>
        {health.ffmpeg_available && (
          <span className="px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success">
            ffmpeg ready
          </span>
        )}
        {health.features?.entities_in_export && (
          <span className="px-3 py-1 rounded-full bg-background border border-border">
            Rich exports
          </span>
        )}
      </div>
    )}
  </section>
)

export default HowItWorks
