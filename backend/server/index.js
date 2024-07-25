const express = require('express');
let authentication = require('./routes/authentication');
let todoTasks = require('./routes/taskOperations')
const router = express.Router();
const authenticationCtrl = require('../middlewares/authenticationCtrl')

// Auth APIs
router.post('/login', authentication.login);
router.post('/register', authentication.register)
router.get('/getUserDetails', authenticationCtrl.authenticateToken, authentication.getUserDetails)
router.post('/resetPassword', authentication.ResetPassword)

//Task Operations
router.post('/insertTask', todoTasks.taskInsert)
router.get('/gettasks', authenticationCtrl.authenticateToken, todoTasks.gettasks)
router.post('/createTaskTopic', todoTasks.createTaskTopic)
router.get('/getTopicsName', authenticationCtrl.authenticateToken, todoTasks.getTopicsName)

module.exports = router;