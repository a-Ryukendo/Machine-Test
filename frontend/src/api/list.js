import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const listAPI = axios.create({
  baseURL: `${API_BASE_URL}/lists`,
  headers: {
    'Content-Type': 'application/json',
  },
});

listAPI.interceptors.request.use(
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

const uploadAndDistribute = async (formData) => {
  console.log('Uploading file with FormData:', formData);
  
  console.log('FormData entries in API:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
  const config = {
    headers: {
    },
  };
  
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token found and added to headers');
  } else {
    console.log('No token found');
  }

  console.log('Request config:', config);
  
  const response = await axios.post(`${API_BASE_URL}/lists/upload`, formData, config);
  return response.data;
};

const getDistributedLists = async () => {
  const response = await listAPI.get('/');
  return response.data;
};

export default {
  uploadAndDistribute,
  getDistributedLists,
};
