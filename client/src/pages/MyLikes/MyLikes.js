import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateContent from '../../utils/truncateContent'
import NavBar from '../../components/NavBar/NavBar'

const MyLikes = () => {
  const [nickname, setNickname] = useState('홍길동')
  const [likedEntries, setLikedEntries] = useState([
    {
      _id: '1',
      userId: 'user1',
      nickname: '김첨지',
      title: '독서 일지의 제목',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회의원은 법률이 정하는 직을 겸할 수 없다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다.',
      createdAt: '2024-07-07T02:33:06',
      updatedAt: '2024-07-07T02:33:06',
      likedBy: ['user2', 'user3'],
      comments: [
        {
          _id: '1',
          content: '댓글1',
          createdAt: '2001-02-28T15:00:00.000+00:00',
          reviewId: '1',
          userId: 'user2',
        },
        {
          _id: '2',
          content: '댓글2',
          createdAt: '2001-03-01T15:00:00.000+00:00',
          reviewId: '1',
          userId: 'user3',
        },
      ],
    },
    {
      _id: '2',
      userId: 'user2',
      nickname: '글쓴이2',
      title: '독서 일지의 제목',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회의원은 법률이 정하는 직을 겸할 수 없다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다.',
      createdAt: '2024-07-08T02:33:06',
      updatedAt: '2024-07-08T02:33:06',
      likedBy: ['user1', 'user3'],
      comments: [
        {
          _id: '3',
          content: '댓글1',
          createdAt: '2001-04-28T15:00:00.000+00:00',
          reviewId: '2',
          userId: 'user1',
        },
        {
          _id: '4',
          content: '댓글2',
          createdAt: '2001-05-01T15:00:00.000+00:00',
          reviewId: '2',
          userId: 'user3',
        },
      ],
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
              key={entry._id}
              className='like-entry'
              onClick={() => handleEntryClick(entry.nickname)}
            >
              <div>
                <h3>{entry.nickname}</h3>
                <h4>{entry.title}</h4>
                <p>{truncateContent(entry.content, 150)}</p>
                <div>❤ {entry.likedBy.length}개</div>
                <div>□ {entry.comments.length}개</div>
                <small>{entry.createdAt.split('T')[0]}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyLikes
