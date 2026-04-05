import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()
  
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const submit = async e => {
    e.preventDefault()
    try {
      const { data } = await register(form)
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not register. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      
      {/* Taski Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <span className="text-3xl font-black text-indigo-900 tracking-tight">Taski</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={submit} className="space-y-4">
          <input 
            name="name" 
            placeholder="Full Name" 
            type="text"
            required
            onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input 
            name="email" 
            placeholder="Email" 
            type="email"
            required
            onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input 
            name="password" 
            placeholder="Password" 
            type="password"
            required
            onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Sign up
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
