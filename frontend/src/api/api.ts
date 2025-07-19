import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// User/Auth APIs
export const signup = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post("/users/signup", data);

export const signin = (data: { email: string; password: string }) =>
  API.post("/users/signin", data);

export const getMyProfile = () => API.get("/users/me");

export const updateProfile = (data: {
  name?: string;
  email?: string;
  password?: string;
}) => API.put("/users/update-profile", data);

export const deleteAccount = () => API.delete("/users/profile");


export const getAllProjects = async () => {
  const res = await API.get("/projects");
  return Array.isArray(res.data) ? res.data : [];
};

export const createProject = (data: { name: string; status: string }) =>
  API.post("/projects", data);

export const updateProject = (
  id: string,
  data: { name?: string; status?: string }
) => API.put(`/projects/${id}`, data);

export const deleteProject = (id: string) => API.delete(`/projects/${id}`);

export const getAllTasks = async () => {
  const res = await API.get("/projects/tasks");
  return res.data?.tasks || [];
};


export const getTasksByProjectId = async (projectId: string) => {
  const res = await API.get(`/projects/${projectId}/tasks`);
  return res.data.tasks || [];
};


export const createTask = (
  projectId: string,
  data: { name: string; status?: string }
) => API.post(`/projects/${projectId}/tasks`, data);

export const updateTask = (
  projectId: string,
  taskId: string,
  data: { name?: string; status?: string }
) => API.put(`/projects/${projectId}/tasks/${taskId}`, data);

export const deleteTask = (projectId: string, taskId: string) =>
  API.delete(`/projects/${projectId}/tasks/${taskId}`);

// Export API instance for direct use if needed
export default API;
