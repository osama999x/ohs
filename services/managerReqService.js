const ManagerRequest = require('../models/ManagerResetPass');

// Get all manager requests
const getAllManagerRequests = async () => {
  try {
    const managerRequests = await ManagerRequest.find();
    return managerRequests;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get manager request by ID
const getManagerRequestById = async (id) => {
  try {
    const managerRequest = await ManagerRequest.findById(id);
    return managerRequest;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update manager request by ID
const updateManagerRequest = async (id, updatedData) => {
  try {
    const managerRequest = await ManagerRequest.findByIdAndUpdate(
      id,
      updatedData,
      { upsert: true }
    );
    return managerRequest;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete manager request by ID
const deleteManagerRequest = async (id) => {
  try {
    const deletedManagerRequest = await ManagerRequest.findByIdAndDelete(id);
    return deletedManagerRequest;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllManagerRequests,
  getManagerRequestById,
  updateManagerRequest,
  deleteManagerRequest,
};
