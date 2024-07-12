const CommentService = require('../services/Comment_Service')
const errorHandler = require('../utils/errorHandler')
const {
  isObjectId,
  isInteger,
  isString,
  isEmail,
  isValidPassword,
} = require('../utils/typeValid')

//추가적인 예외처리를 넣고 싶다면 아래와 같이 입력하세요.
// } catch (err) {
//   const { status, message } = errorHandler(err, 'anotherFunction', {
//     'Specific error message': (err) => ({ status: 400, message: 'something wrong' })
//   });
//   res.status(status).json({ message });
// }

class commentController {
  // 댓글 삭제하기
  async deleteMyComment(req, res) {
    const commentId = req.params.commentId
    if (commentId && !isObjectId(commentId)) {
      res.status(400).json({ message: '유효하지 않은 댓글 아이디 입니다.' })
      return
    }
    try {
      const result = await CommentService.deleteMyComment(commentId)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ error: '댓글 삭제 중 오류가 발생했습니다.' })
    }
  }
}

module.exports = new commentController()
