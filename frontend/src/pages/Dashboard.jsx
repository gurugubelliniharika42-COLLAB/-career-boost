import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { Briefcase, FileText, Video, TrendingUp, ArrowRight, Star, Zap } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalSessions: 0, avgScore: 0, bestScore: 0 })
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewRes, jobRes] = await Promise.all([
          API.get('/interviews/stats'),
          API.get('/users/job-recommendations'),
        ])
        setStats(interviewRes.data.data)
        setJobs(jobRes.data.data.slice(0, 3))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen gradient-bg text-white relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #764ba2, transparent)'}} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">

        {/* Welcome */}
        <div className="mb-10 slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl btn-premium flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-gray-400 text-sm font-medium">Dashboard</span>
          </div>
          <h1 className="text-4xl font-black font-poppins">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋
          </h1>
          <p className="text-gray-400 mt-2">Here's what's happening with your career today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: <Video size={22} />, value: stats.totalSessions, label: 'Mock Interviews', color: 'from-indigo-500 to-purple-600' },
            { icon: <TrendingUp size={22} />, value: `${stats.avgScore}%`, label: 'Avg Score', color: 'from-purple-500 to-pink-600' },
            { icon: <Star size={22} />, value: `${stats.bestScore}%`, label: 'Best Score', color: 'from-pink-500 to-rose-600' },
            { icon: <Briefcase size={22} />, value: `${jobs.length}+`, label: 'Job Matches', color: 'from-blue-500 to-cyan-600' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 card-hover slide-up-delay-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 text-white`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black gradient-text-blue">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { to: '/jobs', icon: <Briefcase size={28} />, title: 'Find Jobs', desc: 'Browse AI-matched recommendations', color: 'from-indigo-500 to-purple-600' },
            { to: '/resume', icon: <FileText size={28} />, title: 'Build Resume', desc: 'Create ATS-optimized resume', color: 'from-purple-500 to-pink-600' },
            { to: '/interviews', icon: <Video size={28} />, title: 'Mock Interview', desc: 'Practice and get AI feedback', color: 'from-pink-500 to-rose-600' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="glass rounded-3xl p-8 card-hover group slide-up-delay-2 block"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-bold font-poppins mb-2">{action.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{action.desc}</p>
              <div className="flex items-center gap-2 text-sm font-semibold gradient-text">
                Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>

        {/* Job Recommendations */}
        <div className="glass rounded-3xl p-8 slide-up-delay-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-poppins">Top Job Matches</h2>
            <Link to="/jobs" className="gradient-text text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading recommendations...</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="glass-dark rounded-2xl p-4 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{job.title}</h3>
                      <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                      <div className="flex gap-2 mt-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="glass text-xs px-2 py-1 rounded-full text-indigo-300">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black gradient-text-blue">{job.matchScore}%</div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard