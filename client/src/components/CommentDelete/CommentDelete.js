import React from 'react'

const CommentDelete = ({ reviewId, commentId, handleDeleteComment }) => {
  console.log(commentId)
  return (
    <button onClick={() => handleDeleteComment(reviewId, commentId)}>
      삭제하기
    </button>
  )
}

export default CommentDelete
