const { string } = require('joi');
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    }
}, { timestamps: true });
const token = mongoose.model('token', TokenSchema);

module.exports = token;
