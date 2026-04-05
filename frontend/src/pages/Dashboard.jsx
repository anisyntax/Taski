import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getProjects, createProject, deleteProject,
  createTask, toggleTask, deleteTask
} from '../api'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState('')
  const [taskInputs, setTaskInputs] = useState({})
  const nav = useNavigate()

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await getProjects()
    setProjects(data)
  }

  async function addProject(e) {
    e.preventDefault()
    if (!newProject.trim()) return
    await createProject(newProject)
    setNewProject('')
    load()
  }

  async function addTask(projectId) {
    const title = taskInputs[projectId]?.trim()
    if (!title) return
    await createTask(title, projectId)
    setTaskInputs(p => ({ ...p, [projectId]: '' }))
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-black text-indigo-900 tracking-tight">Taski</h1>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('token'); nav('/login') }}
          className="text-sm text-gray-400 hover:text-red-500">
          Log out
        </button>
      </nav>
      
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={addProject} className="flex gap-2 mb-8">
          <input 
            value={newProject} 
            onChange={e => setNewProject(e.target.value)}
            placeholder="New project name..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            + Project
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">{p.name}</h2>
                <button 
                  onClick={async () => { await deleteProject(p.id); load() }}
                  className="text-xs text-gray-300 hover:text-red-400">
                  Delete
                </button>
              </div>

              <ul className="space-y-2 mb-4">
                {p.tasks.map(t => (
                  <li key={t.id} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={t.done}
                      onChange={async () => { await toggleTask(t.id, !t.done); load() }}
                      className="accent-indigo-600"
                    />
                    <span className={`text-sm flex-1 ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {t.title}
                    </span>
                    <button 
                      onClick={async () => { await deleteTask(t.id); load() }}
                      className="text-xs text-gray-200 hover:text-red-400">
                      x
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <input
                  value={taskInputs[p.id] || ''}
                  onChange={e => setTaskInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addTask(p.id)}
                  placeholder="Add a task..."
                  className="flex-1 border rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button 
                  onClick={() => addTask(p.id)}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
