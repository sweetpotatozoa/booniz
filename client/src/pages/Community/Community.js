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

const Community = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reviews, setReviews] = useState([])
  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const navigate = useNavigate()

  const handleEntryClick = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id)
  }

  const handleCommentSubmit = async (reviewId, content) => {
    try {
      const newComment = await BackendApis.createComment(reviewId, content)
      setReviews((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === reviewId
            ? { ...entry, comments: [...entry.comments, newComment] }
            : entry,
        ),
      )
    } catch (error) {
      console.error('Error submitting comment:', error)
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
                <div key={entry._id} className={styles.diaryEntry}>
                  <div onClick={() => handleEntryClick(entry._id)}>
                    <h3 onClick={(e) => handleNicknameClick(entry.userId, e)}>
                      {entry.nickName}
                    </h3>
                    <h4>{entry.title}</h4>
                    <small>
                      {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                    </small>
                    <div>
                      {entry.startPage}p~{entry.endPage}p
                    </div>
                    <small>{dayDifference}일차</small>

                    <p>
                      {expandedEntryId === entry._id
                        ? entry.content
                        : truncateContent(entry.content, 150)}
                    </p>

                    <div>❤ {entry.likedBy.length}개</div>
                    <div>□ {entry.comments.length}개</div>
                  </div>
                  {expandedEntryId === entry._id && (
                    <div className={styles.commentsSection}>
                      {entry.comments.map((comment, index) => (
                        <div key={index}>
                          <strong>{comment.nickName}</strong>
                          <small>
                            {new Date(comment.createdAt).toLocaleDateString(
                              'ko-KR',
                            )}
                          </small>
                          <p>{comment.content}</p>
                        </div>
                      ))}
                      <input
                        type='text'
                        placeholder='댓글을 입력하세요'
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            handleCommentSubmit(entry._id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const commentInput = e.target.previousSibling
                          if (commentInput.value) {
                            handleCommentSubmit(entry._id, commentInput.value)
                            commentInput.value = ''
                          }
                        }}
                      >
                        댓글 작성하기
                      </button>
                    </div>
                  )}
                </div>
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
