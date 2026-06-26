import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', formData)
      login(data.data, data.data.token)
      toast.success(`Welcome back, ${data.data.name}!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 left-20 w-72 h-72 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #764ba2, transparent)'}} />
      </div>

      <div className="glass rounded-3xl w-full max-w-md p-8 slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl btn-premium flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black font-poppins gradient-text">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Login to your CareerBoost account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-dark w-full pl-11 pr-11 py-3.5 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="gradient-text font-bold hover:opacity-80 transition">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login