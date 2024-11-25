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
      { projection: { password: 1, _id: 1 } }, // 비밀번호, _id만 가져오기
    )
    return user
  }

  // 닉네임 중복 검사
  async getNickName(nickName) {
    const user = await this.collection.findOne({ nickName: nickName })
    return user !== null
  }

  // 실제함수

  // 유저 생성
  async createUser(user) {
    const result = await this.collection.insertOne(user)
    return result
  }

  // 유저 정보 가져오기
  async getUserData(userId) {
    const user = await this.collection.findOne(
      { _id: new ObjectId(userId) },
      {
        projection: { _id: 0, nickName: 1, allPages: 1 },
      },
    )
    return user
  }

  //유저 아이디로 찾기
  async getUserById(userId) {
    try {
      const result = await this.collection.findOne({
        _id: new ObjectId(userId),
      })
      return result
    } catch (error) {
      throw error
    }
  }

  async getUsersByIds(userIds) {
    try {
      const objectIds = userIds.map((id) => new ObjectId(id))
      const result = await this.collection
        .find({ _id: { $in: objectIds } })
        .toArray()

      return result
    } catch (error) {
      throw error
    }
  }
}

module.exports = new UsersRepo()
