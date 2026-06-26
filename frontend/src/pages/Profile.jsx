import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Briefcase, Plus, Trash2, Save, Zap } from 'lucide-react'

const Profile = () => {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: '',
    skills: [],
    jobPreferences: {
      preferredRoles: [],
      preferredLocations: [],
      workType: 'any',
      expectedSalary: '',
    },
  })
  const [newSkill, setNewSkill] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        role: user.role || 'job_seeker',
        skills: user.skills || [],
        jobPreferences: {
          preferredRoles: user.jobPreferences?.preferredRoles || [],
          preferredLocations: user.jobPreferences?.preferredLocations || [],
          workType: user.jobPreferences?.workType || 'any',
          expectedSalary: user.jobPreferences?.expectedSalary || '',
        },
      })
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.put('/users/profile', formData)
      login({ ...user, ...data.data }, localStorage.getItem('token'))
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setFormData({ ...formData, skills: [...formData.skills, { name: newSkill.trim(), level: 'intermediate' }] })
    setNewSkill('')
  }

  const removeSkill = (i) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, idx) => idx !== i) })
  }

  const addRole = () => {
    if (!newRole.trim()) return
    setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, preferredRoles: [...formData.jobPreferences.preferredRoles, newRole.trim()] } })
    setNewRole('')
  }

  const addLocation = () => {
    if (!newLocation.trim()) return
    setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, preferredLocations: [...formData.jobPreferences.preferredLocations, newLocation.trim()] } })
    setNewLocation('')
  }

  return (
    <div className="min-h-screen gradient-bg text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb1 absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #f093fb, transparent)'}} />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 relative z-10">

        {/* Header */}
        <div className="mb-8 slide-up">
          <h1 className="text-4xl font-black font-poppins">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-gray-400 mt-2">Update your profile to get better job matches</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Basic Info */}
          <div className="glass rounded-3xl p-8 slide-up-delay-1">
            <h2 className="text-lg font-bold font-poppins mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg btn-premium flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-dark w-full px-4 py-3 rounded-xl opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">I am a</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                >
                  <option value="job_seeker" className="bg-gray-900">Job Seeker</option>
                  <option value="student" className="bg-gray-900">Student</option>
                  <option value="professional" className="bg-gray-900">Working Professional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass rounded-3xl p-8 slide-up-delay-2">
            <h2 className="text-lg font-bold font-poppins mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg btn-premium flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              Skills
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g. React, Python)"
                className="input-dark flex-1 px-4 py-3 rounded-xl"
              />
              <button type="button" onClick={addSkill} className="btn-premium text-white px-4 py-3 rounded-xl">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1 glass text-indigo-300 px-3 py-1.5 rounded-full text-sm">
                  {skill.name}
                  <button type="button" onClick={() => removeSkill(i)}>
                    <Trash2 size={12} className="hover:text-red-400 transition" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Preferences */}
          <div className="glass rounded-3xl p-8 slide-up-delay-3">
            <h2 className="text-lg font-bold font-poppins mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg btn-premium flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
              </div>
              Job Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Work Type</label>
                <select
                  value={formData.jobPreferences.workType}
                  onChange={(e) => setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, workType: e.target.value } })}
                  className="input-dark w-full px-4 py-3 rounded-xl"
                >
                  <option value="any" className="bg-gray-900">Any</option>
                  <option value="remote" className="bg-gray-900">Remote</option>
                  <option value="onsite" className="bg-gray-900">Onsite</option>
                  <option value="hybrid" className="bg-gray-900">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expected Salary</label>
                <input
                  type="number"
                  value={formData.jobPreferences.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, expectedSalary: e.target.value } })}
                  placeholder="e.g. 80000"
                  className="input-dark w-full px-4 py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Roles</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                    placeholder="e.g. Frontend Developer"
                    className="input-dark flex-1 px-4 py-3 rounded-xl"
                  />
                  <button type="button" onClick={addRole} className="btn-premium text-white px-4 py-3 rounded-xl">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.jobPreferences.preferredRoles.map((role, i) => (
                    <span key={i} className="flex items-center gap-1 glass text-purple-300 px-3 py-1.5 rounded-full text-sm">
                      {role}
                      <button type="button" onClick={() => setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, preferredRoles: formData.jobPreferences.preferredRoles.filter((_, idx) => idx !== i) } })}>
                        <Trash2 size={12} className="hover:text-red-400 transition" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Locations</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                    placeholder="e.g. Hyderabad, Remote"
                    className="input-dark flex-1 px-4 py-3 rounded-xl"
                  />
                  <button type="button" onClick={addLocation} className="btn-premium text-white px-4 py-3 rounded-xl">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.jobPreferences.preferredLocations.map((loc, i) => (
                    <span key={i} className="flex items-center gap-1 glass text-green-300 px-3 py-1.5 rounded-full text-sm">
                      {loc}
                      <button type="button" onClick={() => setFormData({ ...formData, jobPreferences: { ...formData.jobPreferences, preferredLocations: formData.jobPreferences.preferredLocations.filter((_, idx) => idx !== i) } })}>
                        <Trash2 size={12} className="hover:text-red-400 transition" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile