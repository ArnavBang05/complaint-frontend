import axios from "axios"

const API = axios.create({
  baseURL: "https://complaint-backend-j2wy.onrender.com/api"
})

// 🔥 AUTO ADD TOKEN TO EVERY REQUEST
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

export default API