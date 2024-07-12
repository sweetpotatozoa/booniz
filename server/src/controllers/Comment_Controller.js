const CommentService = require('../services/Comment_Service')
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
  // 로그인
  async login(req, res) {
    const { userName, password } = req.body
    if (!userName || !password) {
      res.status(400).json({ message: '잘못된 이메일 혹은 비밀번호 입니다.' })
      return
    }
    try {
      const result = await AuthService.login(userName, password)
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'login', {
        'Invalid password': () => ({
          status: 403,
          message: '잘못된 이메일 혹은 비밀번호 입니다.',
        }),
      })
      res.status(status).json({ message })
    }
  }
}

module.exports = new CommentController()
