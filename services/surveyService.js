// surveyService.js
const Survey = require('../models/SurveyModel');

class SurveyService {
  async getAllSurveys() {
    try {
      const surveys = await Survey.find();
      return surveys;
    } catch (error) {
      throw error;
    }
  }

  async getSurveyById(id) {
    try {
      const survey = await Survey.findById(id);
      return survey;
    } catch (error) {
      throw error;
    }
  }

  async createSurvey(data) {
    try {
      const survey = new Survey(data);
      const result = await survey.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateSurvey(id, data) {
    try {
      const result = await Survey.findByIdAndUpdate(id, data, { upsert: true });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteSurvey(id) {
    try {
      const result = await Survey.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }


}

module.exports = new SurveyService();
