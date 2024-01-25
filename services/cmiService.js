// cmiService.js
const Cmi = require('../models/cmi');

async function getAllCmis() {
    try {
        const cmis = await Cmi.find().populate({
            path: 'company',
            select: "companyName"
        }).populate({
            path: "managers.manager",
            model: 'User',
             select: "username"
        }).populate({
            path: "users.user",
            model: 'User',
             select: "username"
        });
        return cmis;
    } catch (error) {
        throw error;
    }
}

async function createCmi(companyId, managers, users) {
    try {

         // Check if any manager ID is already assigned
         const existingManagerCmi = await Cmi.findOne({ "managers.manager": { $in: managers } });
         if (existingManagerCmi) {
             throw new Error("One or more manager is already assigned to another Company & Individual .");
         }

         // Check if any user ID is already assigned
         const existingUserCmi = await Cmi.findOne({ "users.user": { $in: users } });
         if (existingUserCmi) {
             throw new Error("One or more user is already assigned to another  Company & Individual .");
         }
        const newCmi = new Cmi({ company: companyId, managers, users });
        const savedCmi = await newCmi.save();
        return savedCmi;
    } catch (error) {
        throw error;
    }
}

async function getCmiById(cmiId) {
    try {
        const cmi = await Cmi.findById(cmiId).populate({
            path: 'company',
            select: "companyName"
        }).populate({
            path: "managers.manager",
            model: 'User',
             select: "username"
        }).populate({
            path: "users.user",
            model: 'User',
             select: "username"
        });
        if (!cmi) {
            throw new Error("Cmi not found");
        }
        return cmi;
    } catch (error) {
        throw error;
    }
}

async function updateCmi(cmiId, updatedData) {
    try {
        const updatedCmi = await Cmi.findByIdAndUpdate(cmiId, updatedData, { upsert: true });
        if (!updatedCmi) {
            throw new Error("Cmi not found");
        }
        return updatedCmi;
    } catch (error) {
        throw error;
    }
}

async function deleteCmi(cmiId) {
    try {
        const deletedCmi = await Cmi.findByIdAndDelete(cmiId);
        if (!deletedCmi) {
            throw new Error("Cmi not found");
        }
        return deletedCmi;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCmis,
    createCmi,
    getCmiById,
    updateCmi,
    deleteCmi,
};
