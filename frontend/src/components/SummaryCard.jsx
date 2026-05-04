import React from 'react'
import { Sparkles } from 'lucide-react'

const SummaryCard = ({ summary }) => {
  return (
    <div className="card bg-gradient-to-br from-card to-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          AI Summary
        </h2>
      </div>
      <p className="text-lg text-slate-200 leading-relaxed italic">
        "{summary}"
      </p>
    </div>
  )
}

export default SummaryCard
