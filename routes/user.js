const express = require('express')

// controller functions
const { loginUser, signupUser, userdetails } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

//get user details - apply requireAuth middleware
router.get('/getuserdetails', requireAuth, userdetails)

module.exports = router