import React, { useState } from 'react'
import styles from './CommentForm.module.css'

const CommentForm = ({ reviewId, handleCommentSubmit }) => {
  const [commentContent, setCommentContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (commentContent.trim()) {
      handleCommentSubmit(reviewId, commentContent)
      setCommentContent('')
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} onClick={handleClick}>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder='댓글을 입력하세요'
      />
      <button type='submit'>댓글 달기</button>
    </form>
  )
}

export default CommentForm
