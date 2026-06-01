import React from 'react'
import { X, Sparkles, Languages, Cpu } from 'lucide-react'
import { useMeetingStore } from '../store/meetingStore'

const SUMMARY_TYPES = [
  { id: 'general', label: 'General' },
  { id: 'standup', label: 'Standup' },
  { id: 'client_call', label: 'Client Call' },
  { id: 'lecture', label: 'Lecture' },
]

const SettingsDrawer = ({ open, onClose, health }) => {
  const {
    modelSize,
    setModelSize,
    summaryLength,
    setSummaryLength,
    summaryType,
    setSummaryType,
    customInstructions,
    setCustomInstructions,
    language,
    setLanguage,
  } = useMeetingStore()

  const isOpenAI = health?.ai_provider === 'openai'

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 shadow-2xl overflow-y-auto"
        role="dialog"
        aria-label="Settings"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold">Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-background rounded-lg" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isOpenAI && (
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
          )}

          {isOpenAI && (
            <p className="text-sm text-muted bg-background/50 p-3 rounded-lg">
              Using OpenAI Whisper API — model size is managed server-side.
            </p>
          )}

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
            <label className="text-xs font-bold text-muted uppercase">Meeting Type</label>
            <select
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            >
              {SUMMARY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase">Custom Instructions</label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus on budget decisions and deadlines"
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
            />
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
      </aside>
    </>
  )
}

export default SettingsDrawer
