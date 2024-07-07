import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import truncateContent from '../../utils/truncateContent'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'

import styles from './Main.module.css'

const Main = () => {
  const [userData, setUserData] = useState({
    nickName: '',
    readPages: 0,
    allPages: 0,
    dailyStatus: [],
    reviews: [],
  })

  const navigate = useNavigate()
  const remainingPages = userData.allPages - userData.readPages
  const readingProgress = userData.allPages
    ? (userData.readPages / userData.allPages) * 100
    : 0

  const handleEntryClick = () => {
    navigate('/myProfile')
  }

  useEffect(() => {
    const fetchMainInfo = async () => {
      try {
        const result = await BackendApis.getMainInfo()
        if (result) {
          setUserData({
            nickName: result.userData.nickName,
            readPages: result.userData.readPages,
            allPages: result.userData.allPages,
            dailyStatus: result.dailyStatus,
            reviews: result.reviews,
          })
        }
      } catch (error) {
        console.error('Error fetching main info:', error)
      }
    }

    fetchMainInfo()
  }, [])

  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <h1>안녕하세요 {userData.nickName}님</h1>
        <div className={styles.progressContainer}>
          <div>
            <div className={styles.readingProgress}>
              {readingProgress.toFixed(2)}%
            </div>
            <div>이만큼 읽었어요!</div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
          <div
            className={styles.pages}
          >{`읽은 쪽수: ${userData.readPages}, 남은 쪽수: ${remainingPages}`}</div>
        </div>
        <div className={styles.attendanceContainer}>
          <div>10일 챌린지 미션 진행중</div>
          <div>매일 독서일지를 쓰면, 선물을 받을 수 있어요!</div>
          <div className={styles.attendanceDots}>
            {userData.dailyStatus.map((day, index) => (
              <div
                key={index}
                className={`${styles.dot} ${day ? styles.active : ''}`}
              ></div>
            ))}
          </div>
        </div>
        <div className={styles.diaryContainer}>
          <h2>내가 쓴 독서일지</h2>
          <div className={styles.diary}>
            {userData.reviews.map((entry) => (
              <React.Fragment key={entry._id}>
                <div>{entry._id}일차 독서일지</div>
                <div className={styles.diaryEntry} onClick={handleEntryClick}>
                  <h3>{entry.title}</h3>
                  <p>{truncateContent(entry.content, 150)}</p>
                  <small>{entry.createdAt.split('T')[0]}</small>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
