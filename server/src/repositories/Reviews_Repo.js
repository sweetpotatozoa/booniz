const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

class ReviewsRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('reviews')
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
}

module.exports = new ReviewsRepo()
