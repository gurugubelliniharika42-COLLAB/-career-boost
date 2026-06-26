const Interview = require('../models/Interview');

// @desc    Create a mock interview session
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res) => {
  try {
    const { title, jobRole, company, type, difficulty, scheduledAt } = req.body;

    if (!title || !jobRole) {
      return res.status(400).json({ message: 'Title and job role are required' });
    }

    // Auto-generate questions based on role and type
    const questions = generateQuestions(jobRole, type, difficulty);

    const interview = await Interview.create({
      user: req.user._id,
      title,
      jobRole,
      company: company || '',
      type: type || 'mixed',
      difficulty: difficulty || 'medium',
      questions,
      scheduledAt: scheduledAt || new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Interview session created successfully',
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all interview sessions of logged-in user
// @route   GET /api/interviews
// @access  Private
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: interviews.length, data: interviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single interview session
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) return res.status(404).json({ message: 'Interview session not found' });

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit answers to an interview session
// @route   PUT /api/interviews/:id/submit
// @access  Private
const submitInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) return res.status(404).json({ message: 'Interview session not found' });

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { answers, duration } = req.body;

    // Update answers and scores
    if (answers && Array.isArray(answers)) {
      answers.forEach((ans, index) => {
        if (interview.questions[index]) {
          interview.questions[index].userAnswer = ans.userAnswer || '';
          interview.questions[index].timeSpent = ans.timeSpent || 0;
          // Simple scoring: word count and keyword match
          interview.questions[index].score = scoreAnswer(
            ans.userAnswer,
            interview.questions[index].idealAnswer
          );
          interview.questions[index].feedback = generateFeedback(
            ans.userAnswer,
            interview.questions[index].idealAnswer
          );
        }
      });
    }

    // Calculate total score
    const totalScore = interview.questions.reduce((sum, q) => sum + q.score, 0);
    interview.totalScore = Math.round((totalScore / (interview.questions.length * 10)) * 100);
    interview.duration = duration || 0;
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.overallFeedback = generateOverallFeedback(interview.totalScore);

    await interview.save();

    res.json({
      success: true,
      message: 'Interview submitted successfully',
      data: {
        totalScore: interview.totalScore,
        duration: interview.duration,
        overallFeedback: interview.overallFeedback,
        questions: interview.questions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an interview session
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await interview.deleteOne();

    res.json({ success: true, message: 'Interview session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get interview stats for user dashboard
// @route   GET /api/interviews/stats
// @access  Private
const getInterviewStats = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id, status: 'completed' });

    const totalSessions = interviews.length;
    const avgScore = totalSessions
      ? Math.round(interviews.reduce((sum, i) => sum + i.totalScore, 0) / totalSessions)
      : 0;
    const bestScore = totalSessions ? Math.max(...interviews.map((i) => i.totalScore)) : 0;

    res.json({
      success: true,
      data: {
        totalSessions,
        avgScore,
        bestScore,
        recentSessions: interviews.slice(-5).reverse(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Helper Functions ──────────────────────────────────────────────────────────

const generateQuestions = (jobRole, type, difficulty) => {
  const questionBank = {
    behavioral: [
      { question: 'Tell me about yourself and your career journey.', category: 'behavioral', idealAnswer: 'Structured response covering education, experience, skills and goals.' },
      { question: 'Describe a challenging project you worked on and how you handled it.', category: 'behavioral', idealAnswer: 'Use STAR method: Situation, Task, Action, Result.' },
      { question: 'Where do you see yourself in 5 years?', category: 'behavioral', idealAnswer: 'Show ambition aligned with the company growth.' },
      { question: 'How do you handle tight deadlines and pressure?', category: 'behavioral', idealAnswer: 'Discuss prioritization, time management, communication.' },
    ],
    technical: [
      { question: `What are the core skills required for a ${jobRole} role?`, category: 'technical', idealAnswer: 'Mention relevant technologies, frameworks and methodologies.' },
      { question: 'Explain your experience with version control systems like Git.', category: 'technical', idealAnswer: 'Branching, merging, pull requests, conflict resolution.' },
      { question: 'How do you ensure code quality in your projects?', category: 'technical', idealAnswer: 'Testing, code reviews, linting, documentation.' },
      { question: 'Describe a technical problem you solved recently.', category: 'technical', idealAnswer: 'Walk through the problem, research, solution and outcome.' },
    ],
    hr: [
      { question: 'Why do you want to work with us?', category: 'hr', idealAnswer: 'Research-backed answer showing genuine interest in the company.' },
      { question: 'What is your expected salary range?', category: 'hr', idealAnswer: 'Give a range based on market research and your experience.' },
      { question: 'Are you comfortable with the work schedule and location?', category: 'hr', idealAnswer: 'Be honest and ask clarifying questions if needed.' },
      { question: 'Do you have any questions for us?', category: 'hr', idealAnswer: 'Ask about team culture, growth opportunities, tech stack.' },
    ],
  };

  let questions = [];

  if (type === 'behavioral') questions = questionBank.behavioral;
  else if (type === 'technical') questions = questionBank.technical;
  else if (type === 'hr') questions = questionBank.hr;
  else {
    // Mixed: pick from all
    questions = [
      ...questionBank.behavioral.slice(0, 2),
      ...questionBank.technical.slice(0, 2),
      ...questionBank.hr.slice(0, 1),
    ];
  }

  return questions;
};

const scoreAnswer = (userAnswer, idealAnswer) => {
  if (!userAnswer || userAnswer.trim().length < 10) return 0;
  const words = userAnswer.trim().split(/\s+/).length;
  if (words < 20) return 3;
  if (words < 50) return 5;
  if (words < 100) return 7;
  return 8;
};

const generateFeedback = (userAnswer, idealAnswer) => {
  if (!userAnswer || userAnswer.trim().length < 10) {
    return 'No answer provided. Try to structure your answer using the STAR method.';
  }
  const words = userAnswer.trim().split(/\s+/).length;
  if (words < 20) return 'Answer is too brief. Elaborate with specific examples and details.';
  if (words < 50) return 'Good start! Add more context, examples and measurable outcomes.';
  return 'Well-structured answer. Make sure to highlight your specific contributions and results.';
};

const generateOverallFeedback = (score) => {
  if (score >= 80) return 'Excellent performance! You demonstrated strong communication and depth of knowledge.';
  if (score >= 60) return 'Good job! A few areas could be strengthened with more specific examples.';
  if (score >= 40) return 'Average performance. Practice using the STAR method and expand on your answers.';
  return 'Needs improvement. Focus on preparation, structure your answers, and practice more sessions.';
};

module.exports = {
  createInterview,
  getMyInterviews,
  getInterviewById,
  submitInterview,
  deleteInterview,
  getInterviewStats,
};