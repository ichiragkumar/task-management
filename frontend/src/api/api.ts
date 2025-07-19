import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data: any) => API.post("/users/signup", data);
export const signin = (data: any) => API.post("/users/signin", data);
export const createProject = (data: any) => API.post("/projects", data);
export const updateProject = (id: string, data: any) =>
  API.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => API.delete(`/projects/${id}`);

export const getTasksByProjectId = (id: string) =>
  API.get(`/projects/${id}/tasks`);
export const createTask = (projectId: string, data: any) =>
  API.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (projectId: string, taskId: string, data: any) =>
  API.put(`/projects/${projectId}/tasks/${taskId}`, data);
export const deleteTask = (projectId: string, taskId: string) =>
  API.delete(`/projects/${projectId}/tasks/${taskId}`);

export const getAllProjects = async () => {
  const res = await API.get("/projects");
  return Array.isArray(res.data) ? res.data : [];
};

export const getAllTasks = () => API.get("/projects/tasks");
