const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

class ReviewsRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('reviews')
  }

  //리뷰 아이디 존재 검사
  async checkReviewIdExist(reviewId) {
    const review = await this.collection.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
    })
    return review !== null
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
    console.log(review)
    return review
  }
}

module.exports = new ReviewsRepo()
