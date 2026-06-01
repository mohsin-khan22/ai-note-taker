import React from 'react'
import { motion } from 'framer-motion'
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
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-3 text-slate-300"
          >
            <span className="text-secondary font-bold">•</span>
            <span>{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default KeyPoints
