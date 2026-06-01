import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { queryKeys } from '../api/queryKeys'
import { useHistoryStore } from '../store/historyStore'
import ExportPanel from '../components/ExportPanel'
import ExportPreview from '../components/ExportPreview'

const ExportPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const getMeeting = useHistoryStore((s) => s.getMeeting)
  const savedMeeting = id ? getMeeting(id) : null

  const transcriptData = savedMeeting
    ? { transcript: savedMeeting.transcript }
    : queryClient.getQueryData(queryKeys.transcription.all)

  const summaryData = savedMeeting
    ? {
        summary: savedMeeting.summary,
        key_points: savedMeeting.keyPoints,
        action_items: savedMeeting.actionItems,
        entities: savedMeeting.entities,
      }
    : queryClient.getQueryData(queryKeys.summary.all)

  const [title, setTitle] = useState(
    savedMeeting?.title || 'Meeting Summary - ' + new Date().toLocaleDateString()
  )

  if (!transcriptData || !summaryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">No Data to Export</h2>
        <button onClick={() => navigate('/')} className="btn-outline">
          Go Back
        </button>
      </div>
    )
  }

  const exportData = {
    title,
    transcript: transcriptData.transcript,
    summary: summaryData.summary,
    keyPoints: summaryData.key_points,
    actionItems: summaryData.action_items,
    entities: summaryData.entities,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(id ? `/results/${id}` : '/results')}
          className="btn-outline p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight">Finalize Export</h1>
      </div>

      <div className="card space-y-4">
        <label className="text-xs font-bold text-muted uppercase tracking-widest">
          Document Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <ExportPreview data={{ ...exportData, date: new Date().toLocaleDateString() }} />
      <ExportPanel data={exportData} />

      <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
        <CheckCircle2 className="w-6 h-6 text-success" />
        <p className="text-sm text-slate-300">
          Your export includes transcript, summary, key points, action items, and entities.
        </p>
      </div>
    </div>
  )
}

export default ExportPage
