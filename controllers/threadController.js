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

const thread_index_get = (req, res) => {
  Thread.find({})
    .populate({ path: 'author', select: 'name'
    })
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("threads/index", { title: "Synthro Studios – All Threads", threads: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const thread_id_get = (req, res) => {
  id = req.params.id
  thread = Thread.findById(id)
  .populate({ path: 'author', select: 'name' })
  .then((thread) => {
    Post.find({ thread: req.params.id })
    .populate({ path: 'author', select: 'name' })
    .sort({ createdAt: 1 })
    .then((posts) => {
    res.render("threads/id", {title : 'Synthro Studios – ' + thread.title ,posts, thread});
    })
  })
  .catch((err) => {
    console.log(err);
  });
};

const thread_id_post = async (req, res) => {
  try {
      const { author, thread, content } = req.body;
      createdAt = Date.now();
      Post.create({ author, thread, content, createdAt })
      .then(res.redirect('/threads/id/'+ thread) );
  }
  catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }

};

const thread_create_get = (req, res) => {
  res.render("threads/create", { title: "Dreamscape Forums – New Thread" });
};


const thread_create_post = async (req, res) => {
    try {
        const { author, title, content } = req.body;
        createdAt = Date.now();
        const thread = new Thread({author, title, createdAt})
        const post = new Post({ author, thread: thread._id, content, createdAt })
        thread.save()
        .then(post.save()
        .then(res.redirect('/threads/id/'+ thread._id) ));
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

};

module.exports = {
  thread_index_get,
  thread_id_get,
  thread_id_post,
  thread_create_get,
  thread_create_post,
};
