const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ReviewController = require('../controllers/Review_Controller')
const CommentController = require('../controllers/Comment_Controller')

const fakeAuth = (req, res, next) => {
  req.user = { id: '6688390aa9bc9999444e1bb0' }
  next()
}

//로그인 (참고용)
// router.post('/login', wrapAsync(AuthController.login))
// router.post('/signUp', wrapAsync(AuthController.signUp))

router.put(
  '/edit/:reviewId',
  fakeAuth,
  wrapAsync(ReviewController.updateMyReview),
) //기록 내용 수정하기

router.delete('/delete/:reviewId', wrapAsync(ReviewController.deleteMyReview)) //기록 삭제하기

router.get('/community/:date', wrapAsync(ReviewController.getReviewsByDate)) //날짜별 커뮤니티 내용 불러오기

router.get(
  '/userProfile/:userId',
  fakeAuth,
  wrapAsync(ReviewController.getUserProfile),
) //다른 유저 프로필
router.get('/myProfile', fakeAuth, wrapAsync(ReviewController.getMyProfile)) //내 프로필 확인하기

//메인화면 정보 가져오기
router.get('/getMainInfo', fakeAuth, wrapAsync(ReviewController.getMainInfo))
router.post('/createReview', fakeAuth, wrapAsync(ReviewController.createReview))
router.get(
  '/getMyReview/:reviewId',
  fakeAuth,
  wrapAsync(ReviewController.getMyReview),
)

router.get('/liked', fakeAuth, wrapAsync(ReviewController.getMyLikedList)) //내 좋아요 목록 불러오기

module.exports = router
