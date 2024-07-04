const AuthService = require('../services/Auth_Service')
const errorHandler = require('../utils/errorHandler')
const { isObjectId, isInteger } = require('../utils/typeValid')

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
      res.status(400).json({ message: 'Invalid user id or password' })
      return
    }
    try {
      const result = await AuthService.login(userName, password)
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'login', {
        'Invalid password': (err) => ({
          status: 403,
          message: 'Invalid password',
        }),
      })
      res.status(status).json({ message })
    }
  }

  // 회원가입
  async signUp(req, res) {
    const { userName, password, job, career } = req.body

    if (!userName || !password || !job || !career) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    try {
      const result = await AuthService.signUp(userName, password, job, career)
      res.status(201).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'signUp')
      res.status(status).json({ message })
    }
  }
}

module.exports = new AuthController()
