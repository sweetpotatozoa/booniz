import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './UserProfile.module.css'
import moment from 'moment'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import Review from '../../components/Review/Review'
import ProfileInfo from '../../components/ProfileInfo.js/ProfileInfo'

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    userId: '',
    nickName: '',
    completionRate: 0,
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
                      content: content, // 댓글 내용을 명시적으로 추가
                      userNickName: '사용자 닉네임', // 필요에 따라 추가
                      createdAt: new Date().toISOString(), // 현재 시간으로 설정
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

  const handleEditClick = (reviewId) => {
    navigate(`/edit/${userId}/${reviewId}`)
  }

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
      <div className={styles.userProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님의 프로필</h1>
          <ProfileInfo
            nickName={userData.nickName}
            consecutiveDays={consecutiveDays}
            completionRate={userData.completionRate}
            readPages={latestEndPage}
          />
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
