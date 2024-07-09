import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Edit.module.css'

const Edit = () => {
  const { userNickname, reviewId } = useParams()
  const [review, setReview] = useState({
    title: '',
    content: '',
    startPage: 0,
    endPage: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const result = await BackendApis.getReview(reviewId)
        if (result) {
          setReview(result)
        }
      } catch (error) {
        console.error('Error fetching review:', error)
      }
    }

    fetchReview()
  }, [reviewId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await BackendApis.updateReview(reviewId, review)
      if (result) {
        navigate('/myProfile')
      }
    } catch (error) {
      console.error('Error updating review:', error)
    }
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
