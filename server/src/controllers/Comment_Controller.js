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
  // 댓글 생성
  async createComment(req, res) {
    const reviewId = req.params.reviewId
    const userId = req.user.id
    let content = req.body.content
    console.log(content)
    if (!userId || !isObjectId(userId)) {
      res.status(400).json({ message: '유효하지 않은 아이디 입니다.' })
      return
    }

    if (typeof content === 'string') {
      try {
        const parsedContent = JSON.parse(content)
        content = parsedContent.content || parsedContent
      } catch (e) {
        // 파싱에 실패하면 원래 문자열 사용
        console.error('Failed to parse content:', e)
      }
    } else if (typeof content === 'object' && content.content) {
      // content가 객체이고 내부에 content 필드가 있으면 그 값을 사용
      content = content.content
    }
    console.log('Content to be saved:', content)
    try {
      const result = await CommentService.createComment(
        reviewId,
        userId,
        content,
      )
      res.status(200).json(result)
    } catch (err) {
      const { status, message } = errorHandler(err, 'createComment', {
        'Invalid Comment': () => ({
          status: 400,
          message: '댓글 작성에 실패하였습니다.',
        }),
      })
      res.status(status).json({ message })
    }
  }
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
