const Thread = require("../models/Thread");
const Post = require("../models/Post");

// handle errors
const handleThreadErrors = (err) => {
    console.log(err.message);
    let errors = { author: '', title: '', content: '' };
    
    // validation errors
    if (err.message.includes('Thread validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message; 
        });
    }

    return errors;
}

const handlePostErrors = (err) => {
    console.log(err.message);
    let errors = { author: '', thread: '', content: '' };
    
    // validation errors
    if (err.message.includes('Post validation failed')) {
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
  const id = req.params.id
  Thread.findById(id)
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
  const id = req.params.id
  try {
      const { author, content } = req.body;
      createdAt = Date.now();
      const post = new Post({ author, thread: id, content, createdAt })
      post.save();
      res.status(201).json({ post: post._id });
  }
  catch (err) {
      const errors = handlePostErrors(err);
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
      .then(post.save())
      res.status(201).json({ thread: thread._id })
  }
  catch (err) {
      const errors = handleThreadErrors(err);
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
