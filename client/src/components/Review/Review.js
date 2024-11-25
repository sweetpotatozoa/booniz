import React from 'react'
import moment from 'moment'
import { useState } from 'react'
import truncateContent from '../../utils/truncateContent'
import CommentForm from '../../components/CommentForm/CommentForm'
import CommentDelete from '../../components/CommentDelete/CommentDelete'
import styles from './Review.module.css'
import BackendApis from '../../utils/backendApis'
import { useNavigate } from 'react-router-dom'

const Review = ({
  entry,
  dayDifference,
  userData,
  setUserData,
  handleEntryClick,
  handleEditClick,
  handleDeleteComment,
  handleCommentSubmit,
  handleNicknameClick,
  showNickName = false,
  myProfile = false,
}) => {
  const [likedBy, setLikedBy] = useState(entry.likedBy)
  const reviewDate = moment(entry.createdAt)
  const navigate = useNavigate()
  // console.log('entry:', entry)
  const handleClick = (e) => {
    e.stopPropagation()
  }

  const handleLikeClick = async () => {
    try {
      const response = await BackendApis.likeReview(entry._id)
      console.log(response.message) //디버깅용
      if (response && response.message) {
        if (response.message === '좋아요 +1') {
          setLikedBy([...likedBy, userData.userId])
        } else {
          setLikedBy(likedBy.filter((id) => id !== userData.userId))
        }
      }
    } catch (error) {
      console.error('Error liking the review:', error)
    }
  }

  const handleDeleteClick = async () => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        const response = await BackendApis.deleteReview(entry._id)
        if (response && response.message === '일지 삭제 성공') {
          console.log('Review deleted successfully')
          const updatedReviews = userData.reviews.filter(
            (reviewEntry) => reviewEntry._id !== entry._id,
          )

          // setUserData를 사용하여 업데이트
          setUserData({
            ...userData,
            reviews: updatedReviews,
          })
        }
      } catch (error) {
        console.error('Error deleting the review:', error)
      }
    }
  }

  return (
    <div key={entry._id} className={styles.reviewEntry}>
      <div onClick={() => handleEntryClick(entry._id)}>
        {showNickName ? null : (
          <div className={styles.upHeader}>
            <div className={styles.day1}>{dayDifference}일차 독서기록</div>
            <div className={styles.page1}>
              {entry.startPage}p~{entry.endPage}p
            </div>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.header}>
            {showNickName ? (
              <>
                <div
                  className={styles.nickName}
                  onClick={(e) => {
                    handleClick(e)
                    handleNicknameClick(entry.userId)
                  }}
                >
                  {entry.nickName}
                </div>
                <div className={styles.rightHeader}>
                  <div className={styles.page}>
                    {entry.startPage}p~{entry.endPage}p
                  </div>
                  <div className={styles.day}>{dayDifference}일차</div>
                </div>
              </>
            ) : null}
          </div>
          <div className={styles.contentInfo}>
            <div className={styles.top}>
              <h3>{entry.title}</h3>
              <small>{reviewDate.format('YYYY.MM.DD')}</small>
            </div>
            {showNickName === false && (
              <div>
                {userData.userId === entry.userId && (
                  <button
                    onClick={(e) => {
                      handleClick(e)
                      handleEditClick(entry._id)
                    }}
                  >
                    수정하기
                  </button>
                )}
                {userData.userId === entry.userId && (
                  <button
                    className={styles.reviewDelete}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick()
                    }}
                  >
                    삭제하기
                  </button>
                )}
              </div>
            )}
          </div>
          <p className={styles.main}>
            {entry.expanded
              ? entry.content
              : truncateContent(entry.content, 150)}
          </p>
          <div className={styles.bottom}>
            <div>
              <div
                onClick={(e) => {
                  handleClick(e)
                  handleLikeClick()
                }}
                className={styles.like}
              >
                <img src='/images/Heart_01.svg' alt='Heart Icon'></img>
                {likedBy.length}개
              </div>
              <div>
                <img src='/images/Chat.svg' alt='Chat Icon'></img>
                {entry.comments.length}개
              </div>
            </div>
            {showNickName && (
              <div className={styles.head}>
                {userData.userId === entry.userId && (
                  <button
                    onClick={(e) => {
                      handleClick(e)
                      handleEditClick(entry._id)
                    }}
                  >
                    수정하기
                  </button>
                )}
                {userData.userId === entry.userId && (
                  <button
                    className={styles.reviewDelete}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick()
                    }}
                  >
                    삭제하기
                  </button>
                )}
              </div>
            )}
          </div>
          {entry.expanded && (
            <div className={styles.commentsSection} onClick={handleClick}>
              {entry.comments.map((comment) => (
                <div key={comment._id} className={styles.commentWrapper}>
                  <div className={styles.commentHeader}>
                    <small>
                      <span
                        className={styles.commentName}
                        onClick={() => {
                          navigate(`/userProfile/${comment.userId}`)
                        }}
                      >
                        {comment.nickName}
                      </span>
                      <span className={styles.commentDate}>
                        {moment(comment.createdAt).format('YYYY.MM.DD')}
                      </span>
                    </small>
                    {userData.userId === comment.userId && (
                      <CommentDelete
                        userId={userData.userId}
                        reviewId={entry._id}
                        commentId={comment._id}
                        handleDeleteComment={handleDeleteComment}
                      />
                    )}
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
  )
}

export default Review
