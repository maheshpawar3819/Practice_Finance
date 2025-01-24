import axios from "axios";

const API_URL = "http://localhost:8080";

export const googleLoginSuccess = () =>
  axios.get(`${API_URL}/auth/login/google/success`);
export const linkedinLoginSuccess = () =>
  axios.get(`${API_URL}/auth/login/linkedin/success`);
export const googleLoginFailure = () =>
  axios.get(`${API_URL}/auth/login/google/failure`);
export const linkedinLoginFailure = () =>
  axios.get(`${API_URL}/auth/login/linkedin/failure`);
export const createUser = (data) =>
  axios.post(`${API_URL}/auth/create-user`, data);
export const fetchUsers = () => axios.get(`${API_URL}/auth/users`);
