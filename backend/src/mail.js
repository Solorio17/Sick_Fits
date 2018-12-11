const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const makeAnEmail = text => `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: Georgia;
        line-height: 2;
        font-size: 20px;
    ">
        <h3>Hello there!</h3>
        <p>${text}</p>

        <p>Sincerely, Developer</p>
    </div>
`;
exports.transport = transport;
exports.makeAnEmail = makeAnEmail;