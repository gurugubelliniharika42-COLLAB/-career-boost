import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { FileText, Plus, Trash2, Star } from 'lucide-react'

const Resume = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [atsResult, setAtsResult] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
  })

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try {
      const { data } = await API.get('/resumes')
      setResumes(data.data)
    } catch (error) {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = {
        title: formData.title,
        summary: formData.summary,
        skills: formData.skills.split(',').map((s) => ({ name: s.trim(), level: 'intermediate' })),
        experience: formData.experience ? [{ company: formData.experience, position: 'Role', description: '' }] : [],
        education: formData.education ? [{ institution: formData.education, degree: 'Degree' }] : [],
      }
      await API.post('/resumes', payload)
      toast.success('Resume created!')
      setShowForm(false)
      setFormData({ title: '', summary: '', skills: '', experience: '', education: '' })
      fetchResumes()
    } catch (error) {
      toast.error('Failed to create resume')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return
    try {
      await API.delete(`/resumes/${id}`)
      toast.success('Resume deleted')
      fetchResumes()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleATSScore = async (id) => {
    try {
      const { data } = await API.get(`/resumes/${id}/ats-score`)
      setAtsResult(data.data)
      toast.success('ATS Score calculated!')
    } catch (error) {
      toast.error('Failed to calculate ATS score')
    }
  }

  return (
    <div className="min-h-screen gradient-bg text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #f093fb, transparent)'}} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 slide-up">
          <div>
            <h1 className="text-4xl font-black font-poppins">
              Resume <span className="gradient-text">Builder</span>
            </h1>
            <p className="text-gray-400 mt-2">Create and manage your professional resumes</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-premium text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> New Resume
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="glass rounded-3xl p-8 mb-8 slide-up">
            <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">Create New Resume</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resume Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer Resume"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary about yourself..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latest Company</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp, Google"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education</label>
                <input
                  type="text"
                  placeholder="e.g. XYZ University"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-premium text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Resume'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="glass text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ATS Result */}
        {atsResult && (
          <div className="glass rounded-3xl p-8 mb-8 slide-up">
            <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">ATS Score Result</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className={`text-6xl font-black ${atsResult.atsScore >= 70 ? 'text-green-400' : atsResult.atsScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {atsResult.atsScore}%
              </div>
              <div>
                <div className="text-xl font-bold">{atsResult.grade}</div>
                <div className="text-gray-400 text-sm">ATS Compatibility Score</div>
              </div>
            </div>
            {atsResult.feedback.length > 0 && (
              <ul className="space-y-2">
                {atsResult.feedback.map((fb, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">⚠</span> {fb}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setAtsResult(null)} className="mt-4 text-sm text-gray-500 hover:text-gray-300">
              Close
            </button>
          </div>
        )}

        {/* Resumes List */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500 text-lg">No resumes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume._id} className="glass rounded-3xl p-6 card-hover slide-up-delay-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-poppins">{resume.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{resume.summary || 'No summary added'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {resume.skills?.slice(0, 5).map((skill, i) => (
                        <span key={i} className="glass text-xs px-3 py-1 rounded-full text-indigo-300">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleATSScore(resume._id)}
                      className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-500/30 transition"
                    >
                      <Star size={14} /> ATS Score
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="bg-red-500/20 text-red-400 border border-red-500/30 p-2 rounded-xl hover:bg-red-500/30 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm text-gray-500">
                  <span>Template: {resume.template}</span>
                  <span>ATS: {resume.atsScore}%</span>
                  <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Resume