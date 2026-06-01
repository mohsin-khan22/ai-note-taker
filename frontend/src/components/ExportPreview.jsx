import React from 'react'
import { FileText } from 'lucide-react'
import { actionItemsForExport } from '../utils/meetingHelpers'

const ExportPreview = ({ data }) => {
  if (!data) return null

  const entities = data.entities
  const hasEntities =
    entities &&
    (entities.people?.length ||
      entities.organizations?.length ||
      entities.dates?.length ||
      entities.locations?.length)

  const preview = `# ${data.title}
Date: ${data.date}

## Summary
${data.summary}

## Key Points
${(data.keyPoints || []).map((p) => `- ${p}`).join('\n')}

## Action Items
${actionItemsForExport(data.actionItems).map((a) => `- ${a}`).join('\n')}
${hasEntities ? `\n## Key People & Organizations\n${[
    ...(entities.people || []).map((p) => `- Person: ${p}`),
    ...(entities.organizations || []).map((o) => `- Org: ${o}`),
  ].join('\n')}` : ''}

## Transcript
${(data.transcript || '').slice(0, 500)}${(data.transcript?.length || 0) > 500 ? '...' : ''}
`

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Export Preview</h2>
      </div>
      <pre className="text-xs text-slate-300 bg-background/50 p-4 rounded-lg max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
        {preview}
      </pre>
    </div>
  )
}

export default ExportPreview
