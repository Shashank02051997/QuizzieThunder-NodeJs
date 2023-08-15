const Quiz = require('../models/quiz_model');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const createQuiz = asyncHandler(async (req, res) => {
    const { title, category } = req.body;

    try {
        // Check if a quiz with the same title already exists
        const existingQuiz = await Quiz.findOne({ title: title });
        if (existingQuiz) {
            return res.status(401).json({ message: 'Quiz with this title already exists' });
        }

        // Check if the provided question_category_id is a valid ObjectId
        if (!validateMongoDbId(category)) {
            return res.status(400).json({ message: 'Invalid quiz category id format' });
        }

        // Create a new quiz using the Quiz model
        const newQuiz = await Quiz.create(req.body);

        res.status(201).json(newQuiz); // Return the created quiz as the response.
    } catch (err) {
        throw new Error(err);
    }
});


const getAllQuiz = asyncHandler(async (req, res) => {
    try {
        const allQuizzes = await Quiz.find().populate('category');
        const quizCount = await Quiz.countDocuments();
        if (allQuizzes.length > 0) {
            res.json({
                count: quizCount,
                quizzes: allQuizzes,
            });
        } else {
            res.status(404).json({ message: 'No quizzes found' });
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
            return res.status(400).json({ message: 'Invalid quiz_id format' });
        }

        const quiz = await Quiz.findById(quiz_id);
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ message: 'Quiz not found' });
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
            return res.status(400).json({ message: 'Invalid quiz_id format' });
        }

        const deleteQuiz = await Quiz.findByIdAndDelete(quiz_id);
        if (deleteQuiz) {
            res.json({
                message: 'Quiz deleted successfully'
            });
        } else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateQuiz = asyncHandler(async (req, res) => {
    const { quiz_id } = req.params;
    const { title, description } = req.body;

    try {

        // Check if the provided quiz_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.status(400).json({ message: 'Invalid quiz_id format' });
        }

        // Find the quiz by ID
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if the updated title already exists for another quiz
        if (title !== quiz.title) {
            const existingQuiz = await Quiz.findOne({ title: title });
            if (existingQuiz) {
                return res.status(409).json({ message: 'Quiz with this title already exists' });
            }
        }

        // Update the quiz fields
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quiz_id,
            {
                title: title,
                description: description,
            },
            {
                new: true,
            }
        );

        res.json(updatedQuiz);
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    createQuiz, getAllQuiz, getSpecificQuiz, deleteSpecificQuiz,
    updateQuiz
};