import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Automatically attach the JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = form => api.post('/auth/login', form)
export const register = form => api.post('/auth/register', form)

// Projects
export const getProjects = () => api.get('/projects')
export const createProject = name => api.post('/projects', { name })
export const deleteProject = id => api.delete(`/projects/${id}`)

// Tasks
export const createTask = (title, projectId) => api.post('/tasks', { title, projectId })
export const toggleTask = (id, done) => api.patch(`/tasks/${id}`, { done })
export const deleteTask = id => api.delete(`/tasks/${id}`)

export default api
