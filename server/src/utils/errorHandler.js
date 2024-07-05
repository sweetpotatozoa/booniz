const errorHandler = (
  err,
  functionName = 'unknown Function',
  customErrorHandlers = {},
) => {
  //커스텀 핸들러가 있는지 확인
  if (customErrorHandlers[err.message]) {
    return customErrorHandlers[err.message](err)
  }

  //커스텀 핸들러가 없으면 기본 핸들러로 처리
  switch (err.message) {
    case 'No user found':
      return { status: 404, message: 'No user found' }
    case 'User already exists':
      return { status: 400, message: '해당 이메일은 이미 가입되었습니다.' }
    default:
      console.error(`Error in ${functionName}`, err)
      return { status: 500, message: 'Internal server error' }
  }
}

module.exports = errorHandler
