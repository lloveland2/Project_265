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
    }
},
{ timestamps: true }
);

const Post = mongoose.model('post', postSchema);
module.exports = Post;