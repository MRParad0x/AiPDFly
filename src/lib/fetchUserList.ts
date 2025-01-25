import axiosInstance from './axiosInstance'

export const fetchUserList = async () => {
  try {
    const response = await axiosInstance.post('/api/get-user')
    return response.data
  } catch (error) {
    console.error('Error fetching user list:', error)
    throw error // It's a good practice to rethrow the error
  }
}
