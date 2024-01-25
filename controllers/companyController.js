// companyController.js
const companyService = require('../services/companyService');
const User = require('../models/userModel');
const Role = require('../models/role');

async function getAllCompanies(req, res) {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json({ status: 200, message: "Companies", data: companies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createCompany(req, res) {
    try {
        const { companyName, description, phoneNo, address, logo } = req.body;

        const newCompany = await companyService.createCompany(companyName, description, phoneNo, address, logo);
        res.status(201).json({ status: 200, message: "Company Created", data: newCompany });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCompanyById(req, res) {
    try {
        const companyId = req.params.id;

        const company = await companyService.getCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const result = await User.aggregate([
            { $match: { company: company._id } },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleDetails'
                }
            },
            {
                $unwind: '$roleDetails'
            },
            {
                $group: {
                    _id: '$roleDetails.role_Name',
                    count: { $sum: 1 }
                }
            }
        ]);

        const roleCountMap = {};
        result.forEach((role) => {
            roleCountMap[role._id] = role.count;
        });


        const IndividualCount = roleCountMap['Individual'] || 0;
        const ManagerCount = roleCountMap['Manager'] || 0;

        res.status(200).json({
            message: 'Company found',
            data: { company, Individual: IndividualCount, Manager: ManagerCount }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


async function updateCompany(req, res) {
    try {
        const companyId = req.params.id;
        const updatedData = req.body;
        const updatedCompany = await companyService.updateCompany(companyId, updatedData);
        res.status(200).json({ status: 200, message: "Company updated", data: updatedCompany });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCompany(req, res) {
    try {
        const companyId = req.params.id;
        const deletedCompany = await companyService.deleteCompany(companyId);
        res.status(200).json({ status: 200, message: "Company deleted", data: deletedCompany });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllCompanies,
    createCompany,
    getCompanyById,
    updateCompany,
    deleteCompany,
};
