const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authMiddleware');
const { 
  taskInsert, 
  gettasks, 
  createTaskTopic, 
  getTopicsName 
} = require('../operations /controllers/taskController');

router.post('/insertTask', taskInsert);
router.get('/gettasks', authenticateToken, gettasks);
router.post('/createTaskTopic', createTaskTopic);
router.get('/getTopicsName', authenticateToken, getTopicsName);

module.exports = router;