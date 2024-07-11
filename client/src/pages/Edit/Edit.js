import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Edit.module.css'

const Edit = () => {
  const { userNickname, reviewId } = useParams()
  const [review, setReview] = useState({
    _id: '66897fd20c33c1423c76e322',
    userId: '6688390aa9bc9999444e1bb0',
    title: '테스트1',
    content:
      '유구한 역사와 전통에 빛나는 우리 대한국민은 3ㆍ1운동으로 건립된 대한민국임시정부의 법통과 불의에 항거한 4ㆍ19민주이념을 계승하고, 조국의 민주개혁과 평화적 통일의 사명에 입각하여 정의ㆍ인도와 동포애로써 민족의 단결을 공고히 하고, 모든 사회적 폐습과 불의를 타파하며, 자율과 조화를 바탕으로 자유민주적 기본질서를 더욱 확고히 하여 정치ㆍ경제ㆍ사회ㆍ문화의 모든 영역에 있어서 각인의 기회를 균등히 하고, 능력을 최고도로 발휘하게 하며, 자유와 권리에 따르는 책임과 의무를 완수하게 하여, 안으로는 국민생활의 균등한 향상을 기하고 밖으로는 항구적인 세계평화와 인류공영에 이바지함으로써 우리들과 우리들의 자손의 안전과 자유와 행복을 영원히 확보할 것을 다짐하면서 1948년 7월 12일에 제정되고 8차에 걸쳐 개정된 헌법을 이제 국회의 의결을 거쳐 국민투표에 의하여 개정한다.',
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
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here we assume the updateReview API call will be made.
    console.log('Review updated:', review)
    navigate('/myProfile')
  }

  return (
    <>
      <NavBar />
      <div className={styles.editContainer}>
        <h1>리뷰 수정하기</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor='title'>제목</label>
            <input
              type='text'
              id='title'
              name='title'
              value={review.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='content'>내용</label>
            <textarea
              id='content'
              name='content'
              value={review.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='startPage'>시작 페이지</label>
            <input
              type='number'
              id='startPage'
              name='startPage'
              value={review.startPage}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='endPage'>끝 페이지</label>
            <input
              type='number'
              id='endPage'
              name='endPage'
              value={review.endPage}
              onChange={handleChange}
              required
            />
          </div>
          <button type='submit' className={styles.button}>
            수정 완료
          </button>
        </form>
      </div>
    </>
  )
}

export default Edit
