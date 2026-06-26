const express = require('express');
const router = express.Router();
const {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  calculateATSScore,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createResume);
router.get('/', protect, getMyResumes);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.delete('/:id', protect, deleteResume);
router.get('/:id/ats-score', protect, calculateATSScore);

module.exports = router;