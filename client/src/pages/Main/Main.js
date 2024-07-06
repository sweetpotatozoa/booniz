import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import truncateContent from '../../utils/truncateContent'
import './Main.css'

const Main = () => {
  //예시 데이터 입력
  const [nickname, setNickname] = useState('홍길동')
  const [readingProgress, setReadingProgress] = useState(0.5) // 50%
  const [readPages, setReadPages] = useState(50)
  const [totalPages, setTotalPages] = useState(100)
  const [attendance, setAttendance] = useState([1, 1, 0, 1, 1, 0, 1, 1, 1, 0])
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 1,
      title: '독서일지 제목',
      content:
        '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회와 정부는 국민의 뜻을 받들어 정의롭고 투명한 사회를 만들어 나가야 한다. 이러한 가치는 헌법에 명시되어 있으며, 이는 우리의 소중한 자산이다. 우리는 이를 통해 민주주의의 꽃을 피워가야 한다. 국민은 투표를 통해 자신들의 대표를 선출하고, 그 대표들은 국민의 목소리를 대변해야 한다. 이로 인해 사회는 보다 나은 방향으로 나아갈 수 있다.',
      date: '2024.00.00',
    },
    {
      id: 2,
      title: '독서일지 제목',
      content:
        '국회의원은 국민의 대표로서, 그들의 책임과 의무를 다해야 한다. 국민의 목소리를 경청하고, 그들의 요구를 반영하는 법안을 마련해야 한다. 이는 국회의원의 가장 중요한 역할 중 하나이다. 또한, 정부는 국민의 안전과 복지를 책임져야 하며, 이를 위해 최선을 다해야 한다. 우리의 사회는 공정하고 정의로운 방향으로 나아가야 한다. 이를 위해서는 국민 모두가 함께 노력해야 한다. 민주주의의 기본 원칙을 준수하고, 서로 존중하며 협력해야 한다.',
      date: '2024.00.00',
    },
  ])

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
