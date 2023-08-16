const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    quizPlayed: {
        type: Number,
        default: 0
    }

}, { timestamps: true, versionKey: false });

//Export the model
module.exports = mongoose.model('QuizResult', quizResultSchema);
