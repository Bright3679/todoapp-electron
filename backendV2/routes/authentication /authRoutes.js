const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getUserDetails, 
  ResetPassword 
} = require('../authentication /controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/getUserDetails', getUserDetails);
router.post('/resetPassword', ResetPassword);

module.exports = router;