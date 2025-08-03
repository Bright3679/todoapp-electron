const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authentication');
const { 
  taskInsert, 
  gettasks, 
  createTaskTopic, 
  getTopicsName, 
  toggleTaskComplete,
  updateTask,
  updateRemark,
  deleteTask,
  clearCompletedTasks
} = require('../operations /controllers/taskController');
const Topic = require('../../models/model')

router.post('/insertTask', taskInsert);
// router.get('/', authenticateToken, gettasks);
router.get('/', authenticateToken, (req, res, next) => {
  console.log('GET /api/tasks received');
  next();
},gettasks);
router.post('/createTaskTopic', createTaskTopic);
router.get('/getTopicsName', authenticateToken, getTopicsName);

router.patch('/toggle/:id', toggleTaskComplete);
router.put('/updatetask/:id', updateTask);
router.patch('/updateremark/:id',updateRemark);
router.delete('/delete/:id',deleteTask);
router.delete('/cleartask',clearCompletedTasks);

module.exports = router;
