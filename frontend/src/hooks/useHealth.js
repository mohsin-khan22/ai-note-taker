import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/health')
      return data
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}
