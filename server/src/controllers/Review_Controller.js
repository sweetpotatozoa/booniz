const ReviewService = require('../services/Review_Service')
const express = require('express')
const errorHandler = require('../utils/errorHandler')
const {
  isObjectId,
  isInteger,
  isString,
  isEmail,
  isValidPassword,
} = require('../utils/typeValid')

class ReviewController {
  // 로그인
  // async login(req, res) {
  //   const { userName, password } = req.body
  //   if (!userName || !password) {
  //     res.status(400).json({ message: '잘못된 이메일 혹은 비밀번호 입니다.' })
  //     return
  //   }
  //   try {
  //     const result = await AuthService.login(userName, password)
  //     res.status(200).json(result)
  //   } catch (err) {
  //     const { status, message } = errorHandler(err, 'login', {
  //       'Invalid password': () => ({
  //         status: 403,
  //         message: '잘못된 이메일 혹은 비밀번호 입니다.',
  //       }),
  //     })
  //     res.status(status).json({ message })
  //   }
  // }

  //추가적인 예외처리를 넣고 싶다면 아래와 같이 입력하세요.
  // } catch (err) {
  //   const { status, message } = errorHandler(err, 'anotherFunction', {
  //     'Specific error message': (err) => ({ status: 400, message: 'something wrong' })
  //   });
  //   res.status(status).json({ message });
  // }

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

  // 리뷰 생성
  async createReview(req, res) {
    const userId = req.user.id
    const { title, content, startPage, endPage } = req.body
    if (!userId || !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
      return
    }
    if (!isString(title) || !isString(content)) {
      res.status(400).json({ message: '제목과 내용은 문자열이어야 합니다.' })
      return
    }
    if (title.length > 50) {
      res.status(400).json({ message: '제목은 50자 이하여야 합니다.' })
      return
    }
    if (content.length < 100) {
      res.status(400).json({ message: '내용은 100자 이상이어야 합니다.' })
      return
    }
    if (!isInteger(startPage) || !isInteger(endPage)) {
      res
        .status(400)
        .json({ message: '시작 페이지와 끝 페이지는 숫자여야 합니다.' })
      return
    }
    try {
      const result = await ReviewService.createReview(
        userId,
        title,
        content,
        startPage,
        endPage,
      )
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'createReview', {
        'Invalid page range': () => ({
          status: 400,
          message: '시작 페이지는 끝 페이지 보다 더 클 수 없습니다.',
        }),
      })
      res.status(status).json({ message })
    }
  }
  // 내가 쓴 리뷰 가져오기
  async getMyReview(req, res) {
    const userId = req.user.id
    const reviewId = req.params.reviewId
    if (!userId || !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
      return
    }
    if (reviewId && !isObjectId(reviewId)) {
      res.status(400).json({ message: '유효하지 않은 리뷰 아이디 입니다.' })
      return
    }
    try {
      const result = await ReviewService.getMyReview(userId, reviewId)
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'getMyReview')
      res.status(status).json({ message })
    }
  }

  //내 리뷰 삭제하기
  async deleteMyReview(req, res) {
    const reviewId = req.params.reviewId
    if (reviewId && !isObjectId(reviewId)) {
      res.status(400).json({ message: '유효하지 않은 리뷰 아이디 입니다.' })
      return
    }
    try {
      const result = await ReviewService.deleteMyReview(reviewId)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ error: '기록 삭제 중 오류가 발생했습니다.' })
    }
  }

  //유저 프로필 조회하기
  async getUserProfile(req, res) {
    const userId = req.params.userId
    if (userId && !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 유저 아이디 입니다.' })
      return
    }
    try {
      const userProfile = await ReviewService.getUserProfile(userId)
      res.status(200).json(userProfile)
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Error fetching user profile', error: error.message })
    }
  }

  //내 프로필 조회
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id
      const profileData = await ReviewService.getMyProfile(userId)
      res.status(200).json(profileData)
    } catch (error) {
      res
        .status(400)
        .json({ message: '내 프로필 조회 중 오류가 발생했습니다.' })
    }
  }

  //날짜별 커뮤니티 조회
  async getReviewsByDate(req, res) {
    const date = req.params.date
    const userId = req.user.id
    try {
      const result = await ReviewService.getReviewsByDate(date, userId)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ message: '커뮤니티 조회 중 오류가 발생했습니다.' })
    }
  }

  //내 리뷰 수정하기
  async updateMyReview(req, res, next) {
    try {
      const reviewId = req.params.reviewId
      const userId = req.user.id
      if (!userId || !isObjectId(userId)) {
        res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
        return
      }
      if (reviewId && !isObjectId(reviewId)) {
        res.status(400).json({ message: '유효하지 않은 리뷰 아이디 입니다.' })
        return
      }
      const { title, content, startPage, endPage } = req.body

      const updatedReview = await ReviewService.updateMyReview(
        reviewId,
        userId,
        {
          title,
          content,
          startPage,
          endPage,
        },
      )

      res.status(200).json(updatedReview)
    } catch (error) {
      next(error)
    }
  }

  //내 좋아요 목록 조회하기
  async getMyLikedList(req, res) {
    try {
      const userId = req.user.id
      const likedReviews = await ReviewService.getMyLikedList(userId)
      res.status(200).json(likedReviews)
    } catch (error) {
      console.error('Error in getMyLikedList controller:', error)
      res.status(500).json({
        message: 'An error occurred while fetching liked list',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  }

  //좋아요 누르기
  async likeReview(req, res) {
    const reviewId = req.params.reviewId
    const userId = req.user.id

    try {
      const result = await ReviewService.likeReview(reviewId, userId)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error in likeReview controller:', error)
      res.status(500).json({
        message: 'An error occurred while liking the review',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  }
}

module.exports = new ReviewController()
