import { useMutation } from '@tanstack/react-query'
import { exportResults } from '../api/meetingApi'

export const useExport = () => {
  return useMutation({
    mutationFn: exportResults,
    onSuccess: (response, variables) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const ext = variables.format.toLowerCase()
      const fileName = `${variables.title || 'meeting-summary'}.${ext}`
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
  })
}
