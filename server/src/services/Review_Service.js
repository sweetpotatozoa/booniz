const UsersRepo = require('../repositories/Users_Repo')
const ReviewsRepo = require('../repositories/Reviews_Repo')
const CommentsRepo = require('../repositories/Comments_Repo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')
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
    try {
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
      const startDate = '2024-07-19'
      // 오늘 날짜를 endDate로 설정
      const endDate = moment().tz('Asia/Seoul').format('YYYY-MM-DD')

      // 시작일부터 오늘까지의 날짜 배열 생성
      const dateArray = this.createDateArray(startDate, endDate)

      // 각 날짜가 writeDates에 포함되는지 확인하여 배열 생성
      const dailyStatus = dateArray.map((date) =>
        writeDates.has(date) ? 1 : 0,
      )
      const latestEndPage = await ReviewsRepo.getLatestReviewEndPage(userId)

      const updatedUserData = {
        ...userData,
        readPages: latestEndPage,
      }
      const result = {
        reviews: reviews,
        userData: updatedUserData,
        dailyStatus: dailyStatus,
      }

      return result
    } catch (error) {
      throw error
    }
  }

  // 리뷰 생성
  async createReview(userId, title, content, startPage, endPage) {
    try {
      const user = await this.checkUserIdExist(userId)
      if (!user) {
        throw new Error('No user found')
      }

      if (startPage > endPage) {
        throw new Error('Invalid page range')
      }

      const todayReviewCount = await ReviewsRepo.getTodayReviewCount(userId)
      // if (todayReviewCount >= 1) {
      //   throw new Error('하루에 1개의 글만 작성하실 수 있습니다.')
      // }

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
    } catch (error) {
      throw error
    }
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

    const result = await ReviewsRepo.getMyReview(reviewId)
    return result
  }

  // 내 리뷰 삭제하기
  async deleteMyReview(reviewId) {
    const review = await ReviewsRepo.checkReviewIdExist(reviewId)

    if (!review) {
      throw new Error('No review found')
    }
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

  //날짜별 커뮤니티 조회
  async getReviewsByDate(date, userId) {
    //커뮤니티
    try {
      const startOfDay = moment(date)
        .tz('Asia/Seoul')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endOfDay = moment(date)
        .tz('Asia/Seoul')
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const reviews = await ReviewsRepo.getReviewsBetweenDates(
        startOfDay,
        endOfDay,
      )
      const reviewIds = reviews.map((review) => review._id)
      const comments = await CommentsRepo.getCommentsByReviewIds(reviewIds)

      const reviewUserIds = reviews.map((review) => review.userId.toString())
      const commentUserIds = comments.map((comment) =>
        comment.userId.toString(),
      )

      const allUserIds = [...new Set([...reviewUserIds, ...commentUserIds])]

      const users = await UsersRepo.getUsersByIds(allUserIds)
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})

      const reviewsWithComments = reviews.map((review) => {
        const reviewComments = comments
          .filter(
            (comment) => comment.reviewId.toString() === review._id.toString(),
          )
          .map((comment) => ({
            ...comment,
            nickName: userMap[comment.userId.toString()]?.nickName,
            userId: comment.userId,
          }))

        const user = userMap[review.userId.toString()]
        return {
          ...review,
          nickName: user.nickName,
          comments: reviewComments,
          isLiked: review.likedBy.some((id) => id.toString() === userId),
          likeCount: review.likedBy.length,
          userId: review.userId,
        }
      })

      return {
        reviews: reviewsWithComments,
        userId: new ObjectId(userId),
      }
    } catch (error) {
      throw error
    }
  }

  //다른 유저 프로필 조회
  async getUserProfile(userId) {
    try {
      const user = await UsersRepo.getUserData(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const reviews = await ReviewsRepo.getReviewsByUserId(userId)
      const reviewIds = reviews.map((review) => review._id)
      const allComments = await CommentsRepo.getCommentsByReviewIds(reviewIds)
      const commentUserIds = [
        ...new Set(allComments.map((comment) => comment.userId.toString())),
      ]
      const commentUsers = await UsersRepo.getUsersByIds(commentUserIds)
      const latestEndPage = await ReviewsRepo.getLatestReviewEndPage(userId)

      const userMap = commentUsers.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})

      const reviewsWithComments = reviews.map((review) => {
        const reviewComments = allComments
          .filter(
            (comment) => comment.reviewId.toString() === review._id.toString(),
          )
          .map((comment) => ({
            ...comment,
            nickName:
              userMap[comment.userId.toString()]?.nickName || 'Unknown User',
            userId: comment.userId,
          }))
        return {
          ...review,
          comments: reviewComments,
          userId: review.userId,
        }
      })
      const streak = await this.calculateStreak(userId)

      return {
        userId: new ObjectId(userId),
        nickName: user.nickName,
        completionRate: (latestEndPage / user.allPages) * 100,
        reviews: reviewsWithComments,
        readPages: latestEndPage,
        streak: streak,
      }
    } catch (error) {
      throw error
    }
  }

  //내 프로필 조회
  async getMyProfile(userId) {
    try {
      const user = await UsersRepo.getUserData(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const reviews = await ReviewsRepo.getReviewsByUserId(userId)
      const reviewIds = reviews.map((review) => review._id)
      const allComments = await CommentsRepo.getCommentsByReviewIds(reviewIds)
      const latestEndPage = await ReviewsRepo.getLatestReviewEndPage(userId)
      const commentUserIds = [
        ...new Set(allComments.map((comment) => comment.userId.toString())),
      ]
      const commentUsers = await UsersRepo.getUsersByIds(commentUserIds)

      const userMap = commentUsers.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})

      const reviewsWithComments = reviews.map((review) => {
        const reviewComments = allComments
          .filter(
            (comment) => comment.reviewId.toString() === review._id.toString(),
          )
          .map((comment) => ({
            ...comment,
            nickName:
              userMap[comment.userId.toString()]?.nickName || 'Unknown User',
            userId: comment.userId,
          }))
        return {
          ...review,
          comments: reviewComments,
          userId: review.userId,
        }
      })

      const streak = await this.calculateStreak(userId)

      return {
        userId: new ObjectId(userId),
        nickName: user.nickName,
        completionRate: (latestEndPage / user.allPages) * 100,
        reviews: reviewsWithComments,
        readPages: latestEndPage,
        streak: streak,
      }
    } catch (error) {
      throw error
    }
  }

  //내 리뷰 수정하기
  async updateMyReview(reviewId, userId, updateData) {
    try {
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

      const updatedReview = await ReviewsRepo.updateMyReview(
        reviewId,
        updateData,
      )
      return updatedReview
    } catch (error) {
      throw error
    }
  }

  //내 좋아요 목록 조회하기
  async getMyLikedList(userId) {
    try {
      const reviews = await ReviewsRepo.getLikedReviewsByUserId(userId)
      const reviewIds = reviews.map((review) => review._id)
      const comments = await CommentsRepo.getCommentsByReviewIds(reviewIds)
      const userIds = [...new Set(reviews.map((review) => review.userId))]
      const users = await UsersRepo.getUsersByIds(userIds)
      const currentUser = await UsersRepo.getUserById(userId)
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = {
          nickName: user.nickName,
          userId: user._id.toString(),
        }
        return acc
      }, {})

      const result = reviews.map((review) => {
        const reviewComments = comments.filter(
          (comment) => comment.reviewId.toString() === review._id.toString(),
        )
        const author = userMap[review.userId.toString()] || {
          nickName: 'Unknown',
          userId: 'Unknown',
        }
        return {
          _id: review._id,
          title: review.title,
          content: review.content,
          likedBy: review.likedBy,
          comments: reviewComments.map((comment) => comment._id),
          updatedAt: moment(review.updatedAt).format('YYYY.MM.DD'),
          authorNickName: author.nickName,
          authorUserId: author.userId,
        }
      })
      const sortedResult = result.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      )

      const response = {
        nickName: currentUser ? currentUser.nickName : 'Unknown',
        likedReviews: sortedResult,
      }
      return response
    } catch (error) {
      throw error
    }
  }

  //좋아요 누르기
  async toggleLike(reviewId, userId) {
    try {
      const review = await ReviewsRepo.getReviewById(reviewId)
      let updatedReview
      let message
      if (review.likedBy.some((id) => id.toString() === userId)) {
        updatedReview = await ReviewsRepo.removeLikeFromReview(reviewId, userId)
        message = '좋아요 취소'
      } else {
        updatedReview = await ReviewsRepo.addLikeToReview(reviewId, userId)
        message = '좋아요 +1'
      }

      return {
        message,
        review: updatedReview,
      }
    } catch (error) {
      throw error
    }
  }

  //연속기록
  async calculateStreak(userId) {
    try {
      const reviews = await ReviewsRepo.getReviewsByUserId(userId)

      // 서울 시간대 기준으로 날짜 변환
      const reviewDatesSet = new Set(
        reviews.map((review) =>
          moment(review.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD'),
        ),
      )

      const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD')
      const hasReviewToday = reviewDatesSet.has(today)

      let streak = 0

      // 오늘부터 과거로 31일 동안 확인
      for (let i = 0; i < 31; i++) {
        const date = moment()
          .tz('Asia/Seoul')
          .subtract(i, 'days')
          .format('YYYY-MM-DD')
        if (reviewDatesSet.has(date)) {
          streak++
        } else if (i > 0) {
          // 첫 번째 누락된 날(오늘 제외)에서 중단
          break
        }
      }

      // 오늘 글을 썼다면 최소 1, 아니면 0 반환
      return hasReviewToday ? Math.max(1, streak) : 0
    } catch (error) {
      return 0
    }
  }
}

module.exports = new ReviewService()
