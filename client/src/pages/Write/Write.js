import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import WriteForm from '../../components/WriteForm.js/WriteForm'
import styles from './Write.module.css'
import { useEffect } from 'react'

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
    const newFormdata = {
      ...formData,
      startPage: Number(startPage),
      endPage: Number(endPage),
    }
    if (title.length > 50) {
      setError('제목은 50자 이하여야 합니다.')
      return
    }
    if (!title?.trim()) {
      setError('제목을 입력하세요')
      return
    }
    if (content.length < 300) {
      setError('내용은 300자 이상이어야 합니다.')
      return
    }
    if (!startPage?.trim() || !endPage?.trim()) {
      setError('시작 페이지와 끝 페이지를 입력해주세요.')
      return
    }
    if (Number(startPage) > Number(endPage)) {
      setError('시작 페이지는 끝 페이지보다 더 클 수 없습니다.')
      return
    }
    if (
      !Number.isInteger(Number(startPage)) ||
      Number(startPage) <= 0 ||
      !Number.isInteger(Number(endPage)) ||
      Number(endPage) <= 0
    ) {
      setError('페이지는 자연수여야 합니다.')
      return
    }

    try {
      const result = await BackendApis.createReview('POST', newFormdata)
      if (result && result.acknowledged) {
        navigate('/')
      } else {
        console.log('result.message:', result.message)
        if (
          result.message ===
          '오늘 이미 일지를 작성하셨습니다. 다음 일지는 내일 작성해 주세요.'
        ) {
          setError(
            '하루에 하나의 일지만 작성할 수 있습니다. 자정 이후에 다시 시도해주세요.',
          )
        } else {
          setError('글 작성에 실패했습니다.')
        }
      }
    } catch (error) {
      setError('글 작성에 실패했습니다.')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    // console.log(token)

    if (!token || token === '') {
      navigate('/login')
    }
  }, [])

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
