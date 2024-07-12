const express = require('express')
const jwt = require('jsonwebtoken')

const AuthRouter = require('./Auth_Route') // 로그인 라우터
const ReviewRouter = require('./Review_Route') //서비스 관련 라우터
const CommentRouter = require('./Comment_Route')
const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/review', ReviewRouter)
router.use('/comment', CommentRouter)
// router.use('/comment', CommentRouter) -> 댓글 관련해서도 따로 만들어야 하나?
module.exports = router
