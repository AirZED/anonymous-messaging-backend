const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Mfoniso Ukpabio <ukpabiomfoniso@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
