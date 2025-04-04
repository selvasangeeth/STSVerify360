import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Use the environment variableEND_URL, // Use the environment variable
  withCredentials: true,  
});

export default instance;
