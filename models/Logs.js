const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please title your Log.'],
        maxlength: [80, 'Title must be 80 characters or less.']
    },
    content: {
        type: String,
        required: [true, 'This is a required field'],
        maxlength: [3000, 'Post exceeds character limit of 3000.']
    }
});

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);
module.exports = Log;