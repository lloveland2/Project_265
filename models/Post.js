const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/User');

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
    thread: {
        type: Schema.Types.ObjectID,
        ref: "Thread",
        required: true,
    },
    content: {
        type: String,
        required: [true, 'This is a required field'],
        maxlength: [3000, 'Post exceeds character limit of 3000.']
    },
    createdAt: {
        type: Date,
        required: true
    }
});

postSchema.pre('save', async (next) => {
    this.createdAt = await Date.now();
    next();
});


const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
module.exports = Post;