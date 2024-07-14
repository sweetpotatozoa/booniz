import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import styles from './Edit.module.css'

const Edit = () => {
  const { reviewId } = useParams()
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    startPage: '',
    endPage: '',
  })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true) // 로딩 상태 추가

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const result = await BackendApis.getMyReview(reviewId)
        if (result) {
          setReviewData({
            title: result.title,
            content: result.content,
            startPage: result.startPage,
            endPage: result.endPage,
          })
        }
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 중 오류 발생:', error)
      } finally {
        setLoading(false) // 로딩 상태 업데이트
      }
    }

    fetchReview()
  }, [reviewId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReviewData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await BackendApis.updateMyReview(reviewId, reviewData)
      navigate(`/userProfile/${reviewId}`)
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error)
    }
  }

  if (loading) return <p>Loading...</p> // 로딩 상태 표시

  return (
    <div className={styles.container}>
      <h1>리뷰 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            name='title'
            value={reviewData.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            name='content'
            value={reviewData.content}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='startPage'>시작 페이지</label>
          <input
            type='number'
            id='startPage'
            name='startPage'
            value={reviewData.startPage}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='endPage'>끝 페이지</label>
          <input
            type='number'
            id='endPage'
            name='endPage'
            value={reviewData.endPage}
            onChange={handleChange}
          />
        </div>
        <button type='submit'>수정하기</button>
      </form>
    </div>
  )
}

export default Edit
