import React, { useCallback, useState } from 'react'
import { Upload, FileAudio, X } from 'lucide-react'
import { useMeetingStore } from '../store/meetingStore'
import { useToast } from '../context/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_BYTES = 25 * 1024 * 1024

const AudioUploader = () => {
  const { audioFile, setAudioFile } = useMeetingStore()
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSet = useCallback(
    (file) => {
      if (!file) return
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|webm|ogg|flac|mp4)$/i)) {
        toast('Please upload a valid audio file', 'error')
        return
      }
      if (file.size > MAX_BYTES) {
        toast('File exceeds 25 MB limit', 'error')
        return
      }
      setAudioFile(file)
      toast('Audio file ready', 'success', 2000)
    },
    [setAudioFile, toast]
  )

  const handleFileChange = (e) => {
    validateAndSet(e.target.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    validateAndSet(file)
  }

  const clearFile = () => setAudioFile(null)

  return (
    <div className="card w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!audioFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <Upload
                  className={`w-12 h-12 mb-3 transition-colors ${
                    isDragging ? 'text-primary' : 'text-muted group-hover:text-primary'
                  }`}
                />
                <p className="mb-2 text-sm text-slate-200">
                  <span className="font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted">MP3, WAV, M4A, WebM (Max 25MB)</p>
              </div>
              <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileAudio className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                  {audioFile.name}
                </p>
                <p className="text-xs text-muted">
                  {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-error/10 text-muted hover:text-error rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AudioUploader
