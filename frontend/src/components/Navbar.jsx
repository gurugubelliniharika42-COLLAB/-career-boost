import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, LayoutDashboard, FileText, Video, User, LogOut, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={16} /> },
    { to: '/resume', label: 'Resume', icon: <FileText size={16} /> },
    { to: '/interviews', label: 'Interviews', icon: <Video size={16} /> },
    { to: '/profile', label: 'Profile', icon: <User size={16} /> },
  ]

  return (
    <nav className="glass-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-premium flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-xl font-black font-poppins gradient-text">CareerBoost</span>
        </Link>

        {/* Desktop */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'gradient-text'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {!user && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition">Login</Link>
            <Link to="/register" className="btn-premium text-white px-5 py-2 rounded-xl text-sm font-bold">Get Started</Link>
          </div>
        )}

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-400">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-400">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-bold gradient-text">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar