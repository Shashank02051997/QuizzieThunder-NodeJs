const express = require('express');
const router = express.Router();
const { submitQuizResult, getAllQuizResults, getSpecificQuizResult } = require('../controller/quiz_result_controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth_middleware');

router.put('/submit-quiz-result', authMiddleware, submitQuizResult);
router.get('/all', authMiddleware, isAdmin, getAllQuizResults);
router.get('/:quiz_result_id', authMiddleware, isAdmin, getSpecificQuizResult);


module.exports = router;