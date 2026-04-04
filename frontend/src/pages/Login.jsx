import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()
  
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const submit = async e => {
    e.preventDefault()
    try {
      const { data } = await login(form)
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Wrong email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome back</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input 
            name="email" 
            placeholder="Email" 
            type="email"
            onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input 
            name="password" 
            placeholder="Password" 
            type="password"
            onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Log in
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          No account?{' '}
          <Link to="/register" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
