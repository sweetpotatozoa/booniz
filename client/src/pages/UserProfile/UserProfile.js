import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './UserProfile.module.css'
import moment from 'moment'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import Review from '../../components/Review/Review'

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    userId: '',
    nickName: '',
    completionRate: '',
    reviews: [],
    dailyStatus: [], // Ensure this is initialized
  })

  const fetchUserProfile = async (id) => {
    if (!id) {
      console.error('No userId found in params')
      return
    }
    try {
      const result = await BackendApis.getUserProfile(id)
      if (result) {
        setUserData(result)
      }
    } catch (error) {
      console.error('Errors have occurred in fetching User Profile:', error)
    }
  }

  useEffect(() => {
    fetchUserProfile(userId)
  }, [userId])

  const handleEntryClick = (id) => {
    setUserData((prevState) => ({
      ...prevState,
      reviews: prevState.reviews.map((entry) =>
        entry._id === id
          ? { ...entry, expanded: !entry.expanded }
          : { ...entry, expanded: false },
      ),
    }))
  }

  const handleCommentSubmit = async (reviewId, content) => {
    try {
      const newComment = await BackendApis.createComment(reviewId, { content })
      setUserData((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.map((entry) =>
          entry._id === reviewId
            ? { ...entry, comments: [...entry.comments, newComment] }
            : entry,
        ),
      }))
    } catch (error) {
      console.error('댓글 제출 중 오류 발생:', error)
    }
  }

  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      const result = await BackendApis.deleteComment(commentId)
      if (result) {
        setUserData((prevState) => ({
          ...prevState,
          reviews: prevState.reviews.map((entry) =>
            entry._id === reviewId
              ? {
                  ...entry,
                  comments: entry.comments.filter(
                    (comment) => comment._id !== commentId,
                  ),
                }
              : entry,
          ),
        }))
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error)
    }
  }

  const handleEditClick = (reviewId) => {
    navigate(`/edit/${userId}/${reviewId}`)
  }

  const challengeStartDate = moment('2024-07-07')
  const consecutiveDays = getConsecutiveDays(userData.dailyStatus)

  return (
    <>
      <NavBar />
      <div className={styles.userProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님의 프로필</h1>
          <div className={styles.profileInfo}>
            <div>
              <img src='/' alt='프로필사진' />
              <div>{userData.nickName}님</div>
            </div>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>
              완독률:{' '}
              {userData.completionRate
                ? `${userData.completionRate.toFixed(2)}%`
                : '0.00%'}
            </div>
          </div>
        </div>
        <div className={styles.reviewContainer}>
          {userData.reviews && userData.reviews.length > 0 ? (
            userData.reviews.map((entry) => {
              const reviewDate = moment(entry.createdAt)
              const dayDifference =
                reviewDate.diff(challengeStartDate, 'days') + 1
              return (
                <Review
                  key={entry._id}
                  entry={entry}
                  dayDifference={dayDifference}
                  handleEntryClick={handleEntryClick}
                  handleEditClick={handleEditClick}
                  handleDeleteComment={handleDeleteComment}
                  handleCommentSubmit={handleCommentSubmit}
                />
              )
            })
          ) : (
            <p>독서 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
