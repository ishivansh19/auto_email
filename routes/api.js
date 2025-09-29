
const express = require('express');
const router = express.Router();
const { getContacts, addContact, updateContact, deleteContact } = require('../Controllers/contactController');
const { sendBulkEmail } = require('../Controllers/emailController'); // We will create this next

// Contact CRUD Routes
router.get('/contacts', getContacts);
router.post('/contacts', addContact);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

// Email Sending Route
router.post('/send-email', sendBulkEmail); // We will create this next

module.exports = router;