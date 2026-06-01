import { useMutation } from '@tanstack/react-query'
import { processMeeting, fetchJobStatus } from '../api/meetingApi'

const pollJob = async (jobId, onProgress) => {
  const maxAttempts = 120
  for (let i = 0; i < maxAttempts; i++) {
    const job = await fetchJobStatus(jobId)
    onProgress?.(job)
    if (job.status === 'completed') return job.result
    if (job.status === 'failed') throw new Error(job.error || 'Processing failed')
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error('Processing timed out')
}

export const useProcess = () => {
  return useMutation({
    mutationFn: async (params) => {
      const { job_id } = await processMeeting(params)
      return pollJob(job_id, params.onProgress)
    },
  })
}
