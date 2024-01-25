const jwt=require('jsonwebtoken')
const {jwtAccessKey,jwtRefreshKey}=require("../config/config")
const TokenModel=require("../models/token")
class JWTService{
    // sign Access Token
static signAccessToken(payload,expiryTime){
    return jwt.sign(payload,jwtAccessKey,{expiresIn:expiryTime})
}
  // sign Refresh Token
static signRefreshToken(payload,expiryTime){
    return jwt.sign(payload,jwtRefreshKey,{expiresIn:expiryTime})
}
//Verify Access Token
static verifyAccessToken(token) {
    return jwt.verify(token,jwtAccessKey);
}
//Verify Refresh Token
static verifyRefreshToken(token){
    return jwt.verify(token,jwtRefreshKey);
}
// Storing Refresh token against UserID
static async storeRefreshToken(token,user){
    let newToken =new TokenModel({
        user : user._id,
        token : token
    })
    const Crud=await newToken.save();
    if(!Crud){
        throw Error ("Error while storing refresh token");
    }
}
}
module.exports=JWTService;
