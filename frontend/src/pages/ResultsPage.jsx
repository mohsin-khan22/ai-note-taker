import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Calendar, Tag } from 'lucide-react'
import { queryKeys } from '../api/queryKeys'
import TranscriptViewer from '../components/TranscriptViewer'
import SummaryCard from '../components/SummaryCard'
import KeyPoints from '../components/KeyPoints'
import ActionItems from '../components/ActionItems'
import EntityTags from '../components/EntityTags'

const ResultsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const transcriptData = queryClient.getQueryData(queryKeys.transcription.all)
  const summaryData = queryClient.getQueryData(queryKeys.summary.all)

  if (!transcriptData || !summaryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">No Analysis Results Found</h2>
        <p className="text-muted">Please upload a meeting first.</p>
        <button onClick={() => navigate('/')} className="btn-outline">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div className="space-y-2">
          <button onClick={() => navigate('/')} className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /> New Meeting
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight">Analysis Results</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{transcriptData.language_detected.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/export')} className="btn-primary px-8 py-3 h-fit">
          <Download className="w-5 h-5" /> Export Results
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Summary & Highlights */}
        <div className="lg:col-span-4 space-y-8">
          <SummaryCard summary={summaryData.summary} />
          <KeyPoints points={summaryData.key_points} />
          <EntityTags entities={summaryData.entities} />
        </div>

        {/* Right Column: Transcript & Actions */}
        <div className="lg:col-span-8 space-y-8">
          <ActionItems items={summaryData.action_items} />
          <TranscriptViewer 
            transcript={transcriptData.transcript} 
            wordCount={transcriptData.word_count}
            duration={transcriptData.duration_seconds}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsPage
