const express= require('express');
const app = express();
const {Port}=require('./config/config')
const morgan=require("morgan");
const bodyParser = require('body-parser');
const errorHandler=require('./middleware/errorMiddleware.js')
const {dbConnect}=require('./db/db')
var path = require("path");
var cors = require("cors");
const cookieparser=require('cookie-parser');
//Connecting Database
dbConnect();
var corOptions = {
    origin: "*",
};
app.use(cors(corOptions));

app.use(express.json({ limit: "50mb" }));
app.use(cookieparser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(morgan("dev"));
//Routes
//Requiring
const userRouter=require('./routes/userRoutes.js');
const permissionRouter=require('./routes/permissionRoute.js');
const roleRouter=require('./routes/roleRoute.js');
const companyRoutes = require('./routes/companyRoute.js');
const surveyRouter=require('./routes/SurveyRoute.js');
//import SurveyRoutes from "./routes/SurveyRoute.js";
const userSurveyRouter=require('./routes/userSurvey');
const managerReqRouter=require('./routes/managerReqRoute.js')


//Implement Routes
app.use("/api/user", userRouter);
app.use("/api/survey", surveyRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/role', roleRouter)
app.use('/api/company',companyRoutes);
app.use('/api/userSurvey',userSurveyRouter);
app.use('/api/managerReset',managerReqRouter);


//Listening Server
app.listen(Port, () => {
    console.log("Server is Running On Port: " + Port);
})





