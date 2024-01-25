const managerService = require('../services/managerReqService');

// Get all manager requests
const getAllManagerRequests = async (req, res) => {
  try {
    const managerRequests = await managerService.getAllManagerRequests();
    res.json(managerRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get manager request by ID
const getManagerRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const managerRequest = await managerService.getManagerRequestById(id);
    if (!managerRequest) {
      return res.status(404).json({ error: 'Manager Request not found' });
    }
    res.json(managerRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update manager request by ID
const updateManagerRequest = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedManagerRequest = await managerService.updateManagerRequest(
      id,
      updatedData
    );
    if (!updatedManagerRequest) {
      return res.status(404).json({ error: 'Manager Request not found' });
    }
    res.json(updatedManagerRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete manager request by ID
const deleteManagerRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedManagerRequest = await managerService.deleteManagerRequest(id);
    if (!deletedManagerRequest) {
      return res.status(404).json({ error: 'Manager Request not found' });
    }
    res.json(deletedManagerRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllManagerRequests,
  getManagerRequestById,
  updateManagerRequest,
  deleteManagerRequest,
};
