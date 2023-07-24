const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctOptionIndex: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Question', questionSchema);
