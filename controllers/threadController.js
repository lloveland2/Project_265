const User = require("../models/User");
const Thread = require("../models/Thread");
const Post = require("../models/Post");

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { author: '', title: '', content: '' };
    
    // validation errors
    if (err.message.includes('thread validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message; 
        });
    }

    return errors;
}

const thread_index = (req, res) => {
  Thread.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("threads/index", { title: "All Threads", threads: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const thread_create_get = (req, res) => {
  res.render("threads/create", { title: "New Thread" });
};


const thread_create_post = async (req, res) => {
    try {
        const { author, title, content } = req.body;
        const thread = new Thread({author, title})
        const post = new Post({ author, thread: thread._id, content })
        thread.save()
        .then(post.save().then(res.redirect('/threads/id/'+ thread._id) ));
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

};

module.exports = {
  thread_index,
  thread_create_get,
  thread_create_post,
};
