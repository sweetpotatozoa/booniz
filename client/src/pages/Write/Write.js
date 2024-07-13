import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Write.module.css'

const Write = () => {
  const [formData, setFormData] = useState({
    startPage: '',
    endPage: '',
    title: '',
    content: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate inputs on the client-side before sending to the server
    const { title, content, startPage, endPage } = formData
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
      setError('시작 페이지는 끝 페이지 보다 더 클 수 없습니다.')
      return
    }

    try {
      const result = await BackendApis.createReview('POST', formData)

      if (result && result.acknowledged) {
        navigate('/')
      } else {
        setError('글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('글 작성에 실패했습니다.')
    }
  }

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
              name='startPage'
              value={formData.startPage}
              onChange={handleChange}
              placeholder='시작 쪽수'
              required
            />
            <span>~</span>
            <input
              type='number'
              id='endPage'
              name='endPage'
              value={formData.endPage}
              onChange={handleChange}
              placeholder='끝 쪽수'
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor='title'>제목</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='제목을 입력하세요'
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor='content'>본문</label>
            <textarea
              id='content'
              name='content'
              value={formData.content}
              onChange={handleChange}
              placeholder='내용을 입력하세요'
              required
            ></textarea>
          </div>
          {error && <p className='error'>{error}</p>}
          <div className='button-group'>
            <button type='submit' className='submit-button'>
              업로드 하기
            </button>
            <button
              type='button'
              className='save-button'
              onClick={() => navigate('/')}
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Write
