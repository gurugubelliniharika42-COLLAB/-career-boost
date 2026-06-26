const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateSkills,
  getJobRecommendations,
  saveJob,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/skills', protect, updateSkills);
router.get('/job-recommendations', protect, getJobRecommendations);
router.post('/save-job/:jobId', protect, saveJob);

module.exports = router;