import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const http = axios.create({
  baseURL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (config.data && typeof config.data === 'object' && !(config.data instanceof URLSearchParams)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(
        new Error('Server unreachable — start API on port 5000 and check MongoDB.')
      );
    }
    const msg = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const root = import.meta.env.VITE_API_URL || '';
  return `${root}${path}`;
}
