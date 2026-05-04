import React from 'react'
import { FileText, Clock, Type } from 'lucide-react'

const TranscriptViewer = ({ transcript, wordCount, duration }) => {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Full Transcript</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-1">
            <Type className="w-4 h-4" />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{(duration / 60).toFixed(1)} mins</span>
          </div>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {transcript}
        </p>
      </div>
    </div>
  )
}

export default TranscriptViewer
