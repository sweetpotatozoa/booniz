const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const AuthController = require('../controllers/Auth_Controller')

//로그인
router.post('/login', wrapAsync(AuthController.login))
router.post('/register', wrapAsync(AuthController.register))

module.exports = router
