const mongoose = require("mongoose");


const managerSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        trim: true,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      status:{
        type:String,
        enum:['Read','Approved','UnRead'],
        default : "UnRead"
      }
    },
    { timestamps: true }
  );

  const ManagerResetPass = mongoose.model('ManagerRequest', managerSchema);


  module.exports = ManagerResetPass;
