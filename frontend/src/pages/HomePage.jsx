import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Settings2, Sparkles, Loader2 } from 'lucide-react'
import { useMeetingStore } from '../store/meetingStore'
import { useTranscribe } from '../hooks/useTranscribe'
import { useHealth } from '../hooks/useHealth'
import { useToast } from '../context/ToastContext'
import ProgressStepper from '../components/ProgressStepper'
import AudioUploader from '../components/AudioUploader'
import LiveRecorder from '../components/LiveRecorder'
import QueryBoundary from '../components/QueryBoundary'
import HowItWorks from '../components/HowItWorks'

const HomePage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: health } = useHealth()
  const {
    currentStep,
    audioFile,
    modelSize,
    summaryLength,
    setSummaryLength,
    language,
    pipelinePhase,
    setPipelinePhase,
    setEditedTranscript,
    errorMessage,
  } = useMeetingStore()

  const transcribeMutation = useTranscribe()
  const [elapsed, setElapsed] = useState(0)

  const isOpenAI = health?.ai_provider === 'openai'
  const isPending = transcribeMutation.isPending

  useEffect(() => {
    if (!isPending) {
      setElapsed(0)
      return
    }
    const start = Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isPending])

  const handleAnalyze = async () => {
    if (!audioFile) return

    try {
      setPipelinePhase('transcribing')
      const transResult = await transcribeMutation.mutateAsync({
        file: audioFile,
        modelSize,
        language: language || undefined,
      })

      setEditedTranscript(transResult.transcript)
      setPipelinePhase(null)
      navigate('/review')
    } catch (err) {
      setPipelinePhase(null)
      toast(err.message || 'Transcription failed', 'error')
    }
  }

  const loadingMessage =
    pipelinePhase === 'transcribing'
      ? `Transcribing your meeting... (${elapsed}s)`
      : 'Processing your meeting...'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Transform Meetings into <span className="text-primary">Intelligence</span>
        </motion.h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Upload or record your meeting audio. Our AI handles transcription, summarization, and
          action item extraction in seconds.
        </p>
      </div>

      <ProgressStepper currentStep={currentStep} />

      <QueryBoundary
        isLoading={isPending}
        isError={!!errorMessage}
        error={{ message: errorMessage }}
        loadingFallback={
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted animate-pulse font-medium">{loadingMessage}</p>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AudioUploader />
            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs font-bold text-muted uppercase">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>
            <LiveRecorder />
          </div>

          <div className="space-y-6">
            <div className="card space-y-6">
              <div className="flex items-center gap-2 text-white font-bold border-b border-border pb-4">
                <Settings2 className="w-5 h-5 text-primary" />
                <h2>Quick Settings</h2>
              </div>

              <p className="text-xs text-muted">
                Open the settings menu in the navbar for meeting type, custom instructions, and
                language.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Summary Detail
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'detailed'].map((len) => (
                    <button
                      key={len}
                      onClick={() => setSummaryLength(len)}
                      disabled={isPending}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all disabled:opacity-50 ${
                        summaryLength === len
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'border-border text-muted hover:border-muted'
                      }`}
                    >
                      {len.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {isOpenAI && (
                <p className="text-xs text-muted bg-background/50 p-2 rounded-lg">
                  Powered by OpenAI Whisper
                </p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!audioFile || isPending}
                className="btn-primary w-full py-4 text-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Transcribe Meeting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </QueryBoundary>

      <HowItWorks health={health} />
    </div>
  )
}

export default HomePage
