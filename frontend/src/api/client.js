import axios from 'axios'

// Use Vite dev proxy (/api -> localhost:8000) to avoid CORS; override via .env for production
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
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
