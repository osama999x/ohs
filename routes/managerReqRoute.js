const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerReqController');

// Get all manager requests
router.get('/getAll', managerController.getAllManagerRequests);

// Get manager request by ID
router.get('/getById/:id', managerController.getManagerRequestById);

// Update manager request by ID
router.put('/update/:id', managerController.updateManagerRequest);

// Delete manager request by ID
router.delete('/delete/:id', managerController.deleteManagerRequest);

module.exports = router;
