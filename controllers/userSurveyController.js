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
}

module.exports = new SurveyController();
