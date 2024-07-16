import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import styles from './Edit.module.css'
import WriteForm from '../../components/WriteForm.js/WriteForm'
import NavBar from '../../components/NavBar/NavBar'

const Edit = () => {
  const { reviewId } = useParams()
  const [error, setError] = useState('')
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
    setError('')
    const { title, content, startPage, endPage } = reviewData
    if (title.length > 50) {
      setError('제목은 50자 이하여야 합니다.')
      return
    }
    if (content.length < 100) {
      setError('내용은 100자 이상이어야 합니다.')
      return
    }
    if (isNaN(startPage) || isNaN(endPage)) {
      setError('시작 페이지와 끝 페이지는 숫자여야 합니다.')
      return
    }
    if (Number(startPage) > Number(endPage)) {
      setError('시작 페이지는 끝 페이지보다 더 클 수 없습니다.')
      return
    }

    try {
      const result = await BackendApis.updateMyReview('PUT', {
        reviewId,
        reviewData,
      })
      if (result && result.acknowledged) {
        navigate('/')
      } else {
        setError('글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('글 작성에 실패했습니다.')
    }
  }

  if (loading) return <p>Loading...</p> // 로딩 상태 표시

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1>리뷰 수정하기</h1>
        <WriteForm
          formData={reviewData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error
          // reviewId={reviewId}
        />
      </div>
    </>
  )
}

export default Edit
