import React, { useEffect } from 'react'
import { Mic, Square } from 'lucide-react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useMeetingStore } from '../store/meetingStore'
import { useToast } from '../context/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'

const LiveRecorder = () => {
  const { toast } = useToast()
  const { setAudioFile } = useMeetingStore()
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder((msg) =>
    toast(msg, 'error')
  )

  useEffect(() => {
    if (audioBlob) {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
      setAudioFile(file)
      toast('Recording saved', 'success', 2000)
    }
  }, [audioBlob, setAudioFile, toast])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-primary rounded-full z-0"
            />
          )}
        </AnimatePresence>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl focus:ring-4 focus:ring-primary/30 outline-none ${
            isRecording ? 'bg-error scale-110' : 'bg-primary hover:bg-primary/90'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      <p
        className={`text-sm font-medium ${isRecording ? 'text-error animate-pulse' : 'text-muted'}`}
      >
        {isRecording ? 'Recording Live Audio...' : 'Start Live Recording'}
      </p>
    </div>
  )
}

export default LiveRecorder
