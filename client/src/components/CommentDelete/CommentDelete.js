import React from 'react'
import styles from './CommentDelete.module.css'

const CommentDelete = ({ reviewId, commentId, handleDeleteComment }) => {
  console.log(commentId)
  return (
    <button
      className={styles.button}
      onClick={() => handleDeleteComment(reviewId, commentId)}
    >
      삭제하기
    </button>
  )
}

export default CommentDelete
