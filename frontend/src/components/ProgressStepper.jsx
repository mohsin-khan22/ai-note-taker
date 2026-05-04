import React from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Upload, FileText, Sparkles, Download } from 'lucide-react'
import { clsx } from 'clsx'

const steps = [
  { id: 0, label: 'Upload', icon: Upload },
  { id: 1, label: 'Transcribe', icon: Loader2 },
  { id: 2, label: 'Review', icon: FileText },
  { id: 3, label: 'Summarize', icon: Sparkles },
  { id: 4, label: 'Export', icon: Download },
]

const ProgressStepper = ({ currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {steps.map((step, idx) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          const Icon = step.icon

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted || isActive ? 'var(--tw-colors-primary)' : 'var(--tw-colors-card)',
                  borderColor: isCompleted || isActive ? 'var(--tw-colors-primary)' : 'var(--tw-colors-border)',
                }}
                className={clsx(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg",
                  isActive && "ring-4 ring-primary/20"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <Icon className={clsx(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-muted",
                    isActive && step.id === 1 && "animate-spin"
                  )} />
                )}
              </motion.div>
              <span className={clsx(
                "mt-3 text-xs font-semibold uppercase tracking-wider",
                isActive ? "text-primary" : isCompleted ? "text-slate-200" : "text-muted"
              )}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressStepper
