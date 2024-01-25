// cmiController.js
const cmiService = require('../services/cmiService');

async function getAllCmis(req, res) {
  try {
    const cmis = await cmiService.getAllCmis();
    res.status(200).json({ message: "Cmis", data: cmis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createCmi(req, res) {
  try {
    const { company, managers, users } = req.body;
    if (!company || !managers || !users) {
      throw new Error("Please provide all fields");
    }
    const newCmi = await cmiService.createCmi(company, managers, users);
    res.status(201).json({ message: "Cmi Created", data: newCmi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCmiById(req, res) {
  try {
    const cmiId = req.params.id;
    const cmi = await cmiService.getCmiById(cmiId);
    res.status(200).json({ message: "Cmi found", data: cmi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCmi(req, res) {
  try {
    const cmiId = req.params.id;
    const updatedData = req.body;
    const updatedCmi = await cmiService.updateCmi(cmiId, updatedData);
    res.status(200).json({ message: "Cmi updated", data: updatedCmi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCmi(req, res) {
  try {
    const cmiId = req.params.id;
    const deletedCmi = await cmiService.deleteCmi(cmiId);
    res.status(200).json({ message: "Cmi deleted", data: deletedCmi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllCmis,
  createCmi,
  getCmiById,
  updateCmi,
  deleteCmi,
};
