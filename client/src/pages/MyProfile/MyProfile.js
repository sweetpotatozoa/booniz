import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './MyProfile.module.css'
import moment from 'moment-timezone'

import Review from '../../components/Review/Review'
import ProfileInfo from '../../components/ProfileInfo.js/ProfileInfo'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    nickName: '',
    userId: '',
    readPages: 0, //읽은 쪽수
    completionRate: 0,
    reviews: [],
    streak: 0, //연속일차 계산
  })
  const navigate = useNavigate()

  // console.log('userData.userId:', userData.userId)
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
      // console.log('새 댓글:', newComment)
      if (newComment && newComment.reviewId) {
        setUserData((prevState) => ({
          ...prevState,
          reviews: prevState.reviews.map((entry) =>
            entry._id === reviewId
              ? {
                  ...entry,
                  comments: [
                    ...entry.comments,
                    {
                      ...newComment,
                    },
                  ],
                }
              : entry,
          ),
        }))
      }
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
          // console.log('result:', result)
          setUserData(result)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchMyProfile()
  }, [])

  const challengeStartDate = moment('2024-07-07').tz('Asia/Seoul')

  return (
    <>
      {userData.nickName === '' ? null : (
        <>
          <NavBar />
          <div>{userData.dailyStatus}</div>
          <div className={styles.container}>
            <div className={styles.profileHeader}>
              <h1 style={{ fontSize: '32px' }}>
                {userData.nickName}님, 매일 독서기록을 쓰고 선물 받아가세요
              </h1>
              <ProfileInfo
                nickName={userData.nickName}
                consecutiveDays={userData.streak}
                completionRate={userData.completionRate}
                readPages={userData.readPages}
              />
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
                      userData={userData}
                      setUserData={setUserData}
                      dayDifference={dayDifference}
                      handleEntryClick={handleEntryClick}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      handleDeleteComment={(reviewId, commentId) =>
                        handleDeleteComment(reviewId, commentId)
                      }
                      handleCommentSubmit={(reviewId, content) =>
                        handleCommentSubmit(reviewId, content)
                      }
                      myProfile={true}
                    />
                  )
                })
              ) : (
                <p>독서 기록이 없습니다.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MyProfile
