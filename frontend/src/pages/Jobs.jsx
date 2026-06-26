import { useEffect, useState } from 'react'
import API from '../api/axios'
import { Briefcase, MapPin, DollarSign, Building, Search } from 'lucide-react'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [workType, setWorkType] = useState('all')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/users/job-recommendations')
        setJobs(data.data)
        setFiltered(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    let result = jobs
    if (search) {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase()) ||
          j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
    }
    if (workType !== 'all') {
      result = result.filter((j) => j.type === workType)
    }
    setFiltered(result)
  }, [search, workType, jobs])

  const typeColor = {
    remote: 'bg-green-500/20 text-green-400 border border-green-500/30',
    onsite: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    hybrid: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  }

  return (
    <div className="min-h-screen gradient-bg text-white relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 left-20 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #764ba2, transparent)'}} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">

        {/* Header */}
        <div className="mb-8 slide-up">
          <h1 className="text-4xl font-black font-poppins">
            Job <span className="gradient-text">Recommendations</span>
          </h1>
          <p className="text-gray-400 mt-2">AI-matched jobs based on your skills and preferences</p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 slide-up-delay-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by title, company or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark w-full pl-11 pr-4 py-3 rounded-xl"
            />
          </div>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="input-dark px-4 py-3 rounded-xl"
          >
            <option value="all" className="bg-gray-900">All Types</option>
            <option value="remote" className="bg-gray-900">Remote</option>
            <option value="onsite" className="bg-gray-900">Onsite</option>
            <option value="hybrid" className="bg-gray-900">Hybrid</option>
          </select>
        </div>

        {/* Jobs */}
        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500 text-lg">No jobs found. Update your skills in profile!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((job) => (
              <div key={job.id} className="glass rounded-3xl p-6 card-hover slide-up-delay-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold font-poppins">{job.title}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                      <Building size={14} />
                      {job.company}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black gradient-text-blue">{job.matchScore}%</div>
                    <div className="text-xs text-gray-500">match</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {job.salary?.toLocaleString()}/yr
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="glass text-xs px-3 py-1 rounded-full text-indigo-300">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColor[job.type]}`}>
                    {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                  </span>
                  <button
  onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(job.location)}`, '_blank')}
  className="btn-premium text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1"
>
  Apply Now ↗
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs