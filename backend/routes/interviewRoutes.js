const express = require('express');
const router = express.Router();
const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  submitInterview,
  deleteInterview,
  getInterviewStats,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createInterview);
router.get('/', protect, getMyInterviews);
router.get('/stats', protect, getInterviewStats);
router.get('/:id', protect, getInterviewById);
router.put('/:id/submit', protect, submitInterview);
router.delete('/:id', protect, deleteInterview);

module.exports = router;