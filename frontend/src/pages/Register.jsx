import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Zap } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', formData)
      login(data.data, data.data.token)
      toast.success(`Welcome to CareerBoost, ${data.data.name}!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden py-10">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 right-20 w-72 h-72 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #f093fb, transparent)'}} />
      </div>

      <div className="glass rounded-3xl w-full max-w-md p-8 slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl btn-premium flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black font-poppins gradient-text">Create Account</h1>
          <p className="text-gray-400 mt-2">Join CareerBoost and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl"
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl appearance-none"
              >
                <option value="job_seeker" className="bg-gray-900">Job Seeker</option>
                <option value="student" className="bg-gray-900">Student</option>
                <option value="professional" className="bg-gray-900">Working Professional</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="gradient-text font-bold hover:opacity-80 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register