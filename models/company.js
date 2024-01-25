
const mongoose = require("mongoose");
// Company Schema
const companySchema = new mongoose.Schema(
    {
      companyName: {
        type: String,
        trim: true,
        required: true,
        unique:true
      },
      description: {
        type: String,
        trim: true,
      },
      phoneNo: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      logo:{
        type :String
      }
    },
    { timestamps: true }
  );

  const Company = mongoose.model('Company', companySchema);


  module.exports = Company;
