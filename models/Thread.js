const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/User');

const threadSchema = new Schema({
    author: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please title your thread.'],
        maxlength: [80, 'Title must be 80 characters or less.']
    },
    createdAt: {
        type: Date
    }
},
);

threadSchema.pre('save', async (next) => {
    this.createdAt = await Date.now();
    next();
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);
module.exports = Thread;