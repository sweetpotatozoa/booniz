import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import styles from './Edit.module.css'

const Edit = () => {
  const { userId, reviewId } = useParams()
  const navigate = useNavigate()
  const [reviewData, setReviewData] = useState({
    title: '',
    content: '',
    startPage: '',
    endPage: '',
  })

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const result = await BackendApis.getMyReview(userId, reviewId)
        if (result) {
          setReviewData(result)
        }
      } catch (error) {
        console.error('Error fetching review data:', error)
      }
    }

    fetchReview()
  }, [userId, reviewId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReviewData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await BackendApis.updateMyReview(reviewId, userId, reviewData)
      navigate(`/userProfile/${userId}`)
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  return (
    <div className={styles.editContainer}>
      <h1>리뷰 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            name='title'
            value={reviewData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='content'>내용</label>
          <textarea
            id='content'
            name='content'
            value={reviewData.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='startPage'>시작 페이지</label>
          <input
            type='number'
            id='startPage'
            name='startPage'
            value={reviewData.startPage}
            onChange={handleChange}
          />
        </div>
        <div>
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
