// surveyController.js
const surveyService = require('../services/surveyService');

async function getAllSurveys(req, res) {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.status(200).json({ status: 200, message: "Surveys", data: surveys });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createSurvey(req, res) {
  try {
    const data = req.body;
    const result = await surveyService.createSurvey(data);
    res.status(201).json({ status: 200, message: "Survey Created", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSurveyById(req, res) {
  try {
    const surveyId = req.params.id;
    const survey = await surveyService.getSurveyById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json({ status: 200, message: "Survey found", data: survey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateSurvey(req, res) {
  try {
    const surveyId = req.params.id;
    const updatedData = req.body;
    const updatedSurvey = await surveyService.updateSurvey(surveyId, updatedData);
    res.status(200).json({ status: 200, message: "Survey updated", data: updatedSurvey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteSurvey(req, res) {
  try {
    const surveyId = req.params.id;
    const deletedSurvey = await surveyService.deleteSurvey(surveyId);
    res.status(200).json({ status: 200, message: "Survey deleted", data: deletedSurvey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllSurveys,
  createSurvey,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
};

