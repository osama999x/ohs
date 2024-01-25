const Joi = require('joi');
const userService = require('../services/userService');
const bcrypt = require("bcrypt");
const JwtService = require("../utils/JWTservice.js");
const tokee = require('../models/token');
const uploadFile = require("../utils/uploadFile");
const User = require('../models/userModel.js');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const sendEmail = require("../utils/sendOtp");
const saveOTP = require("../utils/saveOtp");
const Role = require('../models/role.js');
const Company = require('../models/company.js');
const userSurvey = require('../models/userSurvey');
const ManagerResetPass=require('../models/ManagerResetPass.js')
const ForgotPasswordOtp=require('../utils/forgotPassOTP.js')

const authController = {
    register: async (req, res, next) => {
        try {
            const registerSchema = Joi.object({
                username: Joi.string().min(2).max(20).required(),
                email: Joi.string().email().required(),
                password: Joi.string().pattern(passwordRegex).required(),
                Image: Joi.string().optional(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            });

            const { error } = registerSchema.validate(req.body);

            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const { username, email, password, Image, confirmPassword } = req.body;
            const newUser = await userService.create(username, email, password, Image);

            if (newUser) {
                let Access = JwtService.signAccessToken({ id: newUser._id, email: newUser.email }, '5m');
                let Refresh = JwtService.signRefreshToken({ id: newUser._id, email: newUser.email }, '30m');
                if (!Access || !Refresh) {
                    throw Error;
                }
                // storing in db
                await JwtService.storeRefreshToken(Refresh, newUser._id)

                // //sending Access token in cookiess
                // res.cookie('accesstoken', Access, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // });
                // //Sending Refresh token In cookiee
                // res.cookie('refreshtoken', Refresh, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // })
                // Handle success
                res.status(201).send({ status: 200, message: 'User registered successfully', data: newUser, AccessToken: Access, RefreshToken: Refresh, auth: true });
            } else {
                // Handle failure
                res.status(500).send('User registration failed');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    registerWebManager: async (req, res, next) => {
        try {
            const registerSchema = Joi.object({
                username: Joi.string().min(2).max(20).required(),
                email: Joi.string().email().required(),
                department: Joi.string().optional(),
                jobTitle: Joi.string().optional(),
                company: Joi.string().optional(),
                password: Joi.string().pattern(passwordRegex).required(),
                Image: Joi.string().optional(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            });

            const { error } = registerSchema.validate(req.body);

            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const { username, email, department, jobTitle, company, password, Image, confirmPassword } = req.body;
            const newUser = await userService.createManager(username, email, department, jobTitle, company, password, Image);

            if (newUser) {
                let Access = JwtService.signAccessToken({ id: newUser._id, email: newUser.email }, '5m');
                let Refresh = JwtService.signRefreshToken({ id: newUser._id, email: newUser.email }, '30m');
                if (!Access || !Refresh) {
                    throw Error;
                }
                // storing in db
                await JwtService.storeRefreshToken(Refresh, newUser._id)

                // //sending Access token in cookiess
                // res.cookie('accesstoken', Access, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // });
                // //Sending Refresh token In cookiee
                // res.cookie('refreshtoken', Refresh, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // })
                // Handle success
                const ManagerMail = await sendEmail(newUser.email, password);
                if (!ManagerMail) {
                    console.log('Couldnt Send Email to Manager')
                }
                res.status(201).send({ status: 200, message: 'User registered successfully', data: newUser, AccessToken: Access, RefreshToken: Refresh, auth: true });
            } else {
                // Handle failure
                res.status(500).send('User registration failed');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getManager: async (req, res, next) => {
        try {

            const findManager = await Role.findOne({ role_Name: "Manager" });

            if (!findManager) {
                return res.status(400).send({ message: "No Role Found" });
            }

            const managers = await User.find({ role: findManager._id }).populate({
                path: 'company',
                model: 'Company',
                select: "companyName"
            });

            if (managers.length > 0) {
                res.status(200).send({ message: "All Data", data: managers });
            } else {
                res.status(400).send({ message: "No Manager Found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error", error: error.message });
        }
    },
    getAll: async (req, res, next) => {
        try {
            const all = await userService.getAll()
            if (all) {
                res.status(200).send({ message: "All Data", data: all })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const one = await userService.getById(id);
            if (one) {
                res.status(200).send({ message: "Record Found", data: one })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    Login: async (req, res) => {
        try {
            const LoginSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().pattern(passwordRegex).required(),
            });

            const { error } = LoginSchema.validate(req.body);

            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const { email, password } = req.body;
            const Login = await userService.Login(email, password);

            if (Login) {

                let Access = JwtService.signAccessToken({ _id: Login._id }, '5m');
                let Refresh = JwtService.signRefreshToken({ _id: Login._id }, '30m');

                if (!Access || !Refresh) {
                    throw new Error("Error in generating token");
                }

                const TokenUpdate = await tokee.updateOne(
                    { user: Login._id },
                    { token: Refresh },
                    { upsert: true }
                );

                // //sending Access token in cookies
                // res.cookie('accesstoken', Access, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // });

                // //Sending Refresh token In cookie
                // res.cookie('refreshtoken', Refresh, {
                //     maxAge: 1000 * 60 * 60 * 24,
                //     httpOnly: true
                // });

                return res.status(200).send({ status: 200, message: "User Login Success ", data: Login, AccessToken: Access, RefreshToken: Refresh, auth: true });
            } else {
                return res.status(400).send({ message: "Invalid Email or Password" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    },
    LogOut: async (req, res) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(401).send({ message: "Unauthorized" });
            }

            const refreshToken = authorization;

            const deletedToken = await tokee.findOneAndUpdate(
                { token: refreshToken },
                { $set: { token: null } },
            );
            if (!deletedToken) {
                return res.status(400).send({ message: "Logout Failed!" })
            }
            // 2: Clear Headers
            res.setHeader('Authorization', '');

            // 3: Response
            return res.status(200).send({ message: "Logout Successfully", auth: false });
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    },
    refresh: async (req, res, next) => {
        // 1. get refreshToken from cookies
        // 2. verify refreshToken
        // 3. generate new tokens
        // 4. update db, return response

        const { originalRefreshToken } = req.body;

        let id;

        try {
            id = JwtService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (e) {
            const error = {
                status: 401,
                message: "Unauthorized",
            };

            res.status(401).send({ error });
        }

        try {
            const match = tokee.findOne({
                _id: id,
                token: originalRefreshToken,
            });

            if (!match) {
                const error = {
                    status: 401,
                    message: "Unauthorized",
                };

                return next(error);
            }
        } catch (e) {
            return next(e);
        }

        const accessToken = JwtService.signAccessToken({ _id: id }, "5m");

        const refreshToken = JwtService.signRefreshToken({ _id: id }, "30m");

        await tokee.updateOne({ _id: id }, { token: refreshToken });

        const user = await User.findOne({ _id: id }).select('-password -createdAt -updatedAt -__v');
        return res.status(200).json({
            user: user,
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            auth: true
        });
    },
    updateUser: async (req, res) => {
        const id = req.params.id;
        const updateFields = {};
        const { username, email, password, Image, jobTitle, department, company, role } = req.body;

        if (username) {
            updateFields.username = username
        };
        if (email) { updateFields.email = email };
        if (password) {
            const hashpass = await bcrypt.hash(password, 10);
            updateFields.password = hashpass;
        }
        if (Image != null) {
            var img = await uploadFile(Image);
            updateFields.image = img;
        }
        if (jobTitle) { updateFields.jobTitle = jobTitle };
        if (department) { updateFields.department = department };
        if (company) { updateFields.company = company };
        if (role) { updateFields.role = role };

        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: id },
                updateFields,
                { upsert: true }
            )
                .select("-password")
                .select("-__v");
            if (updatedUser) {
                return res.status(200).json({ status: 200, data: updatedUser });
            } else {
                return res.status(400).json({ status: 400, message: " Not updated" });
            }

        } catch (error) {
            throw new Error(error);
        }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id;
        try {

            const daletedUser = await User.findOneAndDelete({ _id: id });
            return res.status(200).json({ data: daletedUser });
        } catch (error) {
            throw new Error(error);
        }
    },
    sendSurveyMail: async (req, res) => {
        try {
            const registerSchema = Joi.object({
                email: Joi.string().email().required(),
                company: Joi.string().optional(),
                data: Joi.object(),
                description: Joi.string()
            });

            const { error } = registerSchema.validate(req.body);

            if (error) {
                return res.status(400).send({ error: error.details[0].message });
            }

            const { email, company, data, description } = req.body;


            const existingUser = await User.findOneAndUpdate(
                { email: email },
                { $set: { company: company } },
                { new: true, upsert: true }
            );


            const surveyData = {
                ...data,
                userId: existingUser._id,
            };

            const filter = { userId: existingUser._id, Name: data.Name };
            const update = { $set: surveyData };
            const options = { new: true, upsert: true };

            const savedSurvey = await userSurvey.findOneAndUpdate(filter, update, options);

            if (!savedSurvey) {
                return res.status(400).json({ status: 400, message: "Survey Couldn't Be Saved Against Individual" });
            }

            const Otp = await sendEmail(existingUser.email, description);

            if (Otp) {

                res.status(200).json({ status: 200, message: "OTP sent successfully" });
            } else {

                res.status(400).json({ status: 400, message: "OTP not sent" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
    },
    verifyOtp: async (req, res) => {
        const { email, otp } = req.body;
        const expireOtp = await saveOTP.validateOTP(email, otp);
        if (!expireOtp) {
            res.status(400).send({
                status: 400,
                message: "Otp Expire please try again!",
            });
        } else {
            const user = await saveOTP.verifiyOtp(email, otp);
            if (user) {
                res.status(200).send({ status: 200, message: "OTP Verified" });
            } else {
                res.status(400).send({ status: 400, message: "Invalid OTP" });
            }
        }
    },
    roleSearch: async (req, res) => {
        try {
            const { Search } = req.body;
            const roles = await Role.findOne({ role_Name: Search })
            let data = await User.find({ role: roles })
            if (data) {
                res.status(200).send({ message: "Record Found", data: data })
            } else {
                res.status(404).send({ message: "No Record Found!" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getUserByCompany: async (req, res) => {
        try {
            const id = req.params.id;
            const Comp = await Company.findById(id);
            const rolew = await Role.findOne({ role_Name: "Individual" });

            const users = await User.find({ role: rolew._id, company: Comp._id }).select('-password');
            const userCount = await User.countDocuments({ role: rolew._id, company: Comp._id });

            if (users.length > 0) {
                return res.status(200).json({ status: 200, message: 'Data found', data: users, count: userCount });
            } else {
                return res.status(200).json({ status: 200, message: 'No Data Found', data: [], count: 0 });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
     getManagerByCompany: async (req, res) => {
        try {
            const id = req.params.id;
            const Comp = await Company.findById(id);
            const rolew = await Role.findOne({ role_Name: "Manager" });
            const users = await User.find({ role: rolew._id, company: Comp._id }).select('-password');
            const userCount = await User.countDocuments({ role: rolew._id, company: Comp._id });
            if (users.length > 0) {
                return res.status(200).json({ message: 'Data found', data: users, count: userCount });
            } else {
                return res.status(200).json({ message: 'No Data Found', data: [], count: 0 });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getManagerIndividuals: async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const role = await Role.findOne({ role_Name: "Individual" });
            const users = await User.find({ company: companyId, role: role._id });

            if (users.length > 0) {
                const surveyData = [];
                for (const user of users) {
                    const surveys = await userSurvey.find({ userId: user._id }).populate({ path: 'userId', model: 'User', select: "username" });
                    surveyData.push({ user: user, surveys: surveys });
                }
                return res.status(200).json({ message: 'Successfully got the Individuals', data: surveyData });
            } else {
                return res.status(404).json({ message: "No Individuals Found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    setForgotPassword: async (req, res) => {
        try {
          const { email, password, reEnterPassword } = req.body;

          if (!email || !password) {
            return res.status(401).json({ status: 403, message: "Please enter all fields" });
          }

          if (password !== reEnterPassword) {
            return res.status(406).json({ status: 406, message: "Passwords do not match" });
          }

          let result;

          const emailFind = await User.findOne({ email: email }).populate({ path: 'role', model: 'Role', select: 'role_Name' });

          if (emailFind.role.role_Name == "Manager") {
            const Notifications = new ManagerResetPass({
              userId: emailFind._id,
              description: `${emailFind.username} has Requested for Update Password`
            });
            await Notifications.save();
            return res.status(200).json({status:200,message:`${emailFind.username} Reset Password Request Has been Submitted!`})
          } else {
            result = await userService.setForgotPassword(email, password);
          }

          if (!result) {
            return res.status(500).json({ status: 500, message: "Password is Not Updated" });
          } else {
            return res.status(200).json({ status: 200, message: "Password updated Successfully" });
          }
        } catch (error) {
          console.error("Error", error);
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
      },
       sendOtp :async (req, res) => {
        try {
          const { email } = req.body;
          const fund = await User.findOne({ email: email });
          if (!fund) {
            return res.status(404).json({status:404,message:"Invalid Email"});
          }
          const Otp = await ForgotPasswordOtp(fund.email);

          if (Otp) {
            // OTP is successfully sent
            res.status(200).json({status:200, message: "OTP sent successfully" });
          } else {
            // If OTP is not sent
            res.status(400).json({ status:400,message: "OTP not sent" });
          }
        } catch (error) {
          console.log(error);
        }
      }

}



module.exports = authController;
