import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './UserProfile.module.css'
import moment from 'moment'
import truncateContent from '../../utils/truncateContent'

const UserProfile = () => {
  const { userId } = useParams()
  const [userData, setUserData] = useState({
    userId: '',
    nickName: '',
    completionRate: '',
    reviews: [],
  })

  useEffect(() => {
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

    fetchUserProfile(userId)
  }, [userId])

  const challengeStartDate = moment('2024-07-07')

  return (
    <>
      <NavBar />
      <div className={styles.userProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님의 프로필</h1>
          <div className={styles.profileInfo}>
            <div>
              <img src='/' alt='프로필사진'></img>
              <div>{userData.nickName}님</div>
            </div>
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
                <div key={entry._id} className={styles.reviewEntry}>
                  <div>
                    <div>{dayDifference}일차 독서일지</div>
                    <h3>{entry.title}</h3>
                    <small>{entry.createdAt.split('T')[0]}</small>
                    <p>{truncateContent(entry.content, 150)}</p>
                    <div>❤ {entry.likedBy.length}개</div>
                    <div>□ {entry.comments.length}개</div>
                  </div>
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
                  </div>
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

export default UserProfile
