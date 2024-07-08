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
    case 'No user found - login':
      return { status: 404, message: '잘못된 이메일 혹은 비밀번호 입니다.' }
    case 'User already exists':
      return { status: 400, message: '해당 이메일은 이미 가입되었습니다.' }
    case 'NickName already exists':
      return { status: 400, message: '해당 닉네임은 이미 가입되었습니다.' }
    case 'No user found':
      return { status: 403, message: '유효하지 않은 아이디 입니다.' }
    case 'No review found':
      return { status: 403, message: '해당 일지가 존재하지 않습니다.' }
    case 'Not your review':
      return { status: 403, message: '해당 일지에 대한 권한이 없습니다.' }
    default:
      console.error(`Error in ${functionName}`, err)
      return { status: 500, message: 'Internal server error' }
  }
}

module.exports = errorHandler
