const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const CommentController = require('../controllers/Comment_Controller')

const fakeAuth = (req, res, next) => {
  req.user = { id: '6688390aa9bc9999444e1bb0' }
  next()
}

router.post(
  '/createComment/:reviewId',
  fakeAuth,
  wrapAsync(CommentController.createComment),
) //댓글 작성하기
router.delete(
  '/delete/:commentId',
  wrapAsync(CommentController.deleteMyComment),
) //댓글 삭제하기

module.exports = router
