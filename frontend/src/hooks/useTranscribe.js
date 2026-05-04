import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transcribeAudio } from '../api/meetingApi'
import { queryKeys } from '../api/queryKeys'
import { useMeetingStore } from '../store/meetingStore'

export const useTranscribe = () => {
  const queryClient = useQueryClient()
  const { setCurrentStep, setErrorMessage } = useMeetingStore()

  return useMutation({
    mutationFn: transcribeAudio,
    onMutate: () => {
      setErrorMessage(null)
      setCurrentStep(1) // Transcribing
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.transcription.all, data)
      setCurrentStep(2) // Ready for summarization (or next step)
    },
    onError: (error) => {
      setErrorMessage(error.message)
      setCurrentStep(0)
    },
  })
}
