const ReviewService = require('../services/Review_Service')
const errorHandler = require('../utils/errorHandler')
const {
  isObjectId,
  isInteger,
  isString,
  isEmail,
  isValidPassword,
} = require('../utils/typeValid')

class ReviewController {
  // 로그인
  // async login(req, res) {
  //   const { userName, password } = req.body
  //   if (!userName || !password) {
  //     res.status(400).json({ message: '잘못된 이메일 혹은 비밀번호 입니다.' })
  //     return
  //   }
  //   try {
  //     const result = await AuthService.login(userName, password)
  //     res.status(200).json(result)
  //   } catch (err) {
  //     const { status, message } = errorHandler(err, 'login', {
  //       'Invalid password': () => ({
  //         status: 403,
  //         message: '잘못된 이메일 혹은 비밀번호 입니다.',
  //       }),
  //     })
  //     res.status(status).json({ message })
  //   }
  // }

  async deleteMyReview(req, res) {
    const { reviewId } = req.params
    try {
      const result = await ReviewService.deleteMyReview(reviewId)
      res.status(200).json({ message: '기록이 성공적으로 삭제되었습니다.' })
    } catch (error) {
      res.status(500).json({ error: '기록 삭제 중 오류가 발생했스빈다.' })
    }
  }
}

module.exports = new ReviewController()
