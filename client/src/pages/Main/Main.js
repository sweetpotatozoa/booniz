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

  const readingProgress = (userData.readPages / userData.allPages) * 100
  const navigate = useNavigate()
  const remainingPages = userData.allPages - userData.readPages

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
          <div className={styles.pages}>
            {`읽은 쪽수: ${userData.readPages}, 남은 쪽수: ${remainingPages}`}
          </div>
        </div>
        <div className={styles.attendanceContainer}>
          <div>10일 챌린지 미션 진행중</div>
          <div>매일 독서일지를 쓰면, 선물을 받을 수 있어요!</div>
          <div className={styles.attendanceDots}>
            {userData.dailyStatus.map((day) => (
              <div
                key={day.id}
                className={`${styles.dot} ${day.status ? styles.active : ''}`}
              ></div>
            ))}
          </div>
        </div>
        <div className={styles.reviewContainer}>
          <h2>내가 쓴 독서일지</h2>
          <div className={styles.review}>
            {userData.reviews.map(
              (
                entry,
                index, //일차 표현을 위해 reviews 배열의 index를 사용했는데, 이러면 사용자가 하루 빼먹고 글을 입력 안하면 일차 계산할 때 문제가 생길듯.
              ) => (
                <React.Fragment key={entry._id}>
                  <div>{index + 1}일차 독서일지</div>
                  <div
                    className={styles.reviewEntry}
                    onClick={handleEntryClick}
                  >
                    <h3>{entry.title}</h3>
                    <p>{truncateContent(entry.content, 150)}</p>
                    <small>{entry.createdAt.split('T')[0]}</small>
                  </div>
                </React.Fragment>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
