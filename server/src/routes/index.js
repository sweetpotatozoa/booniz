const express = require('express')
const jwt = require('jsonwebtoken')

const AuthRouter = require('./Auth_Route') // 로그인 라우터

const router = express.Router()

router.use('/auth', AuthRouter)

module.exports = router
