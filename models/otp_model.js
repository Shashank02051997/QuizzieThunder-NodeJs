const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, default: Date.now(), index: { expires: 3000 } // After 5 minutes it deleted automatically from the db
    }
});

//Export the model
module.exports = mongoose.model('Otp', otpSchema);
