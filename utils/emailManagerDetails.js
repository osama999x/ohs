// sendManagerEmail.js
const nodemailer = require("nodemailer");


const sendEmail = async (email,password) => {

  const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAILPASS,
    },
  });

  const mailOptions = {
    from: `OHS-Dashboard ${process.env.MAIL}`,
    to: email,
    subject: "Manager Credidentials",
    text: `Your Credidentials Are Email: ${email} Password: ${password}` ,
  };

const result = await transporter.sendMail(mailOptions);
  if (result) {
    return true;
  }else{
      return false;
  }

};

module.exports = sendEmail;
