const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const uploadFile = require("../utils/uploadFile");
const Role=require('../models/role')

const userService = {
    create: async ( username, email, password,Image) => {
        const dup1 = await User.findOne({ username: username });
        if (dup1) {
            throw new Error("Username already exists");
        }
        if(Image){
            var imageU=await  uploadFile(Image);
        }
        const role=await Role.findOne({role_Name:"Individual"})
        const hashedPassword = await bcrypt.hash(password, 10);

        const dup = await User.findOneAndUpdate({ email: email },{

            username: username,
            password: hashedPassword,
            image:imageU,
            role:role._id


        },{
            upsert: true,
        }
        );
        if(dup){
            return dup;
        }
        else{

            throw Error('Something went wrong while creating the user');
        }
    },
    createManager: async ( username, email,department,jobTitle,company, password, Image) => {

        const dup = await User.findOne({ email: email });
        if (dup) {
            throw new Error("Email already in use");
        }
        if(Image){
            var imageU=await  uploadFile(Image);
        }
        const role=await Role.findOne({role_Name:"Manager"})


        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new User({
            username: username,
            email: email,
            department:department,
            jobTitle:jobTitle,
            company:company,
            password: hashedPassword,
            image:imageU,
            role:role._id
        });
        const createdUser = await newUser.save();

        return createdUser;
    },
    getAll: async () => {
        const roles=await Role.findOne({role_Name:"Individual"})
        const users = await User.find({role:roles._id}).select("-profile_image")
        .populate({
          path: "role",
          model: "Role",
          select: "role_Name ",

          populate: {
            path: "permission.Permission_id",
            model: "Permission",
            select: "-createdAt -updatedAt -__v  -isActive",
          },
        }).populate({
            path: 'company',
            select:'companyName'
        });
        if (!users) {
            return { statusCode: 500, message: "Error retrieving data" };
        } else {
            return users;
        }
    },
    getById: async (id) => {
        const userRecord = await User.find({ _id: id }).select("-profile_image")
        .populate({
          path: "role",
          model: "Role",
          select: "role_Name ",

          populate: {
            path: "permission.Permission_id",
            model: "Permission",
            select: "-createdAt -updatedAt -__v  -isActive",
          },
        });
        if (!userRecord) {
            return { statusCode: 404, message: "No User found with the given id" };
        } else {
            return userRecord;
        }
    },
    Login: async (email, password) => {
        const userFind = await User.findOne({ email: email }).populate({
            path: "role",
            model: "Role",
            select: "role_Name ",

            populate: {
              path: "permission.Permission_id",
              model: "Permission",
              select: "-createdAt -updatedAt -__v  -isActive",
            },
          }).populate({
              path: 'company',
              select:'companyName'
          });

        if (!userFind) {
            throw new Error("User is not Registered");
        }

        const passwordMatch = await bcrypt.compare(password, userFind.password || '');

        if (!passwordMatch) {
            throw new Error("Incorrect Password");
        }

        return userFind;
    },
    Delete:async(id)=>{
        const userFind=await User.findByIdAndDelete({_id:id})
        if(!userFind){
            return{statusCode:400,message:"The user cannot be deleted."}
        }else{
            return{statusCode:200,message:"Successfully Deleted"}
        }
    },
 setForgotPassword :async (email, password) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const result = await User.findOneAndUpdate(
    { email: email },
    {
      password,
    },
    {
      upsert: true,
    }
  );
  return result;
}
};

module.exports = userService;
