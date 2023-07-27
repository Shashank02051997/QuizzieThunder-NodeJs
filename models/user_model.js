const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isMobileNumberVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    /*console.log('enteredPassword = ', enteredPassword + ' password = ' + this.password);
    const isMatch = bcrypt.compareSync('shashank', '$2b$10$iGvq0i56G7hQAYLKN.nsFe78AVb9TPJ2d86gk5GdZNZlAxPGmy.qu');
    console.log('isMatch = ', isMatch);*/
    return await bcrypt.compareSync(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);