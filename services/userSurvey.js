
const userSurvey = require('../models/userSurvey');

class SurveyService {
    async getAllSurveys() {
        return userSurvey.find().populate({
            path: 'userId',
            model: 'User', select: "username"
        });
    }
    async getSurveyByUserId(id) {
        const surveys = (await userSurvey.find({ userId: id }).populate({
            path: 'userId',
            model:'User',
            select:"username"
        }))

        if (!surveys || surveys.length === 0) {
            return null;
        }

        const result = surveys.map(survey => {
            const keys = Object.keys(survey._doc).filter(key => key.startsWith('key'));

            keys.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

            const sortedSurvey = { "_id": survey._id, "Name": survey.Name, "status": survey.status, "UserName":survey.userId.username };
            keys.forEach(key => {
                const valueKey = key.replace('key', 'value');
                sortedSurvey[key] = survey[key];
                sortedSurvey[valueKey] = survey[valueKey];
            });

            return sortedSurvey;
        });

        return result;
    }






    async getSurveyById(id) {
        return userSurvey.findById(id).populate({
            path: 'userId',
            model: 'User', select: "username"
        });
    }

    async createSurvey(data) {
        const survey = new userSurvey(data);
        return survey.save();
    }

    async updateSurvey(id, data) {
        return userSurvey.findByIdAndUpdate(id, data, { upsert: true });
    }

    async deleteSurvey(id) {
        return userSurvey.findByIdAndDelete(id);
    }
}

module.exports = new SurveyService();
