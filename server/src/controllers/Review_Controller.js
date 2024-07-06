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
}

module.exports = new AuthController()
