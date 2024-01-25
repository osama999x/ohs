const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        department: {
            type: String,
        },
        jobTitle: {
            type: String
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        password: {
            type: String,
            trim: true
            //   minlength: [8, "8 characters must"],
        },
        image: {
            type: String,
            default: "Proff IMG"
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            trim: true
        },
        survey: [{
            surveyName:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Survey',
            trim:true
    }}]
    },
    { timestamps: true }
);
const User = mongoose.model('User', userSchema);
module.exports = User;
