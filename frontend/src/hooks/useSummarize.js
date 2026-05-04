import { useMutation, useQueryClient } from '@tanstack/react-query'
import { summarizeTranscript } from '../api/meetingApi'
import { queryKeys } from '../api/queryKeys'
import { useMeetingStore } from '../store/meetingStore'

export const useSummarize = () => {
  const queryClient = useQueryClient()
  const { setCurrentStep, setErrorMessage } = useMeetingStore()

  return useMutation({
    mutationFn: summarizeTranscript,
    onMutate: () => {
      setCurrentStep(3) // Summarizing
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.summary.all, data)
      setCurrentStep(4) // Completed
    },
    onError: (error) => {
      setErrorMessage(error.message)
      setCurrentStep(2) // Back to transcription result step
    },
  })
}
