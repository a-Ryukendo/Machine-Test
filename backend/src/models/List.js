
const mongoose = require('mongoose');

const listSchema = mongoose.Schema(
    {
        firstname:{
            type: String,
            required: [true, 'Please add a first name'],
        },
        phone:{
            type: String,
            required: [true, 'Please add a phone number'],
            match: [/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code (e.g., +1234567890)']
        },
        notes: {
            type: String,
            required: [true, 'Please add notes']
        },
        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Agent',
            required: [true, 'Assigned agent is required.'],
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uploader is required.'],
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        }
    },
    {
    timestamps: true,
    }
)

const List = mongoose.model('List', listSchema);

module.exports = List;