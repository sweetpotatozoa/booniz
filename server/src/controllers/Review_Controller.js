const ReviewService = require('../services/Review_Service')
const errorHandler = require('../utils/errorHandler')
const {
  isObjectId,
  isInteger,
  isString,
  isEmail,
  isValidPassword,
} = require('../utils/typeValid')

//추가적인 예외처리를 넣고 싶다면 아래와 같이 입력하세요.
// } catch (err) {
//   const { status, message } = errorHandler(err, 'anotherFunction', {
//     'Specific error message': (err) => ({ status: 400, message: 'something wrong' })
//   });
//   res.status(status).json({ message });
// }

class AuthController {
  // 메인페이지 정보 가져오기
  async getMainInfo(req, res) {
    const userId = req.user.id
    if (!userId || !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
      return
    }
    try {
      const result = await ReviewService.getMainInfo(userId)
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'getMainInfo')
      res.status(status).json({ message })
    }
  }

  // 리뷰 생성
  async createReview(req, res) {
    const userId = req.user.id
    const { title, content, startPage, endPage } = req.body
    if (!userId || !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
      return
    }
    if (!isString(title) || !isString(content)) {
      res.status(400).json({ message: '제목과 내용은 문자열이어야 합니다.' })
      return
    }
    if (title.length > 50) {
      res.status(400).json({ message: '제목은 50자 이하여야 합니다.' })
      return
    }
    if (content.length < 100) {
      res.status(400).json({ message: '내용은 100자 이상이어야 합니다.' })
      return
    }
    if (!isInteger(startPage) || !isInteger(endPage)) {
      res
        .status(400)
        .json({ message: '시작 페이지와 끝 페이지는 숫자여야 합니다.' })
      return
    }
    try {
      const result = await ReviewService.createReview(
        userId,
        title,
        content,
        startPage,
        endPage,
      )
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'createReview', {
        'Invalid page range': () => ({
          status: 400,
          message: '시작 페이지는 끝 페이지 보다 더 클 수 없습니다.',
        }),
      })
      res.status(status).json({ message })
    }
  }
}

module.exports = new AuthController()
