const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodeMailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
})

transporter.verify().then(() => {
    console.log('Server is ready to send email');
});

const sendEmail = async (email, subject, html) => {
    if(!email || !subject || !html) {
        return false;
    }
    try{
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch(e) {
        return false;
    }
}

module.exports = {
    sendEmail
}