import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateContent from '../../utils/truncateContent'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Community = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-07-07'))
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 1,
      nickname: '닉네임1',
      title: '독서 기록의 제목',
      content:
        '국가는 여자의 복지와 권익의 향상을 위하여 노력하여야 한다. 위원은 정당에 가입하거나 정치에 관여할 수 없다. 정기회의의 회기는 100일을, 임시회의의 회기는 30일을 초과할 수 없다. 헌법재판소의 조직과 운영 기타 필요한 사항은 법률로 정한다. 공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다. 위원은 탄핵 또는 금고 이상의 형의 선고에 의하지 아니하고는 파면되지 아니한다. 모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가는 국민의 환경보전을 위하여 노력하여야 한다. 대통령의 임기가 만료된 때 또는 대통령이 궐위된 때 또는 대통령당선자가 사망하거나 사퇴하거나 기타의 사유로 그 자격을 상실한 때에는 60일 이내에 후임자를 선거한다. 모든 국민은 법 앞에 평등하다. 누구든지 생활능률 또는 사회적 신분에 의하여 정치적·경제적·사회적·문화적 생...',
      date: '2024-07-07',
      startPage: 0,
      endPage: 45,
      likes: 13,
      comments: ['댓글1', '댓글2'],
    },
    {
      id: 2,
      nickname: '닉네임2',
      title: '독서 기록의 제목',
      content:
        '국가는 여자의 복지와 권익의 향상을 위하여 노력하여야 한다. 위원은 정당에 가입하거나 정치에 관여할 수 없다. 정기회의의 회기는 100일을, 임시회의의 회기는 30일을 초과할 수 없다. 헌법재판소의 조직과 운영 기타 필요한 사항은 법률로 정한다. 공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은 법률로써 하되, 정당한 보상을 지급하여야 한다. 위원은 탄핵 또는 금고 이상의 형의 선고에 의하지 아니하고는 파면되지 아니한다. 모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가는 국민의 환경보전을 위하여 노력하여야 한다. 대통령의 임기가 만료된 때 또는 대통령이 궐위된 때 또는 대통령당선자가 사망하거나 사퇴하거나 기타의 사유로 그 자격을 상실한 때에는 60일 이내에 후임자를 선거한다. 모든 국민은 법 앞에 평등하다. 누구든지 생활능률 또는 사회적 신분에 의하여 정치적·경제적·사회적·문화적 생...',
      date: '2024-07-07',
      startPage: 46,
      endPage: 90,
      likes: 10,
      comments: ['댓글1', '댓글2'],
    },
    {
      id: 3,
      nickname: '닉네임3',
      title: '다른 날짜의 기록',
      content: '이 내용은 선택된 날짜와 일치하지 않습니다.',
      date: '2024-07-08',
      startPage: 91,
      endPage: 135,
      likes: 8,
      comments: ['댓글1'],
    },
  ])

  const [filteredEntries, setFilteredEntries] = useState([])

  useEffect(() => {
    setFilteredEntries(
      diaryEntries.filter(
        (entry) => entry.date === selectedDate.toISOString().split('T')[0],
      ),
    )
  }, [selectedDate, diaryEntries])

  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const navigate = useNavigate()

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

  const handlePreviousDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
  }

  const handleNextDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
  }

  const handleNicknameClick = (nickname, e) => {
    e.stopPropagation()
    navigate(`/userProfile/${nickname}`)
  }

  return (
    <div className='community-container'>
      <h1>다른 사람들은 어떤 기록을 썼을까요?</h1>
      <div className='date-picker'>
        <button onClick={handlePreviousDay}>
          <FaChevronLeft />
        </button>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat='yyyy-MM-dd'
        />
        <button onClick={handleNextDay}>
          <FaChevronRight />
        </button>
      </div>
      <div className='diary-container'>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div key={entry.id} className='diary-entry'>
              <div onClick={() => handleEntryClick(entry.id)}>
                <h3 onClick={(e) => handleNicknameClick(entry.nickname, e)}>
                  {entry.nickname}
                </h3>
                <h4>{entry.title}</h4>
                <small>{entry.date}</small>
                <p>
                  {expandedEntryId === entry.id
                    ? entry.content
                    : truncateContent(entry.content, 150)}
                </p>
                <div>
                  {entry.startPage}p~{entry.endPage}p
                </div>
                <div>❤ {entry.likes}개</div>
                <div>□ {entry.comments.length}개</div>
              </div>
              {expandedEntryId === entry.id && (
                <div className='comments-section'>
                  {entry.comments.map((comment, index) => (
                    <p key={index}>{comment}</p>
                  ))}
                  <input
                    type='text'
                    placeholder='댓글을 입력하세요'
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleCommentSubmit(entry.id, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const commentInput = e.target.previousSibling
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
          ))
        ) : (
          <p>선택된 날짜에 해당하는 독서 기록이 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default Community
