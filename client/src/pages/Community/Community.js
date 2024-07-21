import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import NavBar from '../../components/NavBar/NavBar'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Community.module.css'
import BackendApis from '../../utils/backendApis'
import moment from 'moment-timezone' // Import moment-timezone
import 'moment/locale/ko' // Import Korean locale
import Review from '../../components/Review/Review'

const Community = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [userData, setUserData] = useState({
    reviews: [],
    userId: '',
  })
  const navigate = useNavigate()

  const handleEntryClick = (id) => {
    setUserData((prevData) => ({
      ...prevData,
      reviews: prevData.reviews
        ? prevData.reviews.map((entry) =>
            entry._id === id
              ? { ...entry, expanded: !entry.expanded }
              : { ...entry, expanded: false },
          )
        : [],
    }))
  }

  const handleCommentSubmit = async (reviewId, content) => {
    try {
      const newComment = await BackendApis.createComment(reviewId, { content })
      if (newComment && newComment.reviewId) {
        setUserData((prevData) => ({
          ...prevData,
          reviews: prevData.reviews.map((entry) =>
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
        setUserData((prevData) => ({
          ...prevData,
          reviews: prevData.reviews.map((entry) =>
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

  const handlePreviousDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
  }

  const handleEditClick = (id) => {
    navigate(`/edit/${userData.nickName}/${id}`)
  }

  const handleNextDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
  }

  const handleNicknameClick = (id, e) => {
    if (e) e.stopPropagation()
    navigate(`/userProfile/${id}`)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token)

    if (!token || token === '') {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const formattedDate = moment(selectedDate)
          .tz('Asia/Seoul')
          .format('YYYY-MM-DD')
        const result = await BackendApis.getCommunityReviews(formattedDate)
        if (result) {
          setUserData({
            ...result,
            reviews: result.reviews || [],
          })
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [selectedDate])

  const challengeStartDate = moment('2024-07-07').tz('Asia/Seoul')
  const isFutureDate = moment(selectedDate).isSameOrAfter(
    moment().startOf('day'),
  )

  return (
    <>
      {userData.userId === '' ? null : (
        <>
          <NavBar />
          <div className={styles.container}>
            <div className={styles.header}>
              <h1>다른 사람들은 어떤 일지를 썼을까요?</h1>
              <div className={styles.datePicker}>
                <button onClick={handlePreviousDay}>
                  <img src='/images/left.svg' alt='Previous Day' />
                </button>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat='yyyy.MM.dd'
                  className={styles.datePickerInput}
                  disabled
                />
                <button onClick={handleNextDay} disabled={isFutureDate}>
                  <img src='/images/right.svg' alt='Next Day' />
                </button>
              </div>
            </div>

            <div className={styles.diaryContainer}>
              {userData.reviews && userData.reviews.length > 0 ? (
                userData.reviews.map((entry) => {
                  const reviewDate = moment(entry.createdAt).tz('Asia/Seoul')
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
                      handleEditClick={handleEditClick} // 필요 시 구현
                      handleDeleteClick={() => {}} // 필요 시 구현
                      handleDeleteComment={handleDeleteComment}
                      handleCommentSubmit={handleCommentSubmit}
                      handleNicknameClick={handleNicknameClick}
                      showNickName={true} // 닉네임 표시 여부 추가
                    />
                  )
                })
              ) : (
                <p>선택된 날짜에 해당하는 독서 기록이 없습니다.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Community
