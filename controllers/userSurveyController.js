const surveyService = require('../services/userSurvey');

class SurveyController {
  async getAllSurveys(req, res) {
    try {
      const surveys = await surveyService.getAllSurveys();
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
async getSurveyByUserId(req,res){
    const { id } = req.params;
    try {
      const survey = await surveyService.getSurveyByUserId(id);
      if (!survey) {
        return res.status(404).json({ error: 'Survey not found' });
      }
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  async getSurveyById(req, res) {
    const { id } = req.params;
    try {
      const survey = await surveyService.getSurveyById(id);
      if (!survey) {
        return res.status(404).json({ error: 'Survey not found' });
      }
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createSurvey(req, res) {
    const data = req.body;
    try {
      const survey = await surveyService.createSurvey(data);
      res.status(201).json(survey);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateSurvey(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedSurvey = await surveyService.updateSurvey(id, data);
      if (!updatedSurvey) {
        return res.status(404).json({ error: 'Survey not found' });
      }
      res.json(updatedSurvey);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteSurvey(req, res) {
    const { id } = req.params;
    try {
      const deletedSurvey = await surveyService.deleteSurvey(id);
      if (!deletedSurvey) {
        return res.status(404).json({ error: 'Survey not found' });
      }
      res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
// Controller function to handle requests
async  surveyController(req, res) {
  const {surveyName} = req.body; // Assuming the survey name is in the route parameter
  const searchKeyStrength = "Strength";
  const searchKeyGoal = "Goal";

  try {
    // Extract keys and values related to strengths
    const strengthResult = await surveyService.extractKeysAndValues(surveyName, searchKeyStrength);

    // Extract keys and values related to goals
    const goalResult = await surveyService.extractKeysAndValues(surveyName, searchKeyGoal);

    res.json({ strengthResult, goalResult });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


}

module.exports = new SurveyController();
