const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

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

  // 내 리뷰 삭제하기
  async deleteMyReview(reviewId) {
    try {
      const result = await this.collection.findByIdAndDelete(reviewId)
      return result // 그냥 return 비워놔도 되나?
    } catch (error) {
      throw error
    }
  }

  async getReviewsByDate(date) {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      return await this.collection
        .find({
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        })
        .sort({ updatedAt: -1 })
    } catch (error) {
      console.error('리뷰 레포지토리 오류:', error)
      throw error
    }
  }

  async getReviewsByUserId(userId) {
    try {
      return await Review.find({ userId }).sort({ updatedAt: -1 })
    } catch (error) {
      console.error('리뷰 레포지토리 오류:', error)
      throw error
    }
  }

  async getReviewsById(reviewId) {
    const result = await this.collection.findById(reviewId)
    return result
  }

  async updateMyReview(reviewId, updateData) {
    const result = await this.collection.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true },
    )
    return result
  }
}
module.exports = new ReviewsRepo()
