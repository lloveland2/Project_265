const Log = require('../models/Logs')

const devlog_get = (req, res) => {
    Log.find({})
      .sort({ createdAt: -1 })
      .then((result) => {
        res.render("devlog", { title: "Synthro Studios – Devlog", logs: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  module.exports = {
    devlog_get
  }