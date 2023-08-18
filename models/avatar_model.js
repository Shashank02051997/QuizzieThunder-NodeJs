const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const avatarSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    }
}, { timestamps: true, versionKey: false });

//Export the model
module.exports = mongoose.model('Avatar', avatarSchema);
