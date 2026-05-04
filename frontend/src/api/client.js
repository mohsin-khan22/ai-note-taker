import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 300000, // 5 minutes for slow transcriptions
})

// Normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Something went wrong'
    return Promise.reject({ message, status: error.response?.status })
  }
)
