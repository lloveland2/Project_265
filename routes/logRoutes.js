const { Router } = require('express');
const logController = require('../controllers/logController');

const router = Router();

router.get('/', logController.devlog_get);

module.exports = router;