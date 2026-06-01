import React from 'react'
import { formatTime } from '../utils/meetingHelpers'

const TranscriptTimeline = ({ segments, onSeek }) => {
  if (!segments?.length) return null

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Timeline</h3>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {segments.map((seg, i) => (
          <button
            key={i}
            onClick={() => onSeek?.(seg.start)}
            className="w-full text-left flex gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
          >
            <span className="text-primary font-mono shrink-0 w-14">
              {formatTime(seg.start)}
            </span>
            <span className="text-slate-300 line-clamp-2">{seg.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TranscriptTimeline
