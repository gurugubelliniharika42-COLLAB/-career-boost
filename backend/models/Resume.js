const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      default: 'My Resume',
    },
    summary: {
      type: String,
      default: '',
    },
    skills: [
      {
        name: { type: String },
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
        achievements: [String],
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String },
        field: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
        gpa: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
        credentialUrl: { type: String },
      },
    ],
    projects: [
      {
        name: { type: String },
        description: { type: String },
        techStack: [String],
        url: { type: String },
        githubUrl: { type: String },
      },
    ],
    languages: [
      {
        language: { type: String },
        proficiency: { type: String, enum: ['basic', 'conversational', 'fluent', 'native'] },
      },
    ],
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'creative'],
      default: 'modern',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);