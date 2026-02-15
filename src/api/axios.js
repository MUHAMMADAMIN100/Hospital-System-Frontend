import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/apihttps://hospital-system-backend-rqkm.onrender.com/api",
  // withCredentials: true, // если понадобятся куки
});

export default api;
