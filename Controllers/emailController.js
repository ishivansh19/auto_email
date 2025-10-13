const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sendBulkEmail = async (req, res) => {
    const { contactsToSend, subject, messageTemplate } = req.body;

    // console.log(contactIds, subject, messageTemplate);
    if (!contactsToSend || contactsToSend.length === 0|| !subject || !messageTemplate) {
        return res.status(400).json({ message: 'Missing required fields: contactIds, subject, messageTemplate.' });
    }

    //Nodemailer Setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {       
        const report = {
            sent: [],
            failed: []}
     for (const item of contactsToSend) {
        try {
            const contact = await Contact.findById(item.id);
            if (!contact) {
                report.failed.push({ name: `ID: ${item.id}`, reason: 'Contact not found.' });
                continue;
            }
            // ... (delay, message personalization, and mailOptions setup)
            delay(1500);
            let personalizedMessage = messageTemplate.replace(/\[Name\]/g, contact.name).replace(/\[Company Name\]/g, contact.company);
            const mailOptions = { 
                from: process.env.EMAIL_USER,
                to: contact.email,
                subject: subject,
                html: personalizedMessage,
                };
            await transporter.sendMail(mailOptions);
            report.sent.push(contact.name);

            // on success, UPDATE THE CONTACT DOCUMENT
            const updateData = {
                lastEmailedAt: new Date()
            };
            if (item.reminderAt) {
                updateData.reminderAt = new Date(item.reminderAt);
            }

            // If a note was provided, use $push to add it to the notes array
            if (item.note && item.note.trim() !== '') {
                updateData.$push = { notes: { text: item.note } };
            }

            await Contact.findByIdAndUpdate(contact._id, updateData);

        } catch (error) {
            report.failed.push({ name: `Contact ID: ${item.id}`, reason: error.message });
        }
    }
} catch (error) {
    res.status(500).json({ message: 'Error sending emails', error });
}

    res.status(200).json({ message: 'Email sending process completed.', report });
};