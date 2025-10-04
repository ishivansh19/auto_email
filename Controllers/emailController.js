const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sendBulkEmail = async (req, res) => {
    const { contactIds, subject, messageTemplate } = req.body;

    // console.log(contactIds, subject, messageTemplate);
    if (!contactIds || contactIds.length === 0 || !subject || !messageTemplate) {
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
        const contacts = await Contact.find({ '_id': { $in: contactIds } });
        
        // console.log(contacts);
        const report = {
            sent: [],
            failed: []
        };

        for (const contact of contacts) {
            //Error Handling for Missing Info
            await delay(1000);
            if (!contact.email || !contact.name || !contact.company) {
                report.failed.push({ 
                    name: contact.name || 'N/A', 
                    reason: 'Missing required information (email, name, or company).' 
                });
                continue; // Skips to the next contact
            }

            // Auto-adjusting Components (Templating)
            let personalizedMessage = messageTemplate
                .replace(/\[Name\]/g, contact.name)
                .replace(/\[Company Name\]/g, contact.company);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: contact.email,
                subject: subject,
                html: personalizedMessage, // Use HTML for better formatting
            };

            // --- Sending the Email ---
            try {
                await transporter.sendMail(mailOptions);
                report.sent.push(contact.name);
            } catch (emailError) {
                report.failed.push({ name: contact.name, reason: emailError.message });
            }
        }
        
        res.status(200).json({ message: 'Email sending process completed.', report });

    } catch (dbError) {
        res.status(500).json({ message: 'Error fetching contacts from database.', error: dbError.message });
    }
};