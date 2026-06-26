import { Link } from 'react-router-dom'
import { Briefcase, FileText, Video, Star, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-hidden">

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb1 absolute top-20 left-20 w-96 h-96 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #667eea, transparent)'}} />
        <div className="orb2 absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #764ba2, transparent)'}} />
        <div className="orb1 absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #f093fb, transparent)'}} />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="slide-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-indigo-300 mb-8">
            <Zap size={14} className="text-yellow-400" />
            AI-Powered Career Development Platform
          </div>

          <h1 className="slide-up-delay-1 text-6xl md:text-8xl font-black mb-6 leading-tight font-poppins">
            Boost Your
            <span className="gradient-text block">Career Today</span>
          </h1>

          <p className="slide-up-delay-2 text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get matched with dream jobs, build stunning resumes, and ace interviews with AI-powered mock sessions.
          </p>

          <div className="slide-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn-premium text-white px-10 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="glass text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="slide-up-delay-4 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: '10K+', label: 'Jobs Matched' },
              { value: '5K+', label: 'Users Hired' },
              { value: '95%', label: 'Success Rate' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6 card-hover">
                <div className="text-3xl font-black gradient-text-blue">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black font-poppins mb-4">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="text-gray-400 text-lg">Powerful tools for every stage of your career</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Briefcase size={32} />, title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills, experience and preferences.', color: 'from-indigo-500 to-purple-600' },
              { icon: <FileText size={32} />, title: 'Resume Builder', desc: 'Build ATS-optimized resumes with professional templates that get you noticed.', color: 'from-purple-500 to-pink-600' },
              { icon: <Video size={32} />, title: 'Mock Interviews', desc: 'Practice with real questions and get instant AI feedback to improve fast.', color: 'from-pink-500 to-rose-600' },
            ].map((feature) => (
              <div key={feature.title} className="glass rounded-3xl p-8 card-hover group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-poppins">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black font-poppins mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-gray-400 text-lg">Get hired in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and add your skills, experience and job preferences.' },
              { step: '02', title: 'Get Matched', desc: 'Our AI matches you with the best jobs based on your profile.' },
              { step: '03', title: 'Land Your Dream Job', desc: 'Apply, practice interviews and get hired faster than ever.' },
            ].map((item) => (
              <div key={item.step} className="text-center glass rounded-3xl p-8 card-hover">
                <div className="text-7xl font-black gradient-text opacity-30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3 font-poppins">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black font-poppins mb-4">What Users <span className="gradient-text">Say</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Software Engineer at Google', text: 'CareerBoost helped me land my dream job in just 3 weeks. The mock interviews were incredibly helpful!' },
              { name: 'Rahul Verma', role: 'Data Analyst at Amazon', text: 'The job matching is spot on. I got matched with roles that perfectly fit my skills!' },
              { name: 'Anjali Singh', role: 'UI/UX Designer at Flipkart', text: 'My ATS score went from 40% to 92% and I started getting callbacks immediately.' },
            ].map((t) => (
              <div key={t.name} className="glass rounded-3xl p-8 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm gradient-text-blue">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-16 pulse-glow">
            <h2 className="text-5xl font-black font-poppins mb-6">
              Ready to <span className="gradient-text">Boost</span> Your Career?
            </h2>
            <p className="text-gray-400 text-lg mb-10">Join thousands of professionals who transformed their careers.</p>
            <Link to="/register" className="btn-premium text-white px-12 py-5 rounded-2xl text-xl font-bold inline-flex items-center gap-2">
              Start for Free <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 text-center">
        <div className="text-2xl font-black font-poppins gradient-text mb-2">CareerBoost</div>
        <p className="text-gray-500 text-sm">© 2026 CareerBoost. Built for Final Year Major Project.</p>
      </footer>
    </div>
  )
}

export default LandingPage