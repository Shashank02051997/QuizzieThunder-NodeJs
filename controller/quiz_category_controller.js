const QuizCategory = require('../models/quiz_category_model');
const Quiz = require('../models/quiz_model');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const createQuizCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;

    try {
        // Check if a quiz category with the same title already exists
        const existingQuizCategory = await QuizCategory.findOne({ title: title });
        if (existingQuizCategory) {
            return res.json({ code: 401, status: false, message: 'Quiz Category with this title already exists' });
        }

        // Create a new quiz category using the Quiz category model
        const newQuizCategory = await QuizCategory.create({
            title,
        });

        res.json({ code: 201, status: true, message: 'New Quiz category has been creatd', newQuizCategory: newQuizCategory }); // Return the created quiz category as the response.
    } catch (err) {
        throw new Error(err);
    }
});


const getAllQuizCategories = asyncHandler(async (req, res) => {
    try {
        const allQuizCategories = await QuizCategory.find();
        const quizCategoryCount = await QuizCategory.countDocuments();
        if (allQuizCategories.length > 0) {
            res.json({
                code: 200, status: true, message: '',
                count: quizCategoryCount,
                quiz_categories: allQuizCategories,
            });
        } else {
            res.json({ code: 404, status: false, message: 'No quiz category found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

const getSpecificQuizCategory = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_category_id format' });
        }

        const quizCategory = await QuizCategory.findById(quiz_category_id);
        if (quizCategory) {
            res.json({ code: 200, status: true, message: '', quizCategory: quizCategory });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const deleteSpecificQuizCategory = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_category_id format' });
        }

        const deleteQuizCategory = await QuizCategory.findByIdAndDelete(quiz_category_id);
        if (deleteQuizCategory) {
            res.json({
                code: 200, status: true,
                message: 'Quiz Category deleted successfully'
            });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateQuizCategory = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;
    const { title } = req.body;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_category_id format' });
        }

        // Find the quiz category by ID
        const quizCategory = await QuizCategory.findById(quiz_category_id);
        if (!quizCategory) {
            return res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }

        // Check if the updated title already exists for another quiz
        if (title !== quizCategory.title) {
            const existingQuizCategory = await QuizCategory.findOne({ title: title });
            if (existingQuizCategory) {
                return res.json({ code: 409, status: true, message: 'Quiz Category with this title already exists' });
            }
        }

        // Update the quiz category fields
        const updatedQuizCategory = await QuizCategory.findByIdAndUpdate(
            quiz_category_id,
            {
                title: title,

            },
            {
                new: true,
            }
        );

        res.json({ code: 200, status: true, message: 'Quiz category details has been updated succefully', updatedQuizCategory: updatedQuizCategory });
    } catch (err) {
        throw new Error(err);
    }
});

const getAllQuizzesFromQuizCategoryId = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.status(400).json({ message: 'Invalid quiz category id format' });
        }

        // Find the quiz category by ID
        const quizCategory = await QuizCategory.findById(quiz_category_id);

        if (!quizCategory) {
            return res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }

        // Find all quizzes for the given quiz category ID and populate the 'category' field in each quiz
        const quizzes = await Quiz.find({ category: quiz_category_id }).select('-category');

        res.json({
            code: 200, status: true, message: '',
            quizCategory: quizCategory,
            quizzes: quizzes,
        });
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    createQuizCategory, getAllQuizCategories, getSpecificQuizCategory, deleteSpecificQuizCategory,
    updateQuizCategory, getAllQuizzesFromQuizCategoryId
};