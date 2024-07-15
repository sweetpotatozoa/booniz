import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateContent from '../../utils/truncateContent'
import NavBar from '../../components/NavBar/NavBar'
import BackendApis from '../../utils/backendApis'
import styles from './MyLikes.module.css'

const MyLikes = () => {
  const [nickname, setNickname] = useState('홍길동')
  const [likedEntries, setLikedEntries] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLikedEntries = async () => {
      try {
        const result = await BackendApis.getLikedReviews()
        if (result) {
          console.log('result:', result)
          setLikedEntries(result)
        }
      } catch (error) {
        console.error('Error fetching liked entries:', error)
      }
    }

    fetchLikedEntries()
  }, [])

  const handleEntryClick = (id) => {
    navigate(`/userProfile/${id}`)
  }

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{nickname}님이 좋아요를 누른 독서일지예요!</h1>
        </div>
        <div className={styles.likes}>
          {likedEntries.map((entry) => (
            <div
              key={entry._id}
              className={styles.like}
              onClick={() => handleEntryClick(entry.userId)}
            >
              <h3>{entry.authorNickName}</h3>
              <div className={styles.top}>
                <h4>{entry.title}</h4>
                <small>{entry.updatedAt}</small>
              </div>
              <p>{truncateContent(entry.content, 150)}</p>
              <div className={styles.bottom}>
                <div>
                  <img src='/images/Heart_01.svg'></img> {entry.likedBy.length}
                  개
                </div>
                <div>
                  <img src='/images/chat.svg'></img> {entry.comments.length}개
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyLikes
