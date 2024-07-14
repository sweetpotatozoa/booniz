import React, { useState } from 'react'

const CommentForm = ({ reviewId, handleCommentSubmit }) => {
  const [commentContent, setCommentContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (commentContent.trim()) {
      handleCommentSubmit(reviewId, commentContent)
      setCommentContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder='댓글을 입력하세요'
      />
      <button type='submit'>댓글 달기</button>
    </form>
  )
}

export default CommentForm
