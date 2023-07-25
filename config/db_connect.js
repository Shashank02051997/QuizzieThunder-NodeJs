const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    try {
        // eslint-disable-next-line no-unused-vars
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('Database connected successfully')
    }
    catch (err) {
        console.log('Database Error' + err)
    }
}

module.exports = dbConnect