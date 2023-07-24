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
    return await bcrypt.compareSync(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);