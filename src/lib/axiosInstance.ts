import axios from 'axios'
import axiosRetry from 'axios-retry'

const axiosInstance = axios.create()

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
  retryCondition(error) {
    const status = error.response ? error.response.status : null
    switch (status) {
      // Retry only if status is 500 or 501
      case 500:
      case 501:
        return true
      default:
        return false
    }
  }
})

export default axiosInstance
