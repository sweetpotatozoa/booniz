import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import WriteForm from '../../components/WriteForm.js/WriteForm'
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
      setError('시작 페이지는 끝 페이지보다 더 클 수 없습니다.')
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
        <WriteForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error={error}
        />
      </div>
    </>
  )
}

export default Write
