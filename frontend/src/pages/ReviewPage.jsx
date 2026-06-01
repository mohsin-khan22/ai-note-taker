import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Loader2, FileText } from 'lucide-react'
import { queryKeys } from '../api/queryKeys'
import { useMeetingStore } from '../store/meetingStore'
import { useSummarize } from '../hooks/useSummarize'
import { useHistoryStore } from '../store/historyStore'
import { useToast } from '../context/ToastContext'
import { deriveMeetingTitle, normalizeActionItems } from '../utils/meetingHelpers'
import QueryBoundary from '../components/QueryBoundary'

const ReviewPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const summarizeMutation = useSummarize()
  const saveMeeting = useHistoryStore((s) => s.saveMeeting)
  const {
    editedTranscript,
    setEditedTranscript,
    summaryLength,
    summaryType,
    customInstructions,
    audioFile,
    setCurrentMeetingId,
    errorMessage,
  } = useMeetingStore()

  const transcriptData = queryClient.getQueryData(queryKeys.transcription.all)
  const [text, setText] = useState(editedTranscript || transcriptData?.transcript || '')

  useEffect(() => {
    if (!transcriptData) {
      navigate('/')
      return
    }
    if (!text && transcriptData.transcript) {
      setText(transcriptData.transcript)
      setEditedTranscript(transcriptData.transcript)
    }
  }, [transcriptData, navigate, text, setEditedTranscript])

  const handleContinue = async () => {
    if (!text.trim()) {
      toast('Transcript cannot be empty', 'error')
      return
    }

    setEditedTranscript(text)

    try {
      const summaryData = await summarizeMutation.mutateAsync({
        transcript: text,
        summaryLength,
        summaryType,
        instructions: customInstructions || undefined,
      })

      const title = deriveMeetingTitle(summaryData.summary, audioFile?.name)
      const meetingId = saveMeeting({
        title,
        transcript: text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        durationSeconds: transcriptData.duration_seconds,
        languageDetected: transcriptData.language_detected,
        segments: transcriptData.segments || [],
        summary: summaryData.summary,
        keyPoints: summaryData.key_points,
        actionItems: normalizeActionItems(summaryData.action_items),
        entities: summaryData.entities,
        summaryLength,
        summaryType,
      })

      setCurrentMeetingId(meetingId)
      toast('Meeting analyzed successfully', 'success')
      navigate(`/results/${meetingId}`)
    } catch (err) {
      toast(err.message || 'Summarization failed', 'error')
    }
  }

  if (!transcriptData) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Review Transcript
        </h1>
        <p className="text-muted">
          Edit any mistakes before AI summarization. This improves summary quality.
        </p>
      </div>

      <QueryBoundary
        isLoading={summarizeMutation.isPending}
        isError={!!errorMessage}
        error={{ message: errorMessage }}
        loadingFallback={
          <div className="flex flex-col items-center p-12 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted font-medium">Summarizing your meeting...</p>
          </div>
        }
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
          <div className="flex justify-between text-sm text-muted">
            <span>{text.split(/\s+/).filter(Boolean).length} words</span>
            <span>{(transcriptData.duration_seconds / 60).toFixed(1)} mins</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[400px] bg-background border border-border rounded-xl p-4 text-slate-200 leading-relaxed focus:ring-2 focus:ring-primary outline-none resize-y"
            aria-label="Edit transcript"
          />
          <button
            onClick={handleContinue}
            disabled={summarizeMutation.isPending || !text.trim()}
            className="btn-primary w-full py-4 text-lg"
          >
            {summarizeMutation.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Continue to Summarize
              </>
            )}
          </button>
        </motion.div>
      </QueryBoundary>
    </div>
  )
}

export default ReviewPage
