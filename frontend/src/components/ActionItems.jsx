import React, { useEffect, useState } from 'react'
import { Target } from 'lucide-react'
import { normalizeActionItems } from '../utils/meetingHelpers'

const ActionItems = ({ items, meetingId, onChange }) => {
  const [localItems, setLocalItems] = useState(() => normalizeActionItems(items))

  useEffect(() => {
    setLocalItems(normalizeActionItems(items))
  }, [items])

  const toggleItem = (index) => {
    const updated = localItems.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    )
    setLocalItems(updated)
    onChange?.(updated)
  }

  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-error" />
        <h3 className="text-lg font-bold">Action Items</h3>
        {meetingId && (
          <span className="text-xs text-muted ml-auto">Saved automatically</span>
        )}
      </div>
      <ul className="space-y-3">
        {localItems.length > 0 ? (
          localItems.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-slate-300 p-2 hover:bg-white/5 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(i)}
                className="mt-1 rounded border-border text-primary focus:ring-primary bg-background"
                aria-label={`Mark action item ${i + 1} as done`}
              />
              <span className={item.checked ? 'line-through text-muted' : ''}>{item.text}</span>
            </li>
          ))
        ) : (
          <p className="text-muted italic">No clear action items detected.</p>
        )}
      </ul>
    </div>
  )
}

export default ActionItems
