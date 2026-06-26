const Resume = require('../models/Resume');

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const { title, summary, skills, experience, education, certifications, projects, languages, template } = req.body;

    const resume = await Resume.create({
      user: req.user._id,
      title: title || 'My Resume',
      summary,
      skills,
      experience,
      education,
      certifications,
      projects,
      languages,
      template: template || 'modern',
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all resumes of logged-in user
// @route   GET /api/resumes
// @access  Private
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate('user', 'name email');

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Only owner can view private resumes
    if (!resume.isPublic && resume.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this resume' });
    }

    const updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Resume updated successfully', data: updatedResume });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await resume.deleteOne();

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Calculate ATS score for a resume
// @route   GET /api/resumes/:id/ats-score
// @access  Private
const calculateATSScore = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let score = 0;
    const feedback = [];

    // Check summary
    if (resume.summary && resume.summary.length > 50) { score += 15; } else { feedback.push('Add a professional summary (at least 50 characters)'); }

    // Check skills
    if (resume.skills && resume.skills.length >= 5) { score += 20; } else { feedback.push('Add at least 5 skills to boost visibility'); }

    // Check experience
    if (resume.experience && resume.experience.length > 0) { score += 25; } else { feedback.push('Add work experience to your resume'); }

    // Check education
    if (resume.education && resume.education.length > 0) { score += 15; } else { feedback.push('Add your educational background'); }

    // Check certifications
    if (resume.certifications && resume.certifications.length > 0) { score += 10; } else { feedback.push('Add certifications to stand out'); }

    // Check projects
    if (resume.projects && resume.projects.length > 0) { score += 15; } else { feedback.push('Showcase your projects to demonstrate practical skills'); }

    // Update ATS score in DB
    resume.atsScore = score;
    await resume.save();

    res.json({
      success: true,
      data: {
        atsScore: score,
        feedback,
        grade: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  calculateATSScore,
};