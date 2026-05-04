import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Settings2, Languages, Cpu, Sparkles, Loader2 } from 'lucide-react'
import { useMeetingStore } from '../store/meetingStore'
import { useTranscribe } from '../hooks/useTranscribe'
import { useSummarize } from '../hooks/useSummarize'
import ProgressStepper from '../components/ProgressStepper'
import AudioUploader from '../components/AudioUploader'
import LiveRecorder from '../components/LiveRecorder'
import QueryBoundary from '../components/QueryBoundary'

const HomePage = () => {
  const navigate = useNavigate()
  const { 
    currentStep, audioFile, modelSize, setModelSize, 
    summaryLength, setSummaryLength, language, setLanguage,
    errorMessage
  } = useMeetingStore()

  const transcribeMutation = useTranscribe()
  const summarizeMutation = useSummarize()

  const handleAnalyze = async () => {
    if (!audioFile) return

    try {
      // 1. Transcribe
      const transResult = await transcribeMutation.mutateAsync({
        file: audioFile,
        modelSize,
        language: language || undefined
      })

      // 2. Summarize
      await summarizeMutation.mutateAsync({
        transcript: transResult.transcript,
        summaryLength
      })

      // 3. Navigate to results
      navigate('/results')
    } catch (err) {
      console.error('Analysis pipeline failed', err)
    }
  }

  const isPending = transcribeMutation.isPending || summarizeMutation.isPending

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Transform Meetings into <span className="text-primary">Intelligence</span>
        </motion.h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Upload or record your meeting audio. Our AI handles transcription, summarization, and action item extraction in seconds.
        </p>
      </div>

      <ProgressStepper currentStep={currentStep} />

      <QueryBoundary 
        isLoading={isPending} 
        isError={!!errorMessage} 
        error={{ message: errorMessage }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            <AudioUploader />
            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs font-bold text-muted uppercase">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>
            <LiveRecorder />
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="card space-y-6">
              <div className="flex items-center gap-2 text-white font-bold border-b border-border pb-4">
                <Settings2 className="w-5 h-5 text-primary" />
                <h2>Analysis Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Whisper Model
                  </label>
                  <select 
                    value={modelSize}
                    onChange={(e) => setModelSize(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="tiny">Tiny (Fastest)</option>
                    <option value="base">Base (Balanced)</option>
                    <option value="small">Small (Better)</option>
                    <option value="medium">Medium (Accurate)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Summary Detail
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['short', 'medium', 'detailed'].map((len) => (
                      <button
                        key={len}
                        onClick={() => setSummaryLength(len)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
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

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase flex items-center gap-1">
                    <Languages className="w-3 h-3" /> Language (Optional)
                  </label>
                  <input 
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Auto-detect"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!audioFile || isPending}
                className="btn-primary w-full py-4 text-lg"
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Analyze Meeting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </QueryBoundary>
    </div>
  )
}

export default HomePage
