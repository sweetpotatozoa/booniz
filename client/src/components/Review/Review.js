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

  const handleClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div key={entry._id} className={styles.reviewEntry}>
      <div onClick={() => handleEntryClick(entry._id)}>
        <div className={styles.header}>
          {showNickName ? null : (
            <div>
              <div className={styles.day}>{dayDifference}일차 독서기록</div>
              <div className={styles.page}>
                {entry.startPage}p~{entry.endPage}p
              </div>
            </div>
          )}

          <div className={styles.content}>
            {showNickName && (
              <div>
                <div
                  className={styles.nickName}
                  onClick={() => {
                    handleNicknameClick()
                  }}
                >
                  {entry.nickName}
                </div>
                <div className={styles.day}>{dayDifference}일차 독서기록</div>
                <div className={styles.page}>
                  {entry.startPage}p~{entry.endPage}p
                </div>
              </div>
            )}
            <div className={styles.contentInfo}>
              <div className={styles.top}>
                <h3>{entry.title}</h3>
                <small>{reviewDate.format('YYYY.MM.DD')}</small>
              </div>
              <button
                onClick={(e) => {
                  handleClick(e)
                  handleEditClick(entry._id)
                }}
              >
                수정하기
              </button>
            </div>
            <p className={styles.main}>
              {entry.expanded
                ? entry.content
                : truncateContent(entry.content, 150)}
            </p>
            <div className={styles.bottom}>
              <div>
                <img src='/images/Heart_01.svg' alt='Heart Icon'></img>{' '}
                {entry.likedBy.length}개
              </div>
              <div>
                <img src='/images/Chat.svg' alt='Chat Icon'></img>{' '}
                {entry.comments.length}개
              </div>
            </div>
            {entry.expanded && (
              <div className={styles.commentsSection} onClick={handleClick}>
                {entry.comments.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    className={styles.commentWrapper}
                  >
                    <div className={styles.commentHeader}>
                      <small>
                        <span className={styles.commentName}>
                          {comment.nickName}
                        </span>
                        <span className={styles.commentDate}>
                          {moment(comment.createdAt).format('YYYY.MM.DD')}
                        </span>
                      </small>
                      <CommentDelete
                        reviewId={entry._id}
                        commentId={comment._id}
                        handleDeleteComment={handleDeleteComment}
                      />
                    </div>
                    <p className={styles.mainComment}>{comment.content}</p>
                  </div>
                ))}
                <CommentForm
                  reviewId={entry._id}
                  handleCommentSubmit={handleCommentSubmit}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review
