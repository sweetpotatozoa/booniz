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
        <div className={styles.reviewHeader}>
          {showNickName && (
            <h3 onClick={(e) => handleNicknameClick(entry.userId, e)}>
              {entry.nickName}
            </h3>
          )}{' '}
          {/* 닉네임 표시 */}
          <h3>{entry.title}</h3>
          <small>{reviewDate.format('YYYY-MM-DD')}</small>
          <button onClick={() => handleEditClick(entry._id)}>수정하기</button>
        </div>
        <p>
          {entry.expanded ? entry.content : truncateContent(entry.content, 150)}
        </p>
        <div>
          <div className={styles.heartIcon}>❤</div> {entry.likedBy.length}개
        </div>
        <div>□ {entry.comments.length}개</div>
        {entry.expanded && (
          <button onClick={() => handleDeleteClick(entry._id)}>삭제하기</button>
        )}
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
