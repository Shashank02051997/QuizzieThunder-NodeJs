const express = require('express');
const dbConnect = require('./config/db_connect');
const bodyParser = require('body-parser');
const app = express();
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4444;
const authRouter = require('./routes/auth_routes');
const quizCategoryRouter = require('./routes/quiz_category_routes');
const quizRouter = require('./routes/quiz_routes');
const questionRouter = require('./routes/question_routes');
const dashboardRouter = require('./routes/dashboard_router');
const quizResultRouter = require('./routes/quiz_result_routes');
const avatarRouter = require('./routes/avatar_routes');
const { notFound, errorHandler } = require('./middlewares/error_handler');
const morgan = require('morgan');
const cors = require("cors");

dbConnect();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/user', authRouter);
app.use('/api/quiz/category', quizCategoryRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/question', questionRouter);
app.use('/api', dashboardRouter);
app.use('/api', quizResultRouter);
app.use('/api/avatar', avatarRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is running at PORT http://localhost:' + PORT);
});

