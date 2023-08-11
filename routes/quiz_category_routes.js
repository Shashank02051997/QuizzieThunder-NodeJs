const express = require('express');
const router = express.Router();
const { createQuizCategory, getAllQuizCategories, getSpecificQuizCategory,
    deleteSpecificQuizCategory, updateQuizCategory, getAllQuizzesFromQuizCategoryId } = require('../controller/quiz_category_controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth_middleware');

router.post('/create', authMiddleware, isAdmin, createQuizCategory);
router.get('/all', authMiddleware, getAllQuizCategories);
router.get('/:quiz_category_id', authMiddleware, getSpecificQuizCategory);
router.delete('/:quiz_category_id', authMiddleware, isAdmin, deleteSpecificQuizCategory);
router.put('/update/:quiz_category_id', authMiddleware, isAdmin, updateQuizCategory);
router.get('/:quiz_category_id/quizzes', authMiddleware, getAllQuizzesFromQuizCategoryId);

module.exports = router;