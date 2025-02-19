import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  timeoutErrorMessage: "O tempo de conexão com o servidor foi excedido.",
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('netflix_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });