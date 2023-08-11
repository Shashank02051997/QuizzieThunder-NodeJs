const express = require('express');
const router = express.Router();
const { createQuestion, getSpecificQuestion,
    deleteSpecificQuestion, updateQuestion, getAllQuestionsFromQuizId } = require('../controller/question_controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth_middleware');

router.post('/create', authMiddleware, isAdmin, createQuestion);
router.get('/:question_id', authMiddleware, getSpecificQuestion);
router.delete('/:question_id', authMiddleware, isAdmin, deleteSpecificQuestion);
router.put('/update/:question_id', authMiddleware, isAdmin, updateQuestion);
router.get('/:quiz_id/questions', authMiddleware, getAllQuestionsFromQuizId);

module.exports = router;