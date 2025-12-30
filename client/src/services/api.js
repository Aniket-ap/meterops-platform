import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response && response.data == null) {
      response.data = { success: false, message: 'No data returned', data: null };
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    const hasMessage = error?.response?.data && error.response.data.message;
    if (!hasMessage) {
      const data = error?.response?.data || {};
      error.response = {
        ...(error.response || {}),
        data: { ...data, message: 'An unexpected error occurred. Please try again.' },
      };
    }
    return Promise.reject(error);
  }
);

export default api;
