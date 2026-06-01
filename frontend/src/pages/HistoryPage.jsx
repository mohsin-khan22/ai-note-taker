import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { History, Search, Trash2, Calendar, FileText } from 'lucide-react'
import { useHistoryStore } from '../store/historyStore'
import { useToast } from '../context/ToastContext'

const HistoryPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const meetings = useHistoryStore((s) => s.meetings)
  const deleteMeeting = useHistoryStore((s) => s.deleteMeeting)
  const [search, setSearch] = useState('')

  const filtered = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.summary?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteMeeting(id)
    toast('Meeting deleted', 'info', 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <History className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Meeting History</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meetings..."
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12 space-y-4">
          <FileText className="w-12 h-12 text-muted mx-auto" />
          <p className="text-muted">
            {meetings.length === 0
              ? 'No saved meetings yet. Analyze a meeting to see it here.'
              : 'No meetings match your search.'}
          </p>
          <button onClick={() => navigate('/')} className="btn-primary mx-auto">
            Start New Meeting
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/results/${m.id}`)}
              className="card w-full text-left hover:border-primary/50 transition-all group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">{m.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                    <span>{m.wordCount || 0} words</span>
                    <span>{m.actionItems?.length || 0} actions</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, m.id)}
                  className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete meeting"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
