import React, { useState, useEffect } from 'react'
import truncateContent from '../../utils/truncateContent'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    nickName: '',
    readPages: 0,
    allPages: 0,
    dailyStatus: [],
    reviews: [],
  })

  const navigate = useNavigate()
  const readingProgress = userData.allPages
    ? (userData.readPages / userData.allPages) * 100
    : 0
  const remainingPages = userData.allPages - userData.readPages

  const handleEntryClick = (id) => {
    setUserData((prevData) => ({
      ...prevData,
      reviews: prevData.reviews.map((entry) =>
        entry._id === id ? { ...entry, expanded: !entry.expanded } : entry,
      ),
    }))
  }

  const handleCommentSubmit = (id, newComment) => {
    setUserData((prevData) => ({
      ...prevData,
      reviews: prevData.reviews.map((entry) =>
        entry._id === id
          ? { ...entry, comments: [...(entry.comments || []), newComment] }
          : entry,
      ),
    }))
  }

  const handleEditClick = (id) => {
    navigate(`/write/${id}`)
  }

  const handleDeleteClick = async (id) => {
    const result = await BackendApis.deleteReview(id)
    if (result) {
      setUserData((prevData) => ({
        ...prevData,
        reviews: prevData.reviews.filter((entry) => entry._id !== id),
      }))
    }
  }

  const consecutiveDays = getConsecutiveDays(userData.dailyStatus)

  useEffect(() => {
    const fetchProfileData = async () => {
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
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [])

  return (
    <>
      <NavBar />
      <div className='myProfile-container'>
        <div className='profile-header'>
          <h1>{userData.nickName}님, 매일 독서기록을 쓰고 선물 받아가세요</h1>
          <div className='profile-info'>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>완독률: {readingProgress.toFixed(2)}%</div>
            <div>읽은 쪽수: {userData.readPages}쪽</div>
            <button onClick={() => navigate('/myLikes')}>좋아요한 글</button>
          </div>
        </div>
        <div className='diary-container'>
          {userData.reviews.length > 0 ? (
            userData.reviews.map((entry) => (
              <div key={entry._id} className='diary-entry'>
                <div onClick={() => handleEntryClick(entry._id)}>
                  <h3>{entry.title}</h3>
                  <small>{entry.createdAt.split('T')[0]}</small>
                  <p>
                    {entry.expanded
                      ? entry.content
                      : truncateContent(entry.content, 150)}
                  </p>
                  <div>❤ {entry.likedBy.length}개</div>
                  <div>□(댓글수) {entry.comments?.length || 0}개</div>
                </div>
                {entry.expanded && (
                  <div className='comments-section'>
                    {entry.comments?.map((comment, index) => (
                      <p key={index}>{comment}</p>
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
