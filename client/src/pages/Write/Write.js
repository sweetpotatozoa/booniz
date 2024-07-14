import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Write.module.css'

const Write = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startPage: '',
    endPage: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { title, content, startPage, endPage } = formData

    // console.log(formData)

    // Client-side validation
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
      <div className={styles.writeContainer}>
        <h1>글 작성하기</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>제목</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>내용</label>
            <textarea
              name='content'
              value={formData.content}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>시작 페이지</label>
            <input
              type='text'
              name='startPage'
              value={formData.startPage}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>끝 페이지</label>
            <input
              type='text'
              name='endPage'
              value={formData.endPage}
              onChange={handleChange}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type='submit'>작성하기</button>
        </form>
      </div>
    </>
  )
}

export default Write
