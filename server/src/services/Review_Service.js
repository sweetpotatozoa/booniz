const ReviewsRepo = require('../repositories/Reviews_Repo')
const UsersRepo = require('../repositories/Users_Repo')
const moment = require('moment-timezone')

class ReviewService {
  // 헬퍼 함수
  // 유저 아이디 존재 검사
  async checkUserIdExist(userId) {
    const user = await UsersRepo.checkUserIdExist(userId)
    return user
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
      userId: userId,
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
}

module.exports = new ReviewService()
