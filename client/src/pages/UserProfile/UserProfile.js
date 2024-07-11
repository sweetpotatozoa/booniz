import React, { useState } from 'react'
import truncateContent from '../../utils/truncateContent'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import { useNavigate } from 'react-router'
import NavBar from '../../components/NavBar/NavBar'
import styles from './UserProfile.module.css'

const UserProfile = () => {
  // 예시 데이터들
  const [userData, setUserData] = useState({
    nickName: '김첨지',
    readPages: 30,
    allPages: 100,
    dailyStatus: [1, 1, 0, 1, 1, 0, 1, 1, 1],
    reviews: [
      {
        _id: '66897fd20c33c1423c76e322',
        userId: '6688390aa9bc9999444e1bb0',
        title: '독서일지 제목1',
        content:
          '대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다. 국회와 정부는 국민의 뜻을 받들어 정의롭고 투명한 사회를 만들어 나가야 한다. 이러한 가치는 헌법에 명시되어 있으며, 이는 우리의 소중한 자산이다. 우리는 이를 통해 민주주의의 꽃을 피워가야 한다. 국민은 투표를 통해 자신들의 대표를 선출하고, 그 대표들은 국민의 목소리를 대변해야 한다. 이로 인해 사회는 보다 나은 방향으로 나아갈 수 있다.',
        startPage: 0,
        endPage: 100,
        createdAt: '2024-07-07T02:33:06',
        updatedAt: '2024-07-07T02:33:06',
        likedBy: ['user1', 'user2'],
        comments: [
          {
            _id: '668552528965ae3ef16fd2ad',
            content: '댓글1',
            createdAt: '2001-02-28T15:00:00.000+00:00',
            reviewId: '66897fd20c33c1423c76e322',
            userId: '668550c08965ae3ef16fd2a4',
          },
          {
            _id: '668552528965ae3ef16fd2ae',
            content: '댓글2',
            createdAt: '2001-03-01T15:00:00.000+00:00',
            reviewId: '66897fd20c33c1423c76e322',
            userId: '668550c08965ae3ef16fd2a5',
          },
        ],
      },
      {
        _id: '66897fd20c33c1423c76e323',
        userId: '6688390aa9bc9999444e1bb1',
        title: '독서일지 제목2',
        content:
          '국회의원은 국민의 대표로서, 그들의 책임과 의무를 다해야 한다. 국민의 목소리를 경청하고, 그들의 요구를 반영하는 법안을 마련해야 한다. 이는 국회의원의 가장 중요한 역할 중 하나이다. 또한, 정부는 국민의 안전과 복지를 책임져야 하며, 이를 위해 최선을 다해야 한다. 우리의 사회는 공정하고 정의로운 방향으로 나아가야 한다. 이를 위해서는 국민 모두가 함께 노력해야 한다. 민주주의의 기본 원칙을 준수하고, 서로 존중하며 협력해야 한다.',
        startPage: 101,
        endPage: 200,
        createdAt: '2024-07-08T02:33:06',
        updatedAt: '2024-07-08T02:33:06',
        likedBy: ['user3', 'user4'],
        comments: [
          {
            _id: '668552528965ae3ef16fd2af',
            content: '댓글3',
            createdAt: '2001-04-28T15:00:00.000+00:00',
            reviewId: '66897fd20c33c1423c76e323',
            userId: '668550c08965ae3ef16fd2a6',
          },
        ],
      },
    ],
  })

  const navigate = useNavigate()
  const handleEntryClick = (id) => {
    setUserData((prevState) => ({
      ...prevState,
      reviews: prevState.reviews.map((entry) =>
        entry._id === id
          ? { ...entry, expanded: !entry.expanded }
          : { ...entry, expanded: false },
      ),
    }))
  }

  const handleCommentSubmit = (id, newComment) => {
    setUserData((prevState) => ({
      ...prevState,
      reviews: prevState.reviews.map((entry) =>
        entry._id === id
          ? { ...entry, comments: [...entry.comments, newComment] }
          : entry,
      ),
    }))
  }

  // 연속 일수 계산
  const consecutiveDays = getConsecutiveDays(userData.dailyStatus)

  // JSX
  return (
    <>
      <NavBar />
      <div className={styles.userProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님의 프로필이에요</h1>
          <div className={styles.profileInfo}>
            <div>
              <img src='/' alt='프로필사진'></img>
              <div>{userData.nickName}님</div>
            </div>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>완독률: {(userData.readPages / userData.allPages) * 100}%</div>
            <div>읽은 쪽수: {userData.readPages}쪽</div>
          </div>
        </div>
        <div className={styles.reviewContainer}>
          {userData.reviews.map((entry) => (
            <div key={entry._id} className={styles.reviewEntry}>
              <div onClick={() => handleEntryClick(entry._id)}>
                <h3>{entry.title}</h3>
                <small>{entry.createdAt.split('T')[0]}</small>
                <p>
                  {entry.expanded
                    ? entry.content
                    : truncateContent(entry.content, 150)}
                </p>
                <div>❤ {entry.likedBy.length}개</div>
                <div>□ {entry.comments.length}개</div>
              </div>
              {entry.expanded && (
                <div className={styles.commentsSection}>
                  {entry.comments.map((comment) => (
                    <p key={comment._id}>{comment.content}</p>
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default UserProfile
