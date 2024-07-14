import React from 'react'
import moment from 'moment'
import truncateContent from '../../utils/truncateContent'
import CommentForm from '../../components/CommentForm/CommentForm'
import CommentDelete from '../../components/CommentDelete/CommentDelete'
import styles from './Review.module.css'

const Review = ({
  entry,
  dayDifference,
  handleEntryClick,
  handleEditClick,
  handleDeleteComment,
  handleCommentSubmit,
}) => {
  const reviewDate = moment(entry.createdAt)

  return (
    <div key={entry._id} className={styles.reviewEntry}>
      <div>{dayDifference}일차 독서기록</div>
      <div className={styles.startFromEnd}>
        {entry.startPage}p~{entry.endPage}p
      </div>
      <div onClick={() => handleEntryClick(entry._id)}>
        <div className={styles.reviewHeader}>
          <h3>{entry.title}</h3>
          <small>{reviewDate.format('YYYY-MM-DD')}</small>
          <button onClick={() => handleEditClick(entry._id)}>수정하기</button>
        </div>
        <p>
          {entry.expanded ? entry.content : truncateContent(entry.content, 150)}
        </p>
        <div>❤ {entry.likedBy.length}개</div>
        <div>□ {entry.comments.length}개</div>
      </div>
      {entry.expanded && (
        <div className={styles.commentsSection}>
          {entry.comments.map((comment) => (
            <div key={comment._id}>
              <p>{comment.content}</p>
              <small>
                {comment.userNickName} |{' '}
                {moment(comment.createdAt).format('YYYY-MM-DD')}
              </small>
              <CommentDelete
                reviewId={entry._id}
                commentId={comment._id}
                handleDeleteComment={handleDeleteComment}
              />
            </div>
          ))}
          <CommentForm
            reviewId={entry._id}
            handleCommentSubmit={handleCommentSubmit}
          />
        </div>
      )}
    </div>
  )
}

export default Review
