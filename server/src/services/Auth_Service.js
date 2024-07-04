const UsersRepo = require('../repositories/Users_Repo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')

class AuthService {
  //헬퍼 함수
  //유저 아이디 존재 검사, 비밀번호 뱉기
  async getUserInfo(userName) {
    const user = await UsersRepo.getUserInfo(userName)
    if (!user) {
      throw new Error('No user found')
    }
    return user
  }

  //비밀번호 일치 검사
  async validatePassword(input, hash) {
    return bcrypt.compareSync(input, hash)
  }

  //토큰 부여
  async getToken(userId) {
    const tokenPayload = { user: { id: userId } }
    const token = jwt.sign(tokenPayload, configs.accessTokenSecret)
    return token
  }

  //실제 함수
  // 로그인 하기
  async login(userName, password) {
    const result = await this.getUserInfo(userName) // 유저 정보 가져오기
    const isValid = await this.validatePassword(password, result.password) // 비밀번호 일치 검사
    if (isValid) {
      const tokenResult = await this.getToken(result._id) // 토큰 부여
      console.log('로그인 성공', tokenResult)
      return { token: tokenResult }
    } else {
      throw new Error('Invalid password')
    }
  }

  //회원가입 하기
  async signUp(userName, password, job, career) {
    const user = await UsersRepo.getUserInfo(userName)
    if (user) {
      throw new Error('User already exists')
    }
    const hash = bcrypt.hashSync(password, 10)
    const uesrData = {
      userName: userName,
      password: hash,
      job: job,
      career: career,
      lastRead: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
    }
    const result = await UsersRepo.createUser(uesrData)
    return { message: 'User created', result }
  }
}

module.exports = new AuthService()
