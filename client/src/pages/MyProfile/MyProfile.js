import React, { useState, useEffect } from 'react'
import truncateContent from '../../utils/truncateContent'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'

const MyProfile = () => {
  const [nickname, setNickname] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [readPages, setReadPages] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [attendance, setAttendance] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const navigate = useNavigate()

  const handleEntryClick = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id)
  }

  const handleCommentSubmit = (id, newComment) => {
    setDiaryEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, comments: [...(entry.comments || []), newComment] }
          : entry,
      ),
    )
  }

  const handleEditClick = (id) => {
    navigate(`/write/${id}`)
  }

  const handleDeleteClick = async (id) => {
    const result = await BackendApis.deleteReview(id)
    if (result) {
      setDiaryEntries(diaryEntries.filter((entry) => entry.id !== id))
    }
  }

  const consecutiveDays = getConsecutiveDays(attendance)

  useEffect(() => {
    const fetchData = async () => {
      const result = await BackendApis.getMainInfo()
      if (result) {
        setNickname(result.userData.nickname || '')
        setReadingProgress(result.userData.readingProgress || 0)
        setReadPages(result.userData.readPages || 0)
        setTotalPages(result.userData.totalPages || 0)
        setAttendance(result.dailyStatus || [])
        setDiaryEntries(result.reviews || [])
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <NavBar />
      <div className='myProfile-container'>
        <div className='profile-header'>
          <h1>{nickname}님, 매일 독서기록을 쓰고 선물 받아가세요</h1>
          <div className='profile-info'>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>완독률: {readingProgress * 100}%</div>
            <div>읽은 쪽수: {readPages}쪽</div>
            <button onClick={() => navigate('/myLikes')}>좋아요한 글</button>
          </div>
        </div>
        <div className='diary-container'>
          {diaryEntries.length > 0 ? (
            diaryEntries.map((entry) => (
              <div key={entry.id} className='diary-entry'>
                <div onClick={() => handleEntryClick(entry.id)}>
                  <h3>{entry.title}</h3>
                  <small>{entry.date}</small>
                  <p>
                    {expandedEntryId === entry.id
                      ? entry.content
                      : truncateContent(entry.content, 150)}
                  </p>
                  <div>❤ {entry.likes}개</div>
                  <div>□(댓글수) {entry.comments?.length || 0}개</div>
                </div>
                {expandedEntryId === entry.id && (
                  <div className='comments-section'>
                    {entry.comments?.map((comment, index) => (
                      <p key={index}>{comment}</p>
                    ))}
                    <input
                      type='text'
                      placeholder='댓글을 입력하세요'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          handleCommentSubmit(entry.id, e.target.value)
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
                          handleCommentSubmit(entry.id, commentInput.value)
                          commentInput.value = ''
                        }
                      }}
                    >
                      댓글 작성하기
                    </button>
                    <button onClick={() => handleEditClick(entry.id)}>
                      수정하기
                    </button>
                    <button onClick={() => handleDeleteClick(entry.id)}>
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>독서 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default MyProfile
