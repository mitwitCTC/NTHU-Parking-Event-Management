import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://122.116.23.30:4320'

const Api = axios.create({
  baseURL: apiUrl,
})

export default Api
