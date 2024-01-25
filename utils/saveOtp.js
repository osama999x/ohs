const userResetPasswordModel = require("../models/userResetPassword");

const saveOtp = {
  generateOTP: () => {
    // Generate and return an OTP here, e.g., a random 6-digit number
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  saveOTP: async function (email, otp) {
    const user = await userResetPasswordModel.findOne({ email: email });

    if (user) {
      const updateUser = await userResetPasswordModel.findOneAndUpdate(
        { email: email },
        { otp, expireOtp: this.getExpiryDate() }, // Fix here
        { new: true }
      );
      return updateUser;
    } else {
      const newUser = new userResetPasswordModel({
        email,
        otp,
        expireOtp: this.getExpiryDate(), // Fix here
      });
      const result = await newUser.save();
      return result;
    }
  },
  verifiyOtp: async (email, otp) => {
    const customer = await userResetPasswordModel.findOne({
      email: email,
      otp: otp,
    });
    return customer;
  },

  validateOTP: async function (email) {
    const user = await userResetPasswordModel.findOne({
      email: email,
      expireOtp: { $gt: new Date() }, // Check if OTP is not expired
    });
    return user !== null;
  },

  getExpiryDate: function () {
    const now = new Date();
    return new Date(now.getTime() + 3 * 60000); // 3 minutes expiry
  },
};

module.exports = saveOtp;
