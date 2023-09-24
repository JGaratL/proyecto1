
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', 
});

// Interceptor para agregar el token de autorización a las solicitudes
instance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
