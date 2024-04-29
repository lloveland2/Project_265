const { Router } = require('express');
const threadController = require('../controllers/threadController');

const router = Router();

router.get('/', threadController.thread_index)
router.get('/create', threadController.thread_create_get);
router.post('/create', threadController.thread_create_post);
//router.get('/id/:id', threadController.thread_id_get);
//router.get('/id/:id', threadController.thread_id_delete);

module.exports = router;