# Quizze Thunder

![QuizzeThunder]( 'Quizze Thunder Logo')

## Description

Quizzie Thunder delivers an immersive trivia quiz experience, seamlessly blending knowledge and aesthetics, with its exceptionally beautiful user interface. 🌟 Behind the scenes, the app is powered by a robust backend developed using Node.js and MongoDB, ensuring a seamless and responsive quiz environment. 🚀 Track your progress effortlessly, compete with friends through dynamic user rankings, and elevate the thrill of answering questions with a competitive edge—all made possible by the cutting-edge technologies of Node.js and MongoDB on the backend, and React.js on the frontend. 🏆 Unleash the power of technology in your quest for trivia mastery with Quizzie Thunder!

⭐ Note: The website may require some time for the server to spin up.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Credits](#credits)
- [Links](#links)
- [License](#license)

## Installation

To install Quizzie Thunder on, follow these steps:

1. Clone the repository.
2. Install the dependencies in both the client and server directories by running `npm i` at the root directory.
3. Create a .env file in the server directory and add the following environment variables:

```
PORT
MONGODB_URL
JWT_SECRET
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
```

The MONGODB_URL is the connection string to your MongoDB database. The JWT_SECRET can be any string of your choice. Additionally, include the TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN for Twilio integration.

4. Run `npm run dev` at the root directory to start the development server and launch the app in your browser.
5. Navigate to http://localhost:4444/ to view the project.

## Features

Quizze Thunder provides a range of features:

🔐 User Authentication:

- Sign In and Sign Up: Users can easily create accounts or log in to access the quiz platform.

📱 OTP Verification:

- Secure Verification: Ensure user authenticity through OTP verification, adding an extra layer of security.

🏆 Ranking System:

- Dynamic User Rankings: Compete with others and track your progress through a dynamic ranking system.

🌐 Categories and Variety:

- Diverse Quiz Categories: Explore a range of quiz categories, each offering a variety of questions to keep the experience engaging.

🤔 Question Variety:

- Rich Question Database: Enjoy a diverse set of questions within each category, making every quiz unique.


## Screenshots


## Technologies Used

Quizze Thunder is built using a variety of technologies including:

- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [GraphQL](https://graphql.org/)
- [JWT](https://jwt.io/)


## Links

- [Link to React GitHub repository](https://github.com/Shashank02051997/QuizzieThunder-ReactJs)

## License

This project is licensed under the MIT License.