const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ReviewController = require('../controllers/Review_Controller')

//로그인 (참고용)
// router.post('/login', wrapAsync(AuthController.login))
// router.post('/signUp', wrapAsync(AuthController.signUp))
// router.put('/api/edit/:reviewId', wrapAsync(ReviewController.edit)) //기록 내용 수정하기
router.delete('/delete/:reviewId', wrapAsync(ReviewController.deleteMyReview)) //기록 삭제하기
// router.get('/community/:date', wrapAsync(ReviewController.community)) //날짜별 커뮤니티 내용 불러오기
// router.get('userProfile/:userId', wrapAsync(ReviewController.userProfile)) //다른 유저 프로필
// router.get('/myProfile', wrapAsync(ReviewController.myProfile)) //내 프로필 확인하기

module.exports = router
