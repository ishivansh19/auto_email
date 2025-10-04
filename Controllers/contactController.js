const Contact = require('../models/Contact');

// @desc    Get all contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};

// @desc    Add a new contact
exports.addContact = async (req, res) => {
    try {
        const { name, email, company } = req.body;
        console.log(req.user);
        const newContact = new Contact({
            name,
            email,
            company,
            user: req.user.id
            });
        console.log(newContact);
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: 'Error adding contact', error });
    }
};

// @desc    Update a contact
exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        //ensures that only the user who created the contact can update it
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this contact' });
        }
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: 'Error updating contact', error });
    }
};

// @desc    Delete a contact
exports.deleteContact = async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        //SECURITY CHECK
        // Ensure the user owns the contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this contact' });
        }

        // If authorized, proceed with deletion
        await contact.deleteOne();
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};