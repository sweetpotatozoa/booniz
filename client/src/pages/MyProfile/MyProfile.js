import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './MyProfile.module.css'
import moment from 'moment'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import Review from '../../components/Review/Review'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    userId: '',
    nickName: '',
    completionRate: 0,
    reviews: [],
    dailyStatus: [],
  })
  const navigate = useNavigate()

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

  const handleEditClick = (id) => {
    navigate(`/edit/${userData.nickName}/${id}`)
  }

  const handleDeleteClick = async (id) => {
    const result = await BackendApis.deleteReview(id)
    if (result) {
      setUserData((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.filter((entry) => entry._id !== id),
      }))
    }
  }

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const result = await BackendApis.getMyProfile()
        if (result) {
          setUserData(result)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchMyProfile()
  }, [])

  const challengeStartDate = moment('2024-07-07')
  const consecutiveDays = getConsecutiveDays(userData.dailyStatus)

  return (
    <>
      <NavBar />
      <div className={styles.myProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님, 매일 독서기록을 쓰고 선물 받아가세요</h1>
          <div className={styles.profileInfo}>
            <div>
              <img src='/' alt='프로필사진'></img>
              <div>{userData.nickName}님</div>
            </div>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>완독률: {userData.completionRate.toFixed(2)}%</div>
            <div>읽은 쪽수: {userData.readPages}쪽</div>
            <button onClick={() => navigate('/myLikes')}>좋아요한 글</button>
          </div>
        </div>
        <div className={styles.reviewContainer}>
          {userData.reviews.length > 0 ? (
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

export default MyProfile
