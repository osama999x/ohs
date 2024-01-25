// sendEmail.js
const nodemailer = require("nodemailer");
const saveOtp = require("../utils/saveOtp");

const sendEmail = async (email) => {
  const Otp = saveOtp.generateOTP();

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
    subject: "OHS-Dashboard OTP",
    text: "Your OTP is " + Otp,
  };

  const user = await saveOtp.saveOTP(email, Otp);

  if (user) {
    const result = await transporter.sendMail(mailOptions);
    console.log(email, Otp);
    return true;
  }

  return false;
};

module.exports = sendEmail;
