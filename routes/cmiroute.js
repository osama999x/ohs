// cmiRoutes.js
const express = require('express');
const router = express.Router();
const cmiController = require('../controllers/cmiController'); // Adjust the path accordingly

// Routes
router.get('/getAll', cmiController.getAllCmis);
router.post('/create', cmiController.createCmi);
router.get('/getById/:id', cmiController.getCmiById);
router.put('/update/:id', cmiController.updateCmi);
router.delete('/delete/:id', cmiController.deleteCmi);

module.exports = router;
