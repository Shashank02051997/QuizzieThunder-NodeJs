//const User = require('../models/user_model');
const Quiz = require('../models/quiz_model');
const QuizCategory = require('../models/quiz_category_model');
const asyncHandler = require('express-async-handler');
const lodash = require('lodash');
//const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const getHomeScreenDetails = asyncHandler(async (req, res) => {
    try {
        const allQuizzes = await Quiz.find().populate('category');
        const randomQuizzes = lodash.sampleSize(allQuizzes, 5); // Get 5 random quizzes
        const randomMostPlayedQuiz = lodash.sample(allQuizzes); // Get a random most played quiz

        res.json({
            quizzes: randomQuizzes,
            most_played_quiz: randomMostPlayedQuiz
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

const getDiscoverScreenDetails = asyncHandler(async (req, res) => {
    try {
        const allQuizzes = await Quiz.find().populate('category');
        const allQuizCategories = await QuizCategory.find();
        const randomTopPickQuiz = lodash.sample(allQuizzes); // Get a random top pick quiz

        const quizCategoriesWithCounts = await Promise.all(
            allQuizCategories.map(async (category) => {
                const quizCount = await Quiz.countDocuments({ category: category._id });
                return {
                    _id: category._id,
                    title: category.title,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    quizCount: quizCount,
                };
            })
        );

        res.json({
            top_pic_quiz: randomTopPickQuiz,
            quiz_categories: quizCategoriesWithCounts
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

/*const getProfileDetails = asyncHandler(async (req, res) => {
        try {
        }
        catch (err) {
            throw new Error(err);
        }
    }
);*/

module.exports = {
    getHomeScreenDetails, getDiscoverScreenDetails, // getProfileDetails

};