// sendEmail.js
const nodemailer = require("nodemailer");
const saveOtp = require("../utils/saveOtp");

const sendEmail = async (email,description) => {
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
    subject: "Survey Link",
    text: `Your Survey is ${description}` ,
  };


    const result = await transporter.sendMail(mailOptions);
    if(result){
        return true;
    }else{

        return false;
    }


};

module.exports = sendEmail;
