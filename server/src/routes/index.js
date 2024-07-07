const express = require('express')
const jwt = require('jsonwebtoken')

const AuthRouter = require('./Auth_Route') // 로그인 라우터
const ReviewRouter = require('./Review_Route') // 리뷰 라우터

const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/review', ReviewRouter)

module.exports = router
