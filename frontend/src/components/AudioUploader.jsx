import React, { useCallback } from 'react'
import { Upload, FileAudio, X } from 'lucide-react'
import { useMeetingStore } from '../store/meetingStore'
import { motion, AnimatePresence } from 'framer-motion'

const AudioUploader = () => {
  const { audioFile, setAudioFile } = useMeetingStore()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
    } else {
      alert('Please upload a valid audio file')
    }
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
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-muted group-hover:text-primary transition-colors mb-3" />
                <p className="mb-2 text-sm text-slate-200">
                  <span className="font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted">MP3, WAV, M4A (Max 25MB)</p>
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
