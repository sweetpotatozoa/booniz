const UsersRepo = require('../repositories/Users_Repo')
const ReviewsRepo = require('../repositories/Reviews_Repo')
const CommentsRepo = require('../repositories/Comments_Repo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')
const moment = require('moment-timezone')
const { ObjectId } = require('bson')

class CommentService {
  // //헬퍼 함수
  // //유저 아이디 존재 검사, 비밀번호 뱉기
  // async getUserInfo(userName) {
  //   const user = await UsersRepo.getUserInfo(userName)
  //   if (!user) {
  //     throw new Error('No user found - login')
  //   }
  //   return user
  // }

  // //비밀번호 일치 검사
  // async validatePassword(input, hash) {
  //   return bcrypt.compareSync(input, hash)
  // }

  // //토큰 부여
  // async getToken(userId) {
  //   const tokenPayload = { user: { id: userId } }
  //   const token = jwt.sign(tokenPayload, configs.accessTokenSecret)
  //   return token
  // }

  // //실제 함수
  // // 로그인 하기
  // async login(userName, password) {
  //   const result = await this.getUserInfo(userName) // 유저 정보 가져오기
  //   const isValid = await this.validatePassword(password, result.password) // 비밀번호 일치 검사
  //   if (isValid) {
  //     const tokenResult = await this.getToken(result._id) // 토큰 부여
  //     console.log('로그인 성공', tokenResult)
  //     return { token: tokenResult }
  //   } else {
  //     throw new Error('Invalid password')
  //   }
  // }

  // 헬퍼 함수
  // 댓글 작성하기
  async createComment(reviewId, userId, content) {
    try {
      const user = await UsersRepo.getUserById(userId)
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.')
      }

      // content 처리
      let processedContent = content
      if (typeof content === 'object' && content !== null) {
        processedContent = JSON.stringify(content)
      }

      if (typeof processedContent === 'string') {
        // 이스케이프된 따옴표를 일반 따옴표로 변경
        processedContent = processedContent.replace(/\\"/g, '"')

        // 문자열 시작과 끝의 불필요한 따옴표 제거 (이중 따옴표 방지)
        processedContent = processedContent.replace(/^"|"$/g, '')
      }

      const commentData = {
        reviewId: new ObjectId(reviewId),
        userId: new ObjectId(userId),
        nickName: user.nickName,
        content: processedContent,
        createdAt: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      }

      const result = await CommentsRepo.createComment(commentData)
      return result
    } catch (error) {
      throw error
    }
  }
  // 내 댓글 삭제하기
  async deleteMyComment(commentId) {
    const comment = await CommentsRepo.checkCommentIdExist(commentId)

    if (!comment) {
      throw new Error('No review found')
    }
    try {
      const result = await CommentsRepo.deleteMyComment(commentId)
      if (!result) {
        throw new Error('해당 기록을 찾을 수 없습니다.')
      }
      return result
    } catch (error) {
      throw error
    }
  }
}

module.exports = new CommentService()
