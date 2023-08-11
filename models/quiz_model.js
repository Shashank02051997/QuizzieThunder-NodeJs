const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizCategory',
        required: true,
    },

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Quiz', quizSchema);
