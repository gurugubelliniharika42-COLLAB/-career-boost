import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Video, Plus, Trash2, CheckCircle, Star } from 'lucide-react'

const Interviews = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [activeInterview, setActiveInterview] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    jobRole: '',
    company: '',
    type: 'mixed',
    difficulty: 'medium',
  })

  useEffect(() => { fetchInterviews() }, [])

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews')
      setInterviews(data.data)
    } catch (error) {
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const { data } = await API.post('/interviews', formData)
      toast.success('Interview session created!')
      setShowForm(false)
      setFormData({ title: '', jobRole: '', company: '', type: 'mixed', difficulty: 'medium' })
      setActiveInterview(data.data)
      setAnswers(data.data.questions.map(() => ({ userAnswer: '', timeSpent: 0 })))
      setResult(null)
      fetchInterviews()
    } catch (error) {
      toast.error('Failed to create interview')
    } finally {
      setCreating(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const { data } = await API.put(`/interviews/${activeInterview._id}/submit`, { answers, duration: 30 })
      setResult(data.data)
      toast.success('Interview submitted!')
      fetchInterviews()
    } catch (error) {
      toast.error('Failed to submit')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return
    try {
      await API.delete(`/interviews/${id}`)
      toast.success('Deleted!')
      fetchInterviews()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const scoreColor = (score) => score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen gradient-bg text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 left-20 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #764ba2, transparent)'}} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 slide-up">
          <div>
            <h1 className="text-4xl font-black font-poppins">
              Mock <span className="gradient-text">Interviews</span>
            </h1>
            <p className="text-gray-400 mt-2">Practice interviews and get AI feedback</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setActiveInterview(null); setResult(null) }}
            className="btn-premium text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> New Session
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="glass rounded-3xl p-8 mb-8 slide-up">
            <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">Create Interview Session</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google SWE Interview Prep"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Developer"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Amazon"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  >
                    <option value="mixed" className="bg-gray-900">Mixed</option>
                    <option value="technical" className="bg-gray-900">Technical</option>
                    <option value="behavioral" className="bg-gray-900">Behavioral</option>
                    <option value="hr" className="bg-gray-900">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl"
                  >
                    <option value="easy" className="bg-gray-900">Easy</option>
                    <option value="medium" className="bg-gray-900">Medium</option>
                    <option value="hard" className="bg-gray-900">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={creating} className="btn-premium text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50">
                  {creating ? 'Creating...' : 'Start Interview'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="glass text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Interview */}
        {activeInterview && !result && (
          <div className="glass rounded-3xl p-8 mb-8 slide-up">
            <h2 className="text-xl font-bold font-poppins mb-2 gradient-text">{activeInterview.title}</h2>
            <p className="text-gray-400 text-sm mb-6">{activeInterview.jobRole} • {activeInterview.type} • {activeInterview.difficulty}</p>
            <div className="space-y-6">
              {activeInterview.questions.map((q, i) => (
                <div key={i} className="glass-dark rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="btn-premium text-white text-xs font-black w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="font-medium text-white">{q.question}</p>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Type your answer here..."
                    value={answers[i]?.userAnswer || ''}
                    onChange={(e) => {
                      const newAnswers = [...answers]
                      newAnswers[i] = { ...newAnswers[i], userAnswer: e.target.value }
                      setAnswers(newAnswers)
                    }}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 bg-green-500/20 text-green-400 border border-green-500/30 px-8 py-3 rounded-xl font-bold hover:bg-green-500/30 transition flex items-center gap-2"
            >
              <CheckCircle size={18} /> Submit Interview
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="glass rounded-3xl p-8 mb-8 slide-up">
            <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">Interview Results</h2>
            <div className="flex items-center gap-6 mb-6 glass-dark rounded-2xl p-6">
              <div className={`text-6xl font-black ${scoreColor(result.totalScore)}`}>{result.totalScore}%</div>
              <div>
                <p className="text-white font-medium">{result.overallFeedback}</p>
                <p className="text-gray-400 text-sm mt-1">Duration: {result.duration} mins</p>
              </div>
            </div>
            <div className="space-y-4">
              {result.questions.map((q, i) => (
                <div key={i} className="glass-dark rounded-2xl p-5">
                  <p className="font-medium mb-2">{q.question}</p>
                  <p className="text-sm text-gray-400 mb-2"><span className="text-gray-300 font-medium">Your answer:</span> {q.userAnswer || 'No answer'}</p>
                  <p className="text-sm text-indigo-400 mb-2"><span className="font-medium">Feedback:</span> {q.feedback}</p>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{q.score}/10</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setActiveInterview(null); setResult(null) }}
              className="mt-6 btn-premium text-white px-6 py-3 rounded-xl font-bold"
            >
              Start New Session
            </button>
          </div>
        )}

        {/* Past Interviews */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20">
            <Video size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500 text-lg">No interviews yet. Start your first mock session!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold font-poppins mb-4">Past Sessions</h2>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview._id} className="glass rounded-2xl p-6 card-hover slide-up-delay-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold font-poppins">{interview.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{interview.jobRole} • {interview.type} • {interview.difficulty}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`text-xl font-black ${scoreColor(interview.totalScore)}`}>{interview.totalScore}%</span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${interview.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                          {interview.status}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(interview._id)} className="bg-red-500/20 text-red-400 border border-red-500/30 p-2 rounded-xl hover:bg-red-500/30 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{new Date(interview.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Interviews