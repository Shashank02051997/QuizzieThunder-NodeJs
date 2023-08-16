const express = require('express');
const router = express.Router();
const { submitQuizResult } = require('../controller/quiz_result_controller');
const { authMiddleware } = require('../middlewares/auth_middleware');

router.put('/submit-quiz-result', authMiddleware, submitQuizResult);
// router.get('/discover', authMiddleware, getDiscoverScreenDetails);
// router.get('/profile', authMiddleware, getProfileDetails);

module.exports = router;