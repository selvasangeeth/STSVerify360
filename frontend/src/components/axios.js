import axios from "axios";
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Use the environment variableEND_URL, // Use the environment variable
  withCredentials: true,  
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Store the current location
      localStorage.setItem('lastPath', window.location.pathname);
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Show session expired message
      toast.error('Your session has expired. Please login again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to login after showing the message
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
    return Promise.reject(error);
  }
);

export default instance;
