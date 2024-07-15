import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateContent from '../../utils/truncateContent'
import DatePicker from 'react-datepicker'
import NavBar from '../../components/NavBar/NavBar'
import 'react-datepicker/dist/react-datepicker.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './Community.module.css'
import BackendApis from '../../utils/backendApis'
import moment from 'moment'
import Review from '../../components/Review/Review'

const Community = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reviews, setReviews] = useState([])
  const navigate = useNavigate()

  const handleEntryClick = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((entry) =>
        entry._id === id
          ? { ...entry, expanded: !entry.expanded }
          : { ...entry, expanded: false },
      ),
    )
  }

  const handleCommentSubmit = async (reviewId, content) => {
    try {
      const newComment = await BackendApis.createComment(reviewId, { content })
      if (newComment && newComment.insertedId) {
        setReviews((prevReviews) =>
          prevReviews.map((entry) =>
            entry._id === reviewId
              ? {
                  ...entry,
                  comments: [
                    ...entry.comments,
                    {
                      ...newComment,
                      _id: newComment.insertedId,
                      content: content, // 댓글 내용을 명시적으로 추가
                    },
                  ],
                }
              : entry,
          ),
        )
      }
    } catch (error) {
      console.error('댓글 제출 중 오류 발생:', error)
    }
  }

  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      const result = await BackendApis.deleteComment(commentId)
      if (result) {
        setReviews((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === reviewId
              ? {
                  ...entry,
                  comments: entry.comments.filter(
                    (comment) => comment._id !== commentId,
                  ),
                }
              : entry,
          ),
        )
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error)
    }
  }

  const handlePreviousDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
  }

  const handleNextDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
  }

  const handleNicknameClick = (id, e) => {
    e.stopPropagation()
    navigate(`/userProfile/${id}`)
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]
        console.log('Fetching reviews for date:', formattedDate)
        const result = await BackendApis.getCommunityReviews(formattedDate)
        if (result) {
          console.log('Fetched reviews:', result)
          setReviews(result)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [selectedDate])

  const challengeStartDate = moment('2024-07-07')

  return (
    <>
      <NavBar />
      <div className={styles.communityContainer}>
        <h1>다른 사람들은 어떤 기록을 썼을까요?</h1>
        <div className={styles.datePicker}>
          <button onClick={handlePreviousDay}>
            <FaChevronLeft />
          </button>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat='yyyy-MM-dd'
          />
          <button onClick={handleNextDay}>
            <FaChevronRight />
          </button>
        </div>
        <div className={styles.diaryContainer}>
          {reviews.length > 0 ? (
            reviews.map((entry) => {
              const reviewDate = moment(entry.createdAt)
              const dayDifference =
                reviewDate.diff(challengeStartDate, 'days') + 1
              return (
                <Review
                  key={entry._id}
                  entry={entry}
                  dayDifference={dayDifference}
                  handleEntryClick={handleEntryClick}
                  handleEditClick={() => {}} // 필요 시 구현
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
  )
}

export default Community
