const UsersRepo = require('../repositories/Users_Repo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')
const moment = require('moment-timezone')

class AuthService {
  //헬퍼 함수
  //유저 아이디 존재 검사, 비밀번호 뱉기
  async getUserInfo(userName) {
    const user = await UsersRepo.getUserInfo(userName)
    console.log(user)
    if (!user) {
      throw new Error('No user found - login')
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
      return { token: tokenResult }
    } else {
      throw new Error('Invalid password')
    }
  }

  //회원가입 하기
  async register(userName, password, realName, phoneNumber, age, nickName) {
    const user = await UsersRepo.getUserInfo(userName)
    const doesNickNameExist = await UsersRepo.getNickName(nickName)

    if (user) {
      throw new Error('User already exists')
    } else if (doesNickNameExist) {
      throw new Error('NickName already exists')
    }
    const hash = bcrypt.hashSync(password, 10)
    const uesrData = {
      userName: userName,
      password: hash,
      nickName: nickName,
      phoneNumber: phoneNumber,
      age: age,
      realName: realName,
      createdAt: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      allPages: 409, // 책의 총 페이지 수
    }
    try {
      const result = await UsersRepo.createUser(uesrData)
      // 특정 예외 처리: 특정 예외를 포착하고 처리
      if (!result.acknowledged) {
        throw new Error('User registration failed')
      }
    } catch (error) {
      // 일반 예외 처리: 그 외의 모든 예외를 포착하고 처리
      throw new Error(`User registration failed: ${error.message}`)
    }
  }
}

module.exports = new AuthService()
