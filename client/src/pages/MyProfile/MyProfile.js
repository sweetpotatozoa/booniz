import React, { useState } from 'react'
import truncateContent from '../../utils/truncateContent'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import { useNavigate } from 'react-router'

const MyProfile = () => {
  //예시 데이터들
  const [nickname, setNickname] = useState('홍길동')
  const [readingProgress, setReadingProgress] = useState(0.5) // 50%
  const [readPages, setReadPages] = useState(50)
  const [totalPages, setTotalPages] = useState(100)
  const [attendance, setAttendance] = useState([1, 1, 0, 1, 1, 0, 1, 1, 1])
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 1,
      title: '독서일지 제목',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회와 정부는 국민의 뜻을 받들어 정의롭고 투명한 사회를 만들어 나가야 한다. 이러한 가치는 헌법에 명시되어 있으며, 이는 우리의 소중한 자산이다. 우리는 이를 통해 민주주의의 꽃을 피워가야 한다. 국민은 투표를 통해 자신들의 대표를 선출하고, 그 대표들은 국민의 목소리를 대변해야 한다. 이로 인해 사회는 보다 나은 방향으로 나아갈 수 있다.',
      date: '2024.00.00',
      startPage: 0,
      endPage: 100,
      likes: 13,
      comments: ['댓글1', '댓글2'],
    },
    {
      id: 2,
      title: '독서일지 제목',
      content:
        '국회의원은 국민의 대표로서, 그들의 책임과 의무를 다해야 한다. 국민의 목소리를 경청하고, 그들의 요구를 반영하는 법안을 마련해야 한다. 이는 국회의원의 가장 중요한 역할 중 하나이다. 또한, 정부는 국민의 안전과 복지를 책임져야 하며, 이를 위해 최선을 다해야 한다. 우리의 사회는 공정하고 정의로운 방향으로 나아가야 한다. 이를 위해서는 국민 모두가 함께 노력해야 한다. 민주주의의 기본 원칙을 준수하고, 서로 존중하며 협력해야 한다.',
      date: '2024.00.00',
      startPage: 101,
      endPage: 200,
      likes: 10,
      comments: ['댓글1', '댓글2'],
    },
  ])
  const [expandedEntryId, setExpandedEntryId] = useState(null)

  //일지 클릭시 댓글 보이도록 하는 함수
  const handleEntryClick = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id)
  }

  //댓글 작성하기 함수
  const handleCommentSubmit = (id, newComment) => {
    setDiaryEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, comments: [...entry.comments, newComment] }
          : entry,
      ),
    )
    console.log(diaryEntries)
  }

  //연속 일수 계산
  const consecutiveDays = getConsecutiveDays(attendance)

  const navigate = useNavigate()
  const MyLikesClick = () => {
    navigate('/myLikes')
  }

  //JSX
  return (
    <div className='myProfile-container'>
      <div className='profile-header'>
        <h1>{nickname}님, 매일 독서기록을 쓰고 선물 받아가세요</h1>
        <div className='profile-info'>
          <div>연속 기록: {consecutiveDays}일차</div>
          <div>완독률: {readingProgress * 100}%</div>
          <div>읽은 쪽수: {readPages}쪽</div>
          <button onClick={() => MyLikesClick()}>좋아요한 글</button>
        </div>
      </div>
      <div className='diary-container'>
        {diaryEntries.map((entry) => (
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
              <div>□(댓글수) {entry.comments.length}개</div>
            </div>
            {expandedEntryId === entry.id && (
              <div className='comments-section'>
                {entry.comments.map((comment, index) => (
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyProfile
