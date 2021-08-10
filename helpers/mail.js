const nodeMailer = require('nodemailer');
const optGenerator = require('otp-generator');

const transportOpts = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodeMailer.createTransport(transportOpts);

const sendMail = async (to, subject, htmlContent) => {
  return await transporter.sendMail({
    from: `"In Project" <${process.env.MAIL_ADDRESS}>`,
    to,
    subject,
    html: htmlContent,
  });
};

module.exports = {
  sendMail,
};
