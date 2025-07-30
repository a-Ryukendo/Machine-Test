import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const agentAPI = axios.create({
  baseURL: `${API_BASE_URL}/agents`,
  headers: {
    'Content-Type': 'application/json',
  },
});

agentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const createAgent = async (agentData) => {
  const response = await agentAPI.post('/', agentData);
  return response.data;
};

const getAgents = async () => {
  const response = await agentAPI.get('/');
  return response.data;
};

const getAgentById = async (id) => {
  const response = await agentAPI.get(`/${id}`);
  return response.data;
};

const updateAgent = async (id, agentData) => {
  const response = await agentAPI.put(`/${id}`, agentData);
  return response.data;
};

const deleteAgent = async (id) => {
  const response = await agentAPI.delete(`/${id}`);
  return response.data;
};

export default {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};