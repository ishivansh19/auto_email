const express = require('express');
const router = express.Router();

// Import Controllers
const { getContacts, addContact, updateContact, deleteContact } = require('../Controllers/contactController');
const { sendBulkEmail } = require('../Controllers/emailController');
const { register, login , getMe} = require('../Controllers/userController'); 
const {protect}=require('../Middlewares/auth');
const { getTemplate, saveTemplate } = require('../Controllers/templateController');


//Authentication Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/me',protect, getMe);

//templates
router.get('/template', protect, getTemplate);
router.put('/template', protect, saveTemplate);

//Contact CRUD Routes
router.get('/contacts',protect, getContacts);
router.post('/contacts',protect, addContact);
router.put('/contacts/:id',protect,updateContact);
router.delete('/contacts/:id',protect,deleteContact);

//Email Sending Route
router.post('/send-email',protect,sendBulkEmail);

module.exports = router;