import React from 'react'
import { Target } from 'lucide-react'

const ActionItems = ({ items }) => {
  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-error" />
        <h3 className="text-lg font-bold">Action Items</h3>
      </div>
      <ul className="space-y-3">
        {items.length > 0 ? items.map((item, i) => (
          <li key={i} className="flex gap-3 text-slate-300 p-2 hover:bg-white/5 rounded transition-colors">
            <input type="checkbox" className="mt-1 rounded border-border text-primary focus:ring-primary bg-background" />
            <span>{item}</span>
          </li>
        )) : (
          <p className="text-muted italic">No clear action items detected.</p>
        )}
      </ul>
    </div>
  )
}

export default ActionItems
