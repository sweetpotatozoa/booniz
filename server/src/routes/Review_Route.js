const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ReviewController = require('../controllers/Review_Controller')
const CommentController = require('../controllers/Comment_Controller')
const Auth = require('../middleware/auth')
// const fakeAuth = (req, res, next) => {
//   req.user = { id: '6688390aa9bc9999444e1bb0' }
//   next()
// }

//로그인 (참고용)
// router.post('/login', wrapAsync(AuthController.login))
// router.post('/signUp', wrapAsync(AuthController.signUp))

router.put('/edit/:reviewId', Auth, wrapAsync(ReviewController.updateMyReview)) //기록 내용 수정하기

router.delete('/delete/:reviewId', wrapAsync(ReviewController.deleteMyReview)) //기록 삭제하기

router.get(
  '/community/:date',
  Auth,
  wrapAsync(ReviewController.getReviewsByDate),
) //날짜별 커뮤니티 내용 불러오기

router.get(
  '/userProfile/:userId',
  Auth,
  wrapAsync(ReviewController.getUserProfile),
) //다른 유저 프로필
router.get('/myProfile', Auth, wrapAsync(ReviewController.getMyProfile)) //내 프로필 확인하기

//메인화면 정보 가져오기
router.get('/getMainInfo', Auth, wrapAsync(ReviewController.getMainInfo))
router.post('/createReview', Auth, wrapAsync(ReviewController.createReview))
router.get(
  '/getMyReview/:reviewId',
  Auth,
  wrapAsync(ReviewController.getMyReview),
)

router.get('/liked', Auth, wrapAsync(ReviewController.getMyLikedList)) //내 좋아요 목록 불러오기
router.post('/like/:reviewId', Auth, ReviewController.likeReview) //좋아요 누르기

module.exports = router
