import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateContent from '../../utils/truncateContent'
import NavBar from '../../components/NavBar/NavBar'

const MyLikes = () => {
  const [nickname, setNickname] = useState('홍길동')
  const [likedEntries, setLikedEntries] = useState([
    {
      id: 1,
      nickname: '김첨지',
      title: '독서 일지의 제목',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회의원은 법률이 정하는 직을 겸할 수 없다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다.',
      date: '2024.00.00',
      likes: 13,
      comments: 2,
    },
    {
      id: 2,
      title: '독서 일지의 제목',
      nickname: '글쓴이2',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회의원은 법률이 정하는 직을 겸할 수 없다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다.',
      date: '2024.00.00',
      likes: 13,
      comments: 2,
    },
  ])

  const navigate = useNavigate()

  const handleEntryClick = (nickname) => {
    navigate(`/userProfile/${nickname}`)
  }

  return (
    <>
      <NavBar />
      <div className='myLikes-container'>
        <div className='profile-header'>
          <h1>{nickname}님이 좋아요를 누른 독서일지예요!</h1>
        </div>
        <div className='likes-container'>
          {likedEntries.map((entry) => (
            <div
              key={entry.id}
              className='like-entry'
              onClick={() => handleEntryClick(entry.nickname)}
            >
              <div>
                <h3>{entry.nickname}</h3>
                <h4>{entry.title}</h4>
                <p>{truncateContent(entry.content, 150)}</p>
                <div>❤ {entry.likes}개</div>
                <div>□ {entry.comments}개</div>
                <small>{entry.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyLikes
