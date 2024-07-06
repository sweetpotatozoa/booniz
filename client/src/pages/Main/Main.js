import React, { useEffect, useState } from 'react'

const Main = () => {
  const [nickname, setNickname] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await fetch('/api')
        const data = await response.json()
        setNickname(data.usersDB.nickname)
        setReadingProgress(data.usersDB.readpages / data.usersDB.allpages)
        setAttendance(data.reviewsDB.attendance)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='main-container'>
      <h1>안녕하세요 {nickname}님</h1>
      <div className='progress-container'>
        <h2>독서 진행률</h2>
        <div className='progress-bar'>
          <div
            className='progress'
            style={{ width: `${readingProgress * 100}%` }}
          ></div>
        </div>
      </div>
      <div className='attendance-container'>
        <h2>10일 챌린지 출석 현황</h2>
        <div className='attendance-dots'>
          {attendance.map((day, index) => (
            <div key={index} className={`dot ${day ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main
