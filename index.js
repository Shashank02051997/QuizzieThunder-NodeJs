const express = require('express');
const dbConnect = require('./config/db_connect');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/auth_routes');
const quizRouter = require('./routes/quiz_routes');
const questionRouter = require('./routes/question_routes');
const { notFound, errorHandler } = require('./middlewares/error_handler');
const morgan = require('morgan');
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', authRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/question', questionRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is running at PORT ' + PORT);
});
