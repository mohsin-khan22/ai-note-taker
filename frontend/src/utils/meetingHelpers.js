export function normalizeActionItems(items) {
  if (!items?.length) return []
  return items.map((item) => {
    if (typeof item === 'string') {
      return { text: item, checked: false }
    }
    return {
      text: item.text || item,
      checked: Boolean(item.checked),
      assignee: item.assignee || '',
      due: item.due || '',
    }
  })
}

export function actionItemsForExport(items) {
  return normalizeActionItems(items).map((item) => {
    const prefix = item.checked ? '[x] ' : '[ ] '
    return prefix + item.text
  })
}

export function deriveMeetingTitle(summary, fileName) {
  if (summary) {
    const first = summary.split(/[.!?]/)[0]?.trim()
    if (first && first.length > 10) {
      return first.length > 60 ? first.slice(0, 57) + '...' : first
    }
  }
  if (fileName) {
    return fileName.replace(/\.[^.]+$/, '')
  }
  return `Meeting ${new Date().toLocaleDateString()}`
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
