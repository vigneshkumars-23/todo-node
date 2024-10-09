const express = require('express');
const router = express.Router();

const controller = require('../../controller/controller.js')

router.get('/auth/googleSignIn', controller.googleSignIn);
router.post('/user/updateTodos', controller.UserTodoUpdate);

module.exports = router;