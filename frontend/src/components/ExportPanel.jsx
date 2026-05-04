import React from 'react'
import { FileText, FileJson, FileType, Download } from 'lucide-react'
import { useExport } from '../hooks/useExport'

const ExportPanel = ({ data }) => {
  const { mutate: exportFile, isPending } = useExport()

  const handleExport = (format) => {
    exportFile({
      format,
      title: data.title,
      date: new Date().toLocaleDateString(),
      transcript: data.transcript,
      summary: data.summary,
      key_points: data.keyPoints,
      action_items: data.actionItems
    })
  }

  const formats = [
    { id: 'txt', label: 'Plain Text (.txt)', icon: FileText, color: 'text-slate-400' },
    { id: 'docx', label: 'Word Document (.docx)', icon: FileType, color: 'text-blue-400' },
    { id: 'pdf', label: 'PDF Document (.pdf)', icon: Download, color: 'text-red-400' },
  ]

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-2">
        <Download className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Export Results</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => handleExport(fmt.id)}
            disabled={isPending}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-background/50 hover:bg-primary/5 hover:border-primary/50 transition-all group disabled:opacity-50"
          >
            <fmt.icon className={`w-10 h-10 mb-3 transition-transform group-hover:scale-110 ${fmt.color}`} />
            <span className="text-sm font-semibold">{fmt.label}</span>
          </button>
        ))}
      </div>
      
      {isPending && (
        <div className="text-center text-sm text-muted animate-pulse">
          Generating file, please wait...
        </div>
      )}
    </div>
  )
}

export default ExportPanel
