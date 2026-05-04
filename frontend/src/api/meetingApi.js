import { apiClient } from './client'

export const transcribeAudio = async ({ file, modelSize, language }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('model_size', modelSize)
  if (language) formData.append('language', language)

  const { data } = await apiClient.post('/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const summarizeTranscript = async ({ transcript, summaryLength }) => {
  const { data } = await apiClient.post('/summarize', {
    transcript,
    summary_length: summaryLength,
  })
  return data
}

export const exportResults = async (payload) => {
  const response = await apiClient.post('/export', payload, {
    responseType: 'blob'
  })
  return response
}
