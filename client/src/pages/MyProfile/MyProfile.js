import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './MyProfile.module.css'
import moment from 'moment'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import Review from '../../components/Review/Review'
import ProfileInfo from '../../components/ProfileInfo.js/ProfileInfo'

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
      console.log('새 댓글:', newComment)
      if (newComment && newComment.insertedId) {
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
                      _id: newComment.insertedId,
                      content: content,
                      userNickName: '사용자 닉네임',
                      createdAt: new Date().toISOString(),
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
  const latestEndPage =
    userData.reviews.length > 0
      ? userData.reviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0].endPage
      : 0 // 가장 최근 리뷰의 endPage를 얻음. 리뷰가 없으면 0.

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <h1 style={{ fontSize: '32px' }}>
            {userData.nickName}님, 매일 독서기록을 쓰고 선물 받아가세요
          </h1>
          <ProfileInfo
            nickName={userData.nickName}
            consecutiveDays={consecutiveDays}
            completionRate={userData.completionRate}
            readPages={latestEndPage}
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
