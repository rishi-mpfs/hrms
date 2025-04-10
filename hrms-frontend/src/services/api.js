// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ Your backend base URL
  withCredentials: true,               // ✅ Sends cookies with every request
});

export default api;
