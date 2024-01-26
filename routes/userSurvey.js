const express = require('express');
const router = express();
const userSurveyController = require('../controllers/userSurveyController');

// GET all Usersurveys
router.get('/getAll', userSurveyController.getAllSurveys);

// GET survey by ID
router.get('/getById/:id', userSurveyController.getSurveyById);

// GET UserSurvey by UserID
router.get('/getByUserId/:id',userSurveyController.getSurveyByUserId)
// CREATE a new survey
router.post('/create', userSurveyController.createSurvey);

// UPDATE survey by ID
router.put('/update/:id', userSurveyController.updateSurvey);

// DELETE survey by ID
router.delete('/delete/:id', userSurveyController.deleteSurvey);

router.post('/getName', userSurveyController.surveyController);

module.exports = router;
