import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase.auth.token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('supabase.auth.token');

        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }

      toast.error(
        error.response.data?.error || 'Something went wrong'
      );
    } else {
      toast.error('Network Error. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;