// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project API calls
export const getProjects = async (status = null) => {
  let url = '/projects/';
  if (status) {
    url = `/projects/${status}/`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}/`);
  return response.data;
};

export const getProjectRoads = async (id) => {
  const response = await api.get(`/projects/${id}/roads/`);
  return response.data;
};

// Road API calls
export const getRoads = async (filters = {}) => {
  const response = await api.get('/roads/', { params: filters });
  return response.data;
};

export const getRoadById = async (id) => {
  const response = await api.get(`/roads/${id}/`);
  return response.data;
};

export const updateRoad = async (id, data) => {
  const response = await api.patch(`/roads/${id}/`, data);
  return response.data;
};

export default api;