// companyService.js
const Company = require('../models/company');
const uploadfile=require('../utils/uploadFile')
async function getAllCompanies() {
  try {
    const companies = await Company.find();
    return companies;
  } catch (error) {
    throw error;
  }
}

async function createCompany(companyName, description, phoneNo, address,logo) {
  try {
    const dup = await Company.findOne({ companyName: { $regex: new RegExp(companyName, 'i') } });

    if (dup) {
        throw new Error(`${dup.companyName} Already Exists`);
    }
    let ik;

    if (logo) {
        ik = await uploadfile(logo);
    }

    const newCompany = new Company({ companyName, description, phoneNo, address,logo:ik });
    const savedCompany = await newCompany.save();
    return savedCompany;
  } catch (error) {
    throw error;
  }
}

async function getCompanyById(companyId) {
  try {
    const company = await Company.findById(companyId).select('-createdAt -updatedAt -__v');
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  } catch (error) {
    throw error;
  }
}

async function updateCompany(companyId, updatedData) {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updatedData, { upsert: true });
    if (!updatedCompany) {
      throw new Error("Company not found");
    }
    return updatedCompany;
  } catch (error) {
    throw error;
  }
}

async function deleteCompany(companyId) {
  try {
    const deletedCompany = await Company.findByIdAndDelete(companyId);
    if (!deletedCompany) {
      throw new Error("Company not found");
    }
    return deletedCompany;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
