const express = require('express')
const jwt = require('jsonwebtoken')

const AuthRouter = require('./Auth_Route') // 로그인 라우터
const ReviewRouter = require('./Review_Route') //서비스 관련 라우터
const CommentRouter = require('./Comment_Route') //댓글 관련 라우터
const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/review', ReviewRouter)
router.use('/comment', CommentRouter)

module.exports = router
