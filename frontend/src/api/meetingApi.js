import { apiClient } from './client'

export const fetchHealth = async () => {
  const { data } = await apiClient.get('/health')
  return data
}

export const transcribeAudio = async ({ file, modelSize, language }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('model_size', modelSize)
  if (language) formData.append('language', language)

  const { data } = await apiClient.post('/transcribe', formData)
  return data
}

export const summarizeTranscript = async ({
  transcript,
  summaryLength,
  summaryType,
  instructions,
}) => {
  const { data } = await apiClient.post('/summarize', {
    transcript,
    summary_length: summaryLength,
    summary_type: summaryType || 'general',
    instructions: instructions || null,
  })
  return data
}

export const exportResults = async (payload) => {
  const response = await apiClient.post('/export', payload, {
    responseType: 'blob',
  })
  return response
}

export const processMeeting = async ({ file, modelSize, language, summaryLength, summaryType, instructions }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('model_size', modelSize)
  formData.append('summary_length', summaryLength)
  formData.append('summary_type', summaryType || 'general')
  if (language) formData.append('language', language)
  if (instructions) formData.append('instructions', instructions)

  const { data } = await apiClient.post('/process', formData)
  return data
}

export const fetchJobStatus = async (jobId) => {
  const { data } = await apiClient.get(`/jobs/${jobId}`)
  return data
}
