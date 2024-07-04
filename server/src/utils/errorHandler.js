const errorHandler = (
  err,
  functionName = 'unknown Function',
  customErrorHandlers = {},
) => {
  if (customErrorHandlers[err.message]) {
    return customErrorHandlers[err.message](req, err)
  } else if (err.message === 'No user found') {
    return { status: 404, message: 'No user found' }
  } else if (err.message === 'User already exists') {
    return { status: 400, message: 'User already exists' }
  } else if (err.message === 'No note found') {
    return { status: 404, message: 'No note found' }
  } else {
    console.error(`Error in ${functionName}`, err)
    return { status: 500, message: 'Internal server error' }
  }
}

module.exports = errorHandler
