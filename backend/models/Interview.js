const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Interview session title is required'],
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
    },
    company: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'hr', 'system_design', 'mixed'],
      default: 'mixed',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [
      {
        question: { type: String, required: true },
        category: { type: String },
        userAnswer: { type: String, default: '' },
        idealAnswer: { type: String, default: '' },
        score: { type: Number, min: 0, max: 10, default: 0 },
        feedback: { type: String, default: '' },
        timeSpent: { type: Number, default: 0 }, // in seconds
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    duration: {
      type: Number,
      default: 0, // in minutes
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    strengths: [String],
    areasToImprove: [String],
    scheduledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);