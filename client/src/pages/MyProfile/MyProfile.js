import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import truncateContent from '../../utils/truncateContent'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './MyProfile.module.css'
import moment from 'moment'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    userId: '',
    nickName: '',
    completionRate: 0,
    reviews: [],
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

  const handleCommentSubmit = (id, newComment) => {
    setUserData((prevState) => ({
      ...prevState,
      reviews: prevState.reviews.map((entry) =>
        entry._id === id
          ? { ...entry, comments: [...entry.comments, newComment] }
          : entry,
      ),
    }))
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
  const consecutiveDays = userData.dailyStatus
    ? userData.dailyStatus.filter((status) => status).length
    : 0

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
                <div key={entry._id} className={styles.reviewEntry}>
                  <div onClick={() => handleEntryClick(entry._id)}>
                    <div>{dayDifference}일차 독서일지</div>
                    <h3>{entry.title}</h3>
                    <small>{entry.createdAt.split('T')[0]}</small>
                    <p>
                      {entry.expanded
                        ? entry.content
                        : truncateContent(entry.content, 150)}
                    </p>
                    <div>❤ {entry.likedBy.length}개</div>
                    <div>□ {entry.comments.length}개</div>
                  </div>
                  {entry.expanded && (
                    <div className={styles.commentsSection}>
                      {entry.comments.map((comment) => (
                        <div key={comment._id}>
                          <p>{comment.content}</p>
                          <small>
                            {comment.userNickName} |{' '}
                            {moment(comment.createdAt).format('YYYY-MM-DD')}
                          </small>
                        </div>
                      ))}
                      <input
                        type='text'
                        placeholder='댓글을 입력하세요'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            handleCommentSubmit(entry._id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const commentInput = document.querySelector(
                            `input[placeholder="댓글을 입력하세요"]`,
                          )
                          if (commentInput.value) {
                            handleCommentSubmit(entry._id, commentInput.value)
                            commentInput.value = ''
                          }
                        }}
                      >
                        댓글 작성하기
                      </button>
                      <button onClick={() => handleEditClick(entry._id)}>
                        수정하기
                      </button>
                      <button onClick={() => handleDeleteClick(entry._id)}>
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
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
