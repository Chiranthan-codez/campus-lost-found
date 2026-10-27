import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c; });
export const errMsg = e => e.response?.data?.message || 'Something went wrong. Please try again.';
export const CATEGORIES = ['electronics', 'id cards', 'wallets', 'keys', 'books', 'bags', 'other'];
export const fmtDate = d => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
export default api;
