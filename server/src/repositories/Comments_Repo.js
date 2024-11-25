const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

class CommentsRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('comments')
  }

  // //헬퍼 함수
  async checkCommentIdExist(commentId) {
    if (!ObjectId.isValid(commentId)) {
      return false
    }

    const review = await this.collection.findOne({
      _id: new ObjectId(commentId),
    })
    return review !== null
  }

  // 댓글 생성
  async createComment(commentData) {
    const result = await this.collection.insertOne(commentData)
    if (result.acknowledged) {
      return {
        ...commentData,
        _id: result.insertedId,
      }
    } else {
      throw new Error('댓글 생성에 실패했습니다.')
    }
  }

  // 내 댓글 삭제하기
  async deleteMyComment(commentId) {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(commentId),
      })
      return result !== null
    } catch (error) {
      throw error
    }
  }

  // 리뷰 별로 달린 댓글 불러오기
  async getCommentsByReviewIds(reviewIds) {
    try {
      const result = await this.collection
        .find({ reviewId: { $in: reviewIds } })
        .project({ reviewId: 1, content: 1, createdAt: 1, userId: 1 })
        .sort({ createdAt: 1 })
        .toArray()
      return result
    } catch (error) {
      throw error
    }
  }
}
module.exports = new CommentsRepo()
