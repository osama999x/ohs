const JWTService = require('../utils/JWTservice');
const User = require('../models/userModel');
const UserDTO = require('../dto/user');

const auth = async (req, res, next) => {
    try {
        // 1. refresh, access token validation
        const token = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : null;

        console.log(' Token:', token);

        if (!token) {
            res.status(404).send({
                status: 404,
                message: 'Please Provide Access Token'
            })
        }

        let _id;

        try {
            _id = JWTService.verifyAccessToken(token)._id;
        } catch (e) {

            res.status(401).send({
                status: 401,
                message: 'Access Token is Expired!'
            })
        }

        let user;

        try {
            user = await User.findOne({ _id: _id });
        } catch (error) {
            return next(error);
        }

        const userDto = new UserDTO(user);

        req.user = userDto;

        next();
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

module.exports = auth;
