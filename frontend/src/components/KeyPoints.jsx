import React from 'react'
import { ListChecks } from 'lucide-react'

const KeyPoints = ({ points }) => {
  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-bold">Key Points</h3>
      </div>
      <ul className="space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex gap-3 text-slate-300">
            <span className="text-secondary font-bold">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default KeyPoints
