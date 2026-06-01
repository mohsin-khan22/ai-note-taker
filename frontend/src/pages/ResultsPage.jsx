import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Calendar, Tag } from 'lucide-react'
import { queryKeys } from '../api/queryKeys'
import { useHistoryStore } from '../store/historyStore'
import { useMeetingStore } from '../store/meetingStore'
import TranscriptViewer from '../components/TranscriptViewer'
import TranscriptTimeline from '../components/TranscriptTimeline'
import SummaryCard from '../components/SummaryCard'
import KeyPoints from '../components/KeyPoints'
import ActionItems from '../components/ActionItems'
import EntityTags from '../components/EntityTags'

const ResultsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const transcriptRef = useRef(null)
  const getMeeting = useHistoryStore((s) => s.getMeeting)
  const updateActionItems = useHistoryStore((s) => s.updateActionItems)
  const { currentMeetingId, setCurrentMeetingId } = useMeetingStore()

  const meetingId = id || currentMeetingId
  const savedMeeting = meetingId ? getMeeting(meetingId) : null

  const transcriptData = savedMeeting
    ? {
        transcript: savedMeeting.transcript,
        word_count: savedMeeting.wordCount,
        duration_seconds: savedMeeting.durationSeconds,
        language_detected: savedMeeting.languageDetected,
        segments: savedMeeting.segments,
      }
    : queryClient.getQueryData(queryKeys.transcription.all)

  const summaryData = savedMeeting
    ? {
        summary: savedMeeting.summary,
        key_points: savedMeeting.keyPoints,
        action_items: savedMeeting.actionItems,
        entities: savedMeeting.entities,
      }
    : queryClient.getQueryData(queryKeys.summary.all)

  useEffect(() => {
    if (meetingId) setCurrentMeetingId(meetingId)
  }, [meetingId, setCurrentMeetingId])

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

  const handleActionItemsChange = (items) => {
    if (meetingId) updateActionItems(meetingId, items)
  }

  const handleSeek = (start) => {
    const el = transcriptRef.current
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
    el.dataset.highlight = String(start)
  }

  const title = savedMeeting?.title || 'Analysis Results'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> New Meeting
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {savedMeeting
                  ? new Date(savedMeeting.date).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{(transcriptData.language_detected || 'en').toUpperCase()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(meetingId ? `/export/${meetingId}` : '/export')}
          className="btn-primary px-8 py-3 h-fit"
        >
          <Download className="w-5 h-5" /> Export Results
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-4 space-y-8">
          <SummaryCard summary={summaryData.summary} />
          <KeyPoints points={summaryData.key_points} />
          <EntityTags entities={summaryData.entities} />
          {transcriptData.segments?.length > 0 && (
            <TranscriptTimeline segments={transcriptData.segments} onSeek={handleSeek} />
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          <ActionItems
            items={summaryData.action_items}
            meetingId={meetingId}
            onChange={handleActionItemsChange}
          />
          <div ref={transcriptRef}>
            <TranscriptViewer
              transcript={transcriptData.transcript}
              wordCount={transcriptData.word_count}
              duration={transcriptData.duration_seconds}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsPage
