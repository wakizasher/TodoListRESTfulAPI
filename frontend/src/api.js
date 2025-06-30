import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post(
      "/login",
      {
        username: email, // FastAPI expects 'username' field
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // Convert to form data for OAuth2
        transformRequest: [
          (data) => {
            const params = new URLSearchParams();
            params.append("username", data.username);
            params.append("password", data.password);
            return params;
          },
        ],
      }
    );
    return response.data;
  },

  register: async (email, password) => {
    const response = await api.post("/users/", {
      email: email,
      password: password,
    });
    return response.data;
  },
};

// Task functions
export const taskAPI = {
  getTasks: async () => {
    const response = await api.get("/tasks/");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/tasks/", taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
