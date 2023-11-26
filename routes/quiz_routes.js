const express = require('express');
const router = express.Router();
const { createQuiz, getAllQuiz, getSpecificQuiz,
    deleteSpecificQuiz, updateQuiz, getAllQuizFromQuizCatId } = require('../controller/quiz_controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth_middleware');

router.post('/create', authMiddleware, isAdmin, createQuiz);
router.get('/all-quiz', authMiddleware, getAllQuiz);
router.get('/:quiz_id', authMiddleware, getSpecificQuiz);
router.delete('/:quiz_id', authMiddleware, isAdmin, deleteSpecificQuiz);
router.put('/update/:quiz_id', authMiddleware, isAdmin, updateQuiz);
router.get('/:quiz_category_id/quizzes', authMiddleware, getAllQuizFromQuizCatId);

module.exports = router;