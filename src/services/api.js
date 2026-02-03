import axios from "axios"

const api = axios.create({
  baseURL: 'https://debt-management-api.onrender.com'
});

export default api
