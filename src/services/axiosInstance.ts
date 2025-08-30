import axios, { type AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios.interceptors.request.use(
//   (config) => {
//     if(config.url?.includes('/auth/*')) {
//         return config;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle auth errors globally
//     if (error.response?.status === 401) {
//       // Clear local storage on unauthorized
//       localStorage.removeItem('11fire_user');
//       localStorage.removeItem('11fire_groups');
      
//       // Only redirect if not already on auth page
//       if (!window.location.pathname.startsWith('/auth')) {
//         window.location.href = '/auth/signin';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default Axios;
