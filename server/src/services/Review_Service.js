const UsersRepo = require('../repositories/Users_Repo')
const ReviewsRepo = require('../repositories/Reviews_Repo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')
const moment = require('moment-timezone')
const { deleteReview } = require('../controllers/Review_Controller')
const moment = require('moment-timezone')
const { ObjectId } = require('bson')

class ReviewService {
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

  async deleteMyReview(reviewId) {
    try {
      const result = await ReviewsRepo.deleteMyReview(reviewId)
      if (!result) {
        throw new Error('해당 기록을 찾을 수 없습니다.')
      }
      return result
    } catch (error) {
      throw error
    }
  }
  // 헬퍼 함수
  // 유저 아이디 존재 검사
  async checkUserIdExist(userId) {
    const user = await UsersRepo.checkUserIdExist(userId)
    return user
  }

  //리뷰 아이디 존재 검사
  async checkReviewIdExist(reviewId) {
    const review = await ReviewsRepo.checkReviewIdExist(reviewId)
    return review
  }

  //리뷰 소유권 확인
  async checkReviewOwnership(userId, reviewId) {
    const ownership = await ReviewsRepo.checkReviewOwnership(userId, reviewId)
    return ownership
  }

  // 날짜 배열 생성
  createDateArray(startDate, endDate) {
    const dateArray = []
    let currentDate = moment(startDate)
    while (currentDate.isSameOrBefore(endDate)) {
      dateArray.push(currentDate.format('YYYY-MM-DD'))
      currentDate.add(1, 'days')
    }
    return dateArray
  }

  // 실제 함수
  // 메인 정보 가져오기
  async getMainInfo(userId) {
    const user = await this.checkUserIdExist(userId)
    if (!user) {
      throw new Error('No user found')
    }

    const reviews = await ReviewsRepo.getMyReviews(userId)
    const userData = await UsersRepo.getUserData(userId)

    // 유저 리뷰들의 createdAt을 기준으로 출석체크
    const writeDates = new Set(
      reviews.map((review) => {
        const date = moment(review.createdAt)
          .tz('Asia/Seoul')
          .format('YYYY-MM-DD')
        return date
      }),
    )

    // 챌린지 시작 날짜를 startDate로 설정 (임시로 2024-07-07로 설정)
    const startDate = '2024-07-07'
    // 오늘 날짜를 endDate로 설정
    const endDate = moment().tz('Asia/Seoul').format('YYYY-MM-DD')

    // 시작일부터 오늘까지의 날짜 배열 생성
    const dateArray = this.createDateArray(startDate, endDate)

    // 각 날짜가 writeDates에 포함되는지 확인하여 배열 생성
    const dailyStatus = dateArray.map((date) => (writeDates.has(date) ? 1 : 0))

    const result = {
      reviews: reviews,
      userData: userData,
      dailyStatus: dailyStatus,
    }

    return result
  }

  // 리뷰 생성
  async createReview(userId, title, content, startPage, endPage) {
    const user = await this.checkUserIdExist(userId)
    if (!user) {
      throw new Error('No user found')
    }

    if (startPage > endPage) {
      throw new Error('Invalid page range')
    }

    const reviewData = {
      userId: new ObjectId(userId),
      title: title,
      content: content,
      startPage: startPage,
      endPage: endPage,
      createdAt: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      likedBy: [],
    }

    const result = await ReviewsRepo.createReview(reviewData)
    return result
  }

  // 내 리뷰 가져오기
  async getMyReview(userId, reviewId) {
    const user = await this.checkUserIdExist(userId)
    const review = await this.checkReviewIdExist(reviewId)
    const ownership = await this.checkReviewOwnership(userId, reviewId)

    if (!user) {
      throw new Error('No user found')
    }

    if (!review) {
      throw new Error('No review found')
    }

    if (!ownership) {
      throw new Error('Not your review')
    }
    console.log('reviewId:', reviewId)

    const result = await ReviewsRepo.getMyReview(reviewId)
    return result
  }
}

module.exports = new ReviewService()
