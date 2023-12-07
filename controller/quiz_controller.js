const Quiz = require('../models/quiz_model');
const Question = require('../models/question_model');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const createQuiz = asyncHandler(async (req, res) => {
    const { title, category } = req.body;

    try {
        // Check if a quiz with the same title already exists
        const existingQuiz = await Quiz.findOne({ title: title });
        if (existingQuiz) {
            return res.json({ code: 401, status: false, message: 'Quiz with this title already exists' });
        }

        // Check if the provided question_category_id is a valid ObjectId
        if (!validateMongoDbId(category)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz category id format' });
        }

        // Create a new quiz using the Quiz model
        const newQuiz = await Quiz.create(req.body);

        res.json({ code: 200, status: true, message: 'New Quiz has been added successfully', newQuiz: newQuiz }); // Return the created quiz as the response.
    } catch (err) {
        throw new Error(err);
    }
});


const getAllQuiz = asyncHandler(async (req, res) => {
    const { search, category } = req.query;
    try {
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive title search
        }

        if (category) {
            query.category = category; // Assuming category is the ID of the QuizCategory
        }
        const allQuizzes = await Quiz.find(query).populate('category');
        const quizCount = await Quiz.countDocuments(query);
        if (allQuizzes.length > 0) {
            const quizzesWithQuestionCount = await Promise.all(
                allQuizzes.map(async (quiz) => {
                    const questionCount = await Question.countDocuments({ quiz: quiz._id });
                    return { ...quiz.toObject(), questionCount };
                })
            );
            res.json({
                code: 200, status: true,
                count: quizCount,
                quizzes: quizzesWithQuestionCount,
            });
        } else {
            res.json({ code: 404, status: false, message: 'No quiz found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

const getSpecificQuiz = asyncHandler(async (req, res) => {
    const { quiz_id } = req.params;

    try {

        // Check if the provided quiz_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_id format' });
        }

        const quiz = await Quiz.findById(quiz_id).populate('category');
        if (quiz) {
            res.json({ code: 200, status: true, message: '', quiz: quiz });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const deleteSpecificQuiz = asyncHandler(async (req, res) => {
    const { quiz_id } = req.params;

    try {

        // Check if the provided quiz_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_id format' });
        }

        const deleteQuiz = await Quiz.findByIdAndDelete(quiz_id);
        if (deleteQuiz) {
            res.json({
                code: 200, status: true,
                message: 'Quiz deleted successfully'
            });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateQuiz = asyncHandler(async (req, res) => {
    const { quiz_id } = req.params;
    const { title } = req.body;

    try {

        // Check if the provided quiz_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz id format' });
        }

        // Find the quiz by ID
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.json({ code: 404, status: false, message: 'Quiz not found' });
        }

        // Check if the updated title already exists for another quiz
        if (title !== quiz.title) {
            const existingQuiz = await Quiz.findOne({ title: title });
            if (existingQuiz) {
                return res.json({ code: 409, status: false, message: 'Quiz with this title already exists' });
            }
        }

        // Update the quiz fields
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quiz_id,
            req.body,
            {
                new: true,
            }
        );

        res.json({ code: 200, status: true, message: 'Quiz details has been updated succefully', updatedQuiz: updatedQuiz });
    } catch (err) {
        throw new Error(err);
    }
});

const getAllQuizFromQuizCatId = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;
    try {
        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz category id format' });
        }
        // Find the quiz by Quiz Category ID
        const allQuizzes = await Quiz.find({ category: quiz_category_id }).populate('category');
        const quizCount = await Quiz.countDocuments({ category: quiz_category_id });
        if (allQuizzes.length > 0) {
            const quizzesWithQuestionCount = await Promise.all(
                allQuizzes.map(async (quiz) => {
                    const questionCount = await Question.countDocuments({ quiz: quiz._id });
                    return { ...quiz.toObject(), questionCount };
                })
            );
            res.json({
                code: 200, status: true,
                count: quizCount,
                quizzes: quizzesWithQuestionCount,
            });
        } else {
            res.json({ code: 404, status: false, message: 'No quiz found' });
        }

    } catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    createQuiz, getAllQuiz, getSpecificQuiz, deleteSpecificQuiz,
    updateQuiz, getAllQuizFromQuizCatId
};