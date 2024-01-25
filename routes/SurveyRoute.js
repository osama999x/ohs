// surveyRoutes.js
const express = require('express');
const surveyController = require('../controllers/surveyController');

const router = express();

router.get('/getAll', surveyController.getAllSurveys);
router.post('/create', surveyController.createSurvey);
router.get('/getById/:id', surveyController.getSurveyById);
router.put('/update/:id', surveyController.updateSurvey);
router.delete('/delete/:id', surveyController.deleteSurvey);

module.exports = router;
