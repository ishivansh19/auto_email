const mongoose=require('mongoose')
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // Each email should be unique
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',//reference of user logged in
        required: true
    },
    lastEmailedAt:{
        type: Date,
        default: null
    },
    reminderAt:{
        type: Date,
        default: null
    },
    notes: [{
        text: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);