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
  handleDeleteClick,
  handleDeleteComment,
  handleCommentSubmit,
  handleNicknameClick,
  showNickName = false,
}) => {
  const reviewDate = moment(entry.createdAt)
  //   console.log(entry.userId)

  return (
    <div key={entry._id} className={styles.reviewEntry}>
      {showNickName ? (
        <div>{dayDifference}일차</div>
      ) : (
        <div>{dayDifference}일차 독서기록</div>
      )}
      <div className={styles.startFromEnd}>
        {entry.startPage}p~{entry.endPage}p
      </div>
      <div onClick={() => handleEntryClick(entry._id)}>
        <div className={styles.header}>
          <div className={styles.day}>{dayDifference}일차 독서기록</div>
          <div className={styles.page}>
            {entry.startPage}p~{entry.endPage}p
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.contentInfo}>
            <div className={styles.top}>
              <h3>{entry.title}</h3>
              <small>{reviewDate.format('YYYY.MM.DD')}</small>
            </div>
            <button onClick={() => handleEditClick(entry._id)}>수정하기</button>
          </div>
          <p className={styles.main}>
            {entry.expanded
              ? entry.content
              : truncateContent(entry.content, 150)}
          </p>
          <div className={styles.bottom}>
            <div>
              <img src='/images/Heart_01.svg'></img> {entry.likedBy.length}개
            </div>
            <div>
              <img src='/images/Chat.svg'></img> {entry.comments.length}개
            </div>
          </div>
        </div>
      </div>
      {entry.expanded && (
        <div className={styles.commentsSection}>
          {entry.comments.map((comment, index) => (
            <div key={comment._id || index}>
              <small>
                {comment.nickName} |{' '}
                {moment(comment.createdAt).format('YYYY.MM.DD')}
              </small>
              <p>{comment.content}</p>
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
