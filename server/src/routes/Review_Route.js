const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ReviewController = require('../controllers/Review_Controller')

const fakeAuth = (req, res, next) => {
  req.user = { id: '6688390aa9bc9999444e1bb0' }
  next()
}

//메인화면 정보 가져오기
router.get('/getMainInfo', fakeAuth, wrapAsync(ReviewController.getMainInfo))

module.exports = router
