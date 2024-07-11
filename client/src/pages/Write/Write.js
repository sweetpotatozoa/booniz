import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Write.module.css'

const Write = () => {
  const { reviewId } = useParams()
  const [startPage, setStartPage] = useState('')
  const [endPage, setEndPage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = reviewId
        ? await BackendApis.updateReview(reviewId, {
            startPage,
            endPage,
            title,
            content,
          })
        : await BackendApis.createReview('POST', {
            startPage,
            endPage,
            title,
            content,
          })

      if (response.ok) {
        navigate('/')
      } else {
        setError('글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('글 작성에 실패했습니다.')
    }
  }

  const handleSave = () => {
    navigate('/')
  }

  useEffect(() => {
    const fetchReview = async () => {
      if (reviewId) {
        const result = await BackendApis.getMyReview(reviewId)
        if (result) {
          setStartPage(result.startPage)
          setEndPage(result.endPage)
          setTitle(result.title)
          setContent(result.content)
        }
      }
    }
    fetchReview()
  }, [reviewId])

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2>오늘의 독서기록을 작성해 볼까요?</h2>
        <form onSubmit={handleSubmit} className='write-form'>
          <div className='input-group'>
            <label htmlFor='startPage'>읽은 쪽수</label>
            <input
              type='number'
              id='startPage'
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              placeholder='시작 쪽수'
              required
            />
            <span>~</span>
            <input
              type='number'
              id='endPage'
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              placeholder='끝 쪽수'
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor='title'>제목</label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목을 입력하세요'
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor='content'>본문</label>
            <textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='내용을 입력하세요'
              required
            ></textarea>
          </div>
          {error && <p className='error'>{error}</p>}
          <div className='button-group'>
            <button type='submit' className='submit-button'>
              업로드 하기
            </button>
            <button type='button' className='save-button' onClick={handleSave}>
              수정하기
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Write
