const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

class CommentsRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('comments')
  }

  // //헬퍼 함수

  // 리뷰 별로 달린 댓글 불러오기
  async getCommentsByReviewIds(reviewIds) {
    try {
      const result = await this.collection
        .find({ reviewId: { $in: reviewIds } })
        .sort({ createdAt: -1 })
        .toArray()
      return result
    } catch (error) {
      throw error
    }
  }
}
module.exports = new CommentsRepo()
