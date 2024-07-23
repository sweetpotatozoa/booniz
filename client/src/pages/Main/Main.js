import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import truncateContent from '../../utils/truncateContent'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Main.module.css'
import moment from 'moment-timezone'

const Main = () => {
  const [userData, setUserData] = useState({
    nickName: '',
    readPages: 0,
    allPages: 0,
    dailyStatus: [],
    reviews: [],
  })

  const readingProgress = (userData.readPages / userData.allPages) * 100
  const navigate = useNavigate()
  const remainingPages = userData.allPages - userData.readPages

  const handleEntryClick = () => {
    navigate('/myProfile')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token || token === '') {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchMainInfo = async () => {
      try {
        const result = await BackendApis.getMainInfo()
        if (result) {
          setUserData({
            nickName: result.userData.nickName,
            readPages: result.userData.readPages,
            allPages: result.userData.allPages,
            dailyStatus: result.dailyStatus.map((status, idx) => ({
              id: `status-${idx}-${Math.random()}`,
              status,
            })),
            reviews: result.reviews,
          })
        }
      } catch (error) {
        console.error('Error fetching main info:', error)
      }
    }

    fetchMainInfo()
  }, [])

  // UTC 시간으로 날짜를 설정
  const challengeStartDate = moment('2024-07-03').format('YYYY-MM-DD')

  // Create an array of length 10, filling with existing dailyStatus or inactive dots
  const fullDailyStatus = Array.from({ length: 10 }, (_, idx) => ({
    id: `status-${idx}`,
    status: userData.dailyStatus[idx] ? userData.dailyStatus[idx].status : 0,
  }))

  console.log(fullDailyStatus)

  return (
    <>
      {userData.nickName === '' ? null : (
        <>
          <NavBar />
          <div className={styles.container}>
            <h1 style={{ fontSize: '32px' }}>
              안녕하세요 {userData.nickName}님
            </h1>
            <div className={styles.progressContainer}>
              <div>
                <div className={styles.readingProgress}>
                  {readingProgress.toFixed(2)}%
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  이만큼 읽었어요!
                </div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${readingProgress}%` }}
                ></div>
              </div>
              <div className={styles.pages}>
                <div>
                  <p className={styles.page}>{userData.readPages}p</p>
                  <p className={styles.page}>읽은 쪽수</p>
                </div>
                <div>
                  <p className={styles.page}>{remainingPages}p</p>
                  <p className={styles.page}>남은 쪽수</p>
                </div>
              </div>
            </div>
            <div className={styles.attendanceContainer}>
              <div className={styles.title}>10일 챌린지 미션 진행 중!</div>
              <div className={styles.sub}>
                매일 독서일지를 쓰면, 선물을 받을 수 있어요
              </div>
              <div className={styles.attendanceDots}>
                {fullDailyStatus.map((day, idx) => (
                  <img
                    key={day.id}
                    className={`${styles.dot} ${
                      day.status ? styles.active : ''
                    }`}
                    style={{
                      backgroundImage: `url(images/${
                        day.status ? 'attendence' : `day${idx + 1}`
                      }.svg)`,
                      backgroundSize: 'cover',
                    }}
                  ></img>
                ))}
              </div>
            </div>
            <div className={styles.reviewContainer}>
              <h2 style={{ margin: '20px 0' }}>내가 쓴 독서일지</h2>
              <div className={styles.review}>
                {userData.reviews.map((entry) => {
                  const reviewDate = moment(entry.createdAt).format(
                    'YYYY-MM-DD',
                  )
                  const dayDifference =
                    reviewDate.diff(challengeStartDate, 'days') + 1
                  return (
                    <div key={entry._id}>
                      <div key={entry._id} className={styles.reviewData}>
                        <div
                          className={styles.reviewEntry}
                          onClick={handleEntryClick}
                        >
                          <div className={styles.reviewHeader}>
                            <div>{dayDifference}일차</div>
                            <h3>
                              {entry.title <= 7 === false &&
                                truncateContent(entry.title, 7)}
                            </h3>
                            <small>{reviewDate.format('YYYY.MM.DD')}</small>
                          </div>
                          <p className={styles.content}>
                            {truncateContent(entry.content, 150)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Main
