import React, { useState } from 'react'
import truncateContent from '../../utils/truncateContent'
import getConsecutiveDays from '../../utils/getConsecutiveDays'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './MyProfile.module.css'
import moment from 'moment'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    nickName: '상우',
    readPages: 10,
    allPages: 100,
    dailyStatus: [1, 1, 0, 1, 1, 0, 1, 1, 1],
    reviews: [
      {
        _id: '66897fd20c33c1423c76e322',
        userId: '6688390aa9bc9999444e1bb0',
        title: '테스트1',
        content:
          '유구한 역사와 전통에 빛나는 우리 대한국민은 3ㆍ1운동으로 건립된 대한민국임시정부의 법통과 불의에 항거한 4ㆍ19민주이념을 계승하고...',
        startPage: 0,
        endPage: 30,
        createdAt: '2024-07-07T02:33:06',
        updatedAt: '2024-07-07T02:33:06',
        likedBy: [],
        comments: [
          {
            _id: '668552528965ae3ef16fd2ad',
            content: 'comment1',
            createdAt: '2001-02-28T15:00:00.000+00:00',
            reviewId: '668551d88965ae3ef16fd2a6',
            userId: '668550c08965ae3ef16fd2a4',
          },
          {
            _id: '668552528965ae3ef16fd2ae',
            content: 'comment2',
            createdAt: '2001-03-01T15:00:00.000+00:00',
            reviewId: '668551d88965ae3ef16fd2a7',
            userId: '668550c08965ae3ef16fd2a5',
          },
        ],
      },
      {
        _id: '66897fd20c33c1423c76e323',
        userId: '6688390aa9bc9999444e1bb1',
        title: '테스트2',
        content:
          '국회의원은 국민의 대표로서, 그들의 책임과 의무를 다해야 한다...',
        startPage: 30,
        endPage: 60,
        createdAt: '2024-07-08T02:33:06',
        updatedAt: '2024-07-08T02:33:06',
        likedBy: [],
        comments: [
          {
            _id: '668552528965ae3ef16fd2af',
            content: 'comment3',
            createdAt: '2001-04-28T15:00:00.000+00:00',
            reviewId: '668551d88965ae3ef16fd2a8',
            userId: '668550c08965ae3ef16fd2a6',
          },
        ],
      },
    ],
  })

  // Sample users data
  const users = [
    {
      _id: '668550c08965ae3ef16fd2a4',
      nickName: '닉네임1',
    },
    {
      _id: '668550c08965ae3ef16fd2a5',
      nickName: '닉네임2',
    },
    {
      _id: '668550c08965ae3ef16fd2a6',
      nickName: '닉네임3',
    },
  ]

  const navigate = useNavigate()
  const challengeStartDate = moment('2024-07-07')

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

  // 댓글 제출하기 함수
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

  const handleEditClick = (id) => {
    navigate(`/edit/${userData.nickName}/${id}`)
  }

  const handleDeleteClick = async (id) => {
    const result = await BackendApis.deleteReview(id)
    if (result) {
      setUserData((prevState) => ({
        ...prevState,
        reviews: prevState.reviews.filter((entry) => entry._id !== id),
      }))
    }
  }

  const consecutiveDays = getConsecutiveDays(userData.dailyStatus)

  return (
    <>
      <NavBar />
      <div className={styles.myProfileContainer}>
        <div className={styles.profileHeader}>
          <h1>{userData.nickName}님, 매일 독서기록을 쓰고 선물 받아가세요</h1>
          <div className={styles.profileInfo}>
            <div>
              <img src='/' alt='프로필사진'></img>
              <div>{userData.nickName}님</div>
            </div>
            <div>연속 기록: {consecutiveDays}일차</div>
            <div>완독률: {(userData.readPages / userData.allPages) * 100}%</div>
            <div>읽은 쪽수: {userData.readPages}쪽</div>
            <button onClick={() => navigate('/myLikes')}>좋아요한 글</button>
          </div>
        </div>
        <div className={styles.reviewContainer}>
          {userData.reviews.length > 0 ? (
            userData.reviews.map((entry) => {
              const reviewDate = moment(entry.createdAt)
              const dayDifference =
                reviewDate.diff(challengeStartDate, 'days') + 1
              return (
                <div key={entry._id} className={styles.reviewEntry}>
                  <div onClick={() => handleEntryClick(entry._id)}>
                    <div>{dayDifference}일차 독서일지</div>
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
                      {entry.comments.map((comment) => {
                        const commentUser = users.find(
                          (user) => user._id === comment.userId,
                        )
                        return (
                          <p key={comment._id}>
                            {comment.content} - {commentUser.nickName} (
                            {moment(comment.createdAt).format('YYYY-MM-DD')})
                          </p>
                        )
                      })}
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
                  <div className={styles.pageInfo}>
                    {entry.startPage}p ~ {entry.endPage}p
                  </div>
                </div>
              )
            })
          ) : (
            <p>독서 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default MyProfile
