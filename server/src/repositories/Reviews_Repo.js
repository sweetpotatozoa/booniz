const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')
const moment = require('moment-timezone')

class ReviewsRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('reviews')
  }

  // 유저 아이디 존재 검사
  // async checkUserIdExist(userId) {
  //   const user = await this.collection.findOne({
  //     _id: new mongoose.Types.ObjectId(userId),
  //   })
  //   return user !== null
  // }

  // // 유저 비밀번호 가져오기
  // async getUserInfo(userName) {
  //   const user = await this.collection.findOne(
  //     { userName: userName },
  //     { projection: { password: 1, _id: 1 } }, // 비밀번호, _id만 가져오기
  //   )
  //   return user
  // }

  // // 닉네임 중복 검사
  // async getNickName(nickName) {
  //   const user = await this.collection.findOne({ nickName: nickName })
  //   return user !== null
  // }

  // // 실제함수

  // // 유저 생성
  // async createUser(user) {
  //   const result = await this.collection.insertOne(user)
  //   return result
  // }

  async checkReviewIdExist(reviewId) {
    if (!ObjectId.isValid(reviewId)) {
      return false
    }

    const review = await this.collection.findOne({
      _id: new ObjectId(reviewId),
    })
    return review !== null
  }

  // 내 리뷰 삭제하기
  async deleteMyReview(reviewId) {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(reviewId),
      })
      return
    } catch (error) {
      throw error
    }
  }

  //당일 리뷰 갯수 계산하기
  async getTodayReviewCount(userId) {
    try {
      const today = moment().tz('Asia/Seoul').startOf('day').toDate()
      const count = await this.collection.countDocuments({
        userId: new ObjectId(userId),
        createdAt: { $gte: today },
      })
      return count
    } catch (error) {
      throw error
    }
  }

  //내가 쓴 일지 가져오기
  async getMyReviews(userId) {
    const reviews = await this.collection
      .find(
        { userId: new ObjectId(userId) },
        { projection: { _id: 1, title: 1, content: 1, createdAt: 1 } },
      )
      .sort({ createdAt: 1 })
      .toArray()
    return reviews
  }

  //리뷰 생성
  async createReview(review) {
    const result = await this.collection.insertOne(review)
    return result
  }

  //리뷰 소유권 확인
  async checkReviewOwnership(userId, reviewId) {
    const ownership = await this.collection.findOne({
      _id: new ObjectId(reviewId),
      userId: new ObjectId(userId),
    })
    return ownership !== null
  }

  //내 리뷰 가져오기
  async getMyReview(reviewId) {
    const review = await this.collection.findOne(
      {
        _id: new ObjectId(reviewId),
      },
      { projection: { title: 1, content: 1, startPage: 1, endPage: 1 } },
    )
    return review
  }

  async getReviewsBetweenDates(startOfDay, endOfDay) {
    try {
      const result = await this.collection
        .find({
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        })
        .sort({ createdAt: -1 })
        .toArray()
      return result
    } catch (error) {
      throw error
    }
  }

  async findByDateRange(startDate, endDate) {
    return await this.collection
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .toArray()
  }

  //유저별
  async getReviewsByUserId(userId) {
    try {
      const result = await this.collection
        .find({ userId: new ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray()
      return result
    } catch (error) {
      throw error
    }
  }

  async getReviewsById(reviewId) {
    const result = await this.collection.find({
      _id: new ObjectId(reviewId),
    })
    return result
  }

  // 내 리뷰 수정하기
  async updateMyReview(reviewId, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: updateData },
    )
    return result
  }

  async getLikedReviewsByUserId(userId) {
    const result = await this.collection
      .find({ likedBy: userId })
      .sort({ updatedAt: -1 })
      .toArray()
    return result
  }

  //좋아요
  async addLikeToReview(reviewId, userId) {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $addToSet: { likedBy: new ObjectId(userId) } },
      { returnDocument: 'after' },
    )
    return result.value
  }

  async getReviewById(reviewId) {
    return await this.collection.findOne({ _id: new ObjectId(reviewId) })
  }
}
module.exports = new ReviewsRepo()
