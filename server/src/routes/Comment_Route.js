const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ReviewController = require('../controllers/Review_Controller')
const CommentController = require('../controllers/Comment_Controller')

const fakeAuth = (req, res, next) => {
  req.user = { id: '6688390aa9bc9999444e1bb0' }
  next()
}

// router.get('/liked'.fakeAuth, wrapAsync(ReviewController.getMyLikedList)) //내 좋아요 목록 불러오기
// router.post(
//   '/createComment',
//   fakeAuth,
//   wrapAsync(ReviewController.createComment),
// ) //댓글 작성하기
router.delete(
  '/delete/:commentId',
  wrapAsync(CommentController.deleteMyComment),
) //댓글 삭제하기

module.exports = router
