const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, bio, role, skills, experience, education, jobPreferences } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (role) user.role = role;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (jobPreferences) user.jobPreferences = jobPreferences;

    // Handle password change
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        education: updatedUser.education,
        jobPreferences: updatedUser.jobPreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add or update skills
// @route   PUT /api/users/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Skills updated', data: user.skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job recommendations based on user skills & preferences
// @route   GET /api/users/job-recommendations
// @access  Private
const getJobRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userSkills = user.skills.map((s) => s.name.toLowerCase());
    const preferredRoles = user.jobPreferences?.preferredRoles || [];
    const preferredLocations = user.jobPreferences?.preferredLocations || [];
    const workType = user.jobPreferences?.workType || 'any';

    // Static job recommendations (can be replaced with a real Jobs collection)
    const allJobs = [
      { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', type: 'remote', skills: ['react', 'javascript', 'css'], salary: 80000 },
      { id: 2, title: 'Backend Engineer', company: 'DataSoft', location: 'Hyderabad', type: 'onsite', skills: ['node.js', 'mongodb', 'express'], salary: 90000 },
      { id: 3, title: 'Full Stack Developer', company: 'StartupXYZ', location: 'Bangalore', type: 'hybrid', skills: ['react', 'node.js', 'mongodb'], salary: 95000 },
      { id: 4, title: 'UI/UX Designer', company: 'DesignHub', location: 'Remote', type: 'remote', skills: ['figma', 'ui design', 'prototyping'], salary: 70000 },
      { id: 5, title: 'Data Analyst', company: 'Analytics Co', location: 'Pune', type: 'onsite', skills: ['python', 'sql', 'data analysis'], salary: 75000 },
      { id: 6, title: 'DevOps Engineer', company: 'CloudWorks', location: 'Remote', type: 'remote', skills: ['docker', 'kubernetes', 'aws'], salary: 100000 },
      { id: 7, title: 'Python Developer', company: 'AI Labs', location: 'Hyderabad', type: 'hybrid', skills: ['python', 'django', 'machine learning'], salary: 85000 },
      { id: 8, title: 'Mobile Developer', company: 'AppFactory', location: 'Bangalore', type: 'onsite', skills: ['react native', 'javascript', 'android'], salary: 88000 },
    ];

    // Score and filter jobs based on user profile
    const scoredJobs = allJobs.map((job) => {
      let score = 0;

      // Skill match scoring
      const matchedSkills = job.skills.filter((s) => userSkills.includes(s.toLowerCase()));
      score += matchedSkills.length * 30;

      // Role preference match
      if (preferredRoles.some((r) => job.title.toLowerCase().includes(r.toLowerCase()))) {
        score += 25;
      }

      // Location preference match
      if (preferredLocations.some((l) => job.location.toLowerCase().includes(l.toLowerCase()))) {
        score += 20;
      }

      // Work type match
      if (workType === 'any' || job.type === workType) {
        score += 15;
      }

      return {
        ...job,
        matchScore: Math.min(score, 100),
        matchedSkills,
      };
    });

    // Sort by match score descending
    const recommendations = scoredJobs
      .filter((j) => j.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/users/save-job/:jobId
// @access  Private
const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { jobId } = req.params;

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.json({ success: true, message: 'Job saved successfully', data: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (admin use / leaderboard)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateSkills,
  getJobRecommendations,
  saveJob,
  getAllUsers,
};