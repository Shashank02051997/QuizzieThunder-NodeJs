const sgMail = require('@sendgrid/mail');

const sendWelcomeMail = (toEmail, username) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: toEmail,
        from: 'ssinghal@mirusmed.com',
        subject: 'Welcome to Quizzie Thunder Application',
        html: `
            <p style="font-size: 16px;">🌟 <b>Welcome to Quizzie Thunder!</b> 🌟</p>

            <p style="font-size: 14px;">Dear ${username},</p>

            <p style="font-size: 14px;">Embark on an exhilarating journey into the world of knowledge and aesthetics with Quizzie Thunder, where learning meets stunning design! We're thrilled to have you on board as our newest quiz enthusiast.</p>

            <p style="font-size: 14px;">🚀 Get ready to elevate your trivia experience with our exceptionally beautiful user interface that adds a touch of magic to every question you answer. As you dive into the captivating quiz challenges, immerse yourself in the thrill of testing your knowledge and discovering new facts.</p>

            <p style="font-size: 14px;">🏆 But that's not all - Quizzie Thunder is not just about solo adventures! Challenge your friends, track your progress, and climb the dynamic user rankings to prove you're the ultimate trivia master. The competition is fierce, and the quest for glory awaits!</p>

            <p style="font-size: 14px;">Thank you for choosing Quizzie Thunder as your trivia companion. Let the games begin, and may your journey be filled with excitement, learning, and triumphs!</p>

            <p style="font-size: 14px;">Happy quizzing!</p>

            <p style="font-size: 14px;">Best regards,<br>The Quizzie Thunder Team</p>
        `,
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Welcome user email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = {
    sendWelcomeMail,
};
