import axiosInstance from './axiosInstance'

export const fetchSubscriptionList = async () => {
  try {
    const response = await axiosInstance.post('/api/get-all-subscription')
    return response.data
  } catch (error) {
    console.error('Error fetching subscription list:', error)
    throw error // It's a good practice to rethrow the error
  }
}
