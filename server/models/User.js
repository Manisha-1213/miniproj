// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['volunteer', 'organization'], required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // Ensure Event model is defined
});

module.exports = mongoose.model('User', userSchema);