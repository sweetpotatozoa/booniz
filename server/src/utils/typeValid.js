// utils.js
const mongoose = require('mongoose')

// objectId인지 확인하는 함수
const isObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

// 정수인지 확인하는 함수
const isInteger = (value) => {
  if (typeof value === 'number') {
    return Number.isInteger(value)
  }
  if (typeof value === 'string') {
    const parsedValue = parseInt(value, 10)
    return !isNaN(parsedValue) && parsedValue.toString() === value
  }
  return false
}

// string인지 확인하는 함수
const isString = (value) => {
  return typeof value === 'string'
}

// 이메일 형식인지 확인하는 함수
const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return isString(value) && emailRegex.test(value)
}

// 비밀번호 규칙 확인하는 함수 (영어와 숫자를 포함하여 최소 8자 이상)
const isValidPassword = (value) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return isString(value) && passwordRegex.test(value)
}

module.exports = { isObjectId, isInteger, isString, isEmail, isValidPassword }
