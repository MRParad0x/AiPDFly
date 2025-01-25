import axiosInstance from './axiosInstance'

export const fetchChatList = async (userId: string | null) => {
  try {
    const response = await axiosInstance.post('/api/get-chat', { userId })
    return response.data
  } catch (error) {
    console.error('Error fetching chat list:', error)
    throw error // It's a good practice to rethrow the error
  }
}
