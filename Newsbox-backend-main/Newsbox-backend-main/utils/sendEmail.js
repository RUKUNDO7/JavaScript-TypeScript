const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

async function sendEmail(to,subject,text) {
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL,
      pass:process.env.EMAILPASS
    }
  })

  const mailOptions = {
    from:process.env.EMAIL,
    to,
    subject,
    text
  }

  // Add timeout protection (30 seconds)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Email send timeout')), 30000);
  });

  const sendPromise = transporter.sendMail(mailOptions);
  
  await Promise.race([sendPromise, timeoutPromise]);
}

module.exports = sendEmail;

