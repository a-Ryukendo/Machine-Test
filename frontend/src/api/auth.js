import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const loginUser = async (email, password) => {
  const response = await authAPI.post('/login', { email, password });
  return response;
};

const registerUser = async (email, password, role = 'admin') => {
  const response = await authAPI.post('/register', { email, password, role });
  return response;
};

export default {
  loginUser,
  registerUser,
};