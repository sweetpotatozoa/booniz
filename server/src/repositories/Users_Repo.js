const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const { ObjectId } = require('bson')

class UsersRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('users')
  }

  // //헬퍼 함수

  // 유저 아이디 존재 검사
  async checkUserIdExist(userId) {
    const user = await this.collection.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    })
    return user !== null
  }

  // 유저 비밀번호 가져오기
  async getUserInfo(userName) {
    const user = await this.collection.findOne(
      { userName: userName },
      { projection: { password: 1, _id: 1 } }, // 비밀번호 필드만 가져오기
    )
    return user
  }

  // 유저 생성
  async createUser(user) {
    const result = await this.collection.insertOne(user)
    return result
  }

  // //실제 함수
  // 읽는데까지 남은 시간 가져오기
  async getNoteTime(userId) {
    const user = await this.collection.findOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { projection: { lastRead: 1, _id: 0 } }, // 마지막 읽은 시간 필드만 가져오기
    )
    return user.lastRead
  }

  // 유저 정보 가져오기
  async getWriterInfo(userId) {
    const userInfo = await this.collection.findOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { projection: { job: 1, career: 1, _id: 0 } },
    )
    return userInfo
  }

  // 읽은 시간 업데이트
  async updateLastRead(userId) {
    const result = await this.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { lastRead: new Date() } },
    )
    return result
  }
}

module.exports = new UsersRepo()
