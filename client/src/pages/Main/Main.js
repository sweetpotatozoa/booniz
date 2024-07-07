import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import truncateContent from '../../utils/truncateContent'
import BackendApis from '../../utils/backendApis'
import './Main.css'

const Main = () => {
  const [nickname, setNickname] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [readPages, setReadPages] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [attendance, setAttendance] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])

  useEffect(() => {
    const fetchMainInfo = async () => {
      try {
        const result = await BackendApis.getMainInfo()
        if (result) {
          setNickname(result.userData.nickname)
          setReadingProgress(result.userData.readingProgress)
          setReadPages(result.userData.readPages)
          setTotalPages(result.userData.totalPages)
          setAttendance(result.dailyStatus)
          setDiaryEntries(result.reviews)
        }
      } catch (error) {
        console.error('Error fetching main info:', error)
      }
    }

    fetchMainInfo()
  }, [])

  const navigate = useNavigate()
  const remainingPages = totalPages - readPages

  const handleEntryClick = () => {
    navigate('/myProfile')
  }

  return (
    <div className='main-container'>
      <h1>안녕하세요 {nickname}님</h1>
      <div className='progress-container'>
        <div>
          <div className='readingProgress'>{readingProgress * 100}%</div>
          <div>이만큼 읽었어요!</div>
        </div>
        <div className='progress-bar'>
          <div
            className='progress'
            style={{ width: `${readingProgress * 100}%` }}
          ></div>
        </div>
        <div className='pages'>{`읽은 쪽수: ${readPages}, 남은 쪽수: ${remainingPages}`}</div>
      </div>
      <div className='attendance-container'>
        <div>10일 챌린지 미션 진행중</div>
        <div>매일 독서일지를 쓰면, 선물을 받을 수 있어요!</div>
        <div className='attendance-dots'>
          {attendance.map((day, index) => (
            <div key={index} className={`dot ${day ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
      <div className='diary-container'>
        <h2>내가 쓴 독서일지</h2>
        <div className='diary'>
          {diaryEntries.map((entry) => (
            <>
              <div>{entry.id}일차 독서일지</div>
              <div
                key={entry.id}
                className='diary-entry'
                onClick={handleEntryClick}
              >
                <h3>{entry.title}</h3>
                <p>{truncateContent(entry.content, 150)}</p>
                <small>{entry.date}</small>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main
