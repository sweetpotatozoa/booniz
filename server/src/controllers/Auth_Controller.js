const AuthService = require('../services/Auth_Service')
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
  async register(req, res) {
    const {
      userName,
      password,
      realName,
      phoneNumber,
      age,
      nickName,
      inflowChannel,
    } = req.body

    if (
      !userName ||
      !password ||
      !nickName ||
      !age ||
      !phoneNumber ||
      !realName ||
      !inflowChannel
    ) {
      res.status(400).json({ message: '모든 필드를 채워주세요!' })
      return
    }

    if (!isEmail(userName)) {
      res.status(400).json({ message: '이메일 형식이 아닙니다.' })
      return
    }

    if (!isValidPassword(password)) {
      res.status(400).json({
        message: '비밀번호는 영어, 숫자 혼합 8자 이상이어야 합니다.',
      })
      return
    }

    try {
      await AuthService.register(
        userName,
        password,
        realName,
        phoneNumber,
        age,
        nickName,
        inflowChannel,
      )
      res
        .status(201)
        .json({ message: '회원가입에 성공하였습니다. 로그인해주세요.' })
    } catch (err) {
      const { status, message } = errorHandler(err, 'register')
      res.status(status).json({ message })
    }
  }
}

module.exports = new AuthController()
