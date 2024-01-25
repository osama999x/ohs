const express=require('express');
const router=express();

//Auth
const auth=require('../middleware/auth')
//Controller
const authController=require('../controllers/userControllers')

//Routes
router.post('/SignUp',authController.register)
router.post('/ManagerSignUp',authController.registerWebManager)
router.get('/getAll',authController.getAll)
router.get('/GetAllManagers',authController.getManager)
router.post('/getSpecific',authController.roleSearch)
router.get('/getById/:id',authController.getById)
router.post('/Login',authController.Login)
router.post('/Logout',authController.LogOut)
router.post('/Refresh',authController.refresh)
router.put("/update/:id", authController.updateUser);
router.delete("/delete/:id",authController.deleteUser);
router.post("/sendOtp",authController.sendSurveyMail);
router.get('/GetManagerByCompany/:id',authController.getManagerByCompany);
router.get('/GetUserByCompany/:id',authController.getUserByCompany);
router.get("/GetManagerIndividualsByCompany/:companyId",authController.getManagerIndividuals);
router.route("/ForgotPassword").put(authController.setForgotPassword);
router.post("/verifyOtp",authController.verifyOtp);
router.post('/sendResetPassOtp',authController.sendOtp)



module.exports=router;
