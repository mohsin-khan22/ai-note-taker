import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { queryKeys } from '../api/queryKeys'
import ExportPanel from '../components/ExportPanel'

const ExportPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('Meeting Summary - ' + new Date().toLocaleDateString())
  
  const transcriptData = queryClient.getQueryData(queryKeys.transcription.all)
  const summaryData = queryClient.getQueryData(queryKeys.summary.all)

  if (!transcriptData || !summaryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">No Data to Export</h2>
        <button onClick={() => navigate('/')} className="btn-outline">Go Back</button>
      </div>
    )
  }

  const exportData = {
    title,
    transcript: transcriptData.transcript,
    summary: summaryData.summary,
    keyPoints: summaryData.key_points,
    actionItems: summaryData.action_items
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/results')} className="btn-outline p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight">Finalize Export</h1>
      </div>

      <div className="card space-y-4">
        <label className="text-xs font-bold text-muted uppercase tracking-widest">Document Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <ExportPanel data={exportData} />

      <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
        <CheckCircle2 className="w-6 h-6 text-success" />
        <p className="text-sm text-slate-300">
          Your export will include the full transcript, summary, key points, and action items formatted for professional use.
        </p>
      </div>
    </div>
  )
}

export default ExportPage
