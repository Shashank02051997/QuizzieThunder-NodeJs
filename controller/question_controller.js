const Question = require('../models/question_model');
const Quiz = require('../models/quiz_model');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");
const asyncHandler = require('express-async-handler');
const lodash = require('lodash');

const createQuestion = asyncHandler(async (req, res) => {

    const quiz_id = req.body.quiz;

    try {
        // Check if the provided question_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.status(400).json({ message: 'Invalid quiz id format' });
        }

        // Create a new question using the Question model
        const newQuestion = await Question.create(req.body);

        res.json({ code: 200, status: true, message: '', newQuestion: newQuestion }); // Return the created question as the response.
    } catch (err) {
        throw new Error(err);
    }
});


const getAllQuestionsFromQuizId = asyncHandler(async (req, res) => {
    const { quiz_id } = req.params;

    try {

        // Check if the provided quiz_id is a valid ObjectId
        if (!validateMongoDbId(quiz_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz id format' });
        }

        // Find the quiz by ID
        const quiz = await Quiz.findById(quiz_id).populate('category');

        if (!quiz) {
            return res.json({ code: 404, status: false, message: 'Quiz not found' });
        }

        // Find all questions for the given quiz ID and populate the 'quiz' field in each question
        const questions = await Question.find({ quiz: quiz_id }).select('-quiz');
        const randomQuestions = lodash.sampleSize(questions, 10); // Get 10 random questions

        res.json({
            code: 200, status: true, message: '',
            quiz: quiz,
            questions: randomQuestions,
        });
    } catch (err) {
        throw new Error(err);
    }
});


const getSpecificQuestion = asyncHandler(async (req, res) => {
    const { question_id } = req.params;
    try {

        // Check if the provided question_id is a valid ObjectId
        if (!validateMongoDbId(question_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid question_id format' });
        }

        const question = await Question.findById(question_id);
        if (question) {
            res.json({ code: 200, status: true, message: '', question: question });
        } else {
            res.json({ code: 404, status: false, message: 'Question not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const deleteSpecificQuestion = asyncHandler(async (req, res) => {
    const { question_id } = req.params;
    try {

        // Check if the provided question_id is a valid ObjectId
        if (!validateMongoDbId(question_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid question_id format' });
        }

        const deleteQuestion = await Question.findByIdAndDelete(question_id);
        if (deleteQuestion) {
            res.json({
                code: 200, status: true,
                message: 'Question deleted successfully'
            });
        } else {
            res.json({ code: 404, status: false, message: 'Question not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateQuestion = asyncHandler(async (req, res) => {
    const { question_id } = req.params;
    const { question, options, correctOptionIndex } = req.body;

    try {
        // Check if the provided question_id is a valid ObjectId
        if (!validateMongoDbId(question_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid question_id format' });
        }

        // Find the question by ID
        const existingQuestion = await Question.findById(question_id);
        if (!existingQuestion) {
            return res.json({ code: 404, status: false, message: 'Question not found' });
        }

        // Update the question fields
        const updatedQuestion = await Question.findByIdAndUpdate(
            question_id,
            {
                question: question,
                options: options,
                correctOptionIndex: correctOptionIndex
            },
            {
                new: true,
            }
        );

        res.json({ code: 200, status: true, updatedQuestion: updatedQuestion });
    } catch (err) {
        throw new Error(err);
    }
});


module.exports = {
    createQuestion, getSpecificQuestion, deleteSpecificQuestion,
    updateQuestion, getAllQuestionsFromQuizId
};