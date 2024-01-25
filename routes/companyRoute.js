// companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController'); // Adjust the path accordingly

// Routes
router.get('/getAll', companyController.getAllCompanies);
router.post('/create', companyController.createCompany);
router.get('/getById/:id', companyController.getCompanyById);
router.put('/update/:id', companyController.updateCompany);
router.delete('/delete/:id', companyController.deleteCompany);

module.exports = router;
