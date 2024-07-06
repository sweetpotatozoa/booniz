import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Write = () => {
  const [startPage, setStartPage] = useState('')
  const [endPage, setEndPage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/api/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startPage,
        endPage,
        title,
        content,
      }),
    })

    if (response.ok) {
      // 글 작성 성공 시 처리
      const data = await response.json()
      console.log('글 작성 성공:', data)
      navigate('/') // 메인 페이지로 리다이렉트
    } else {
      // 글 작성 실패 시 처리
      setError('글 작성에 실패했습니다.')
    }
  }

  const handleSave = () => {
    // 수정하기 버튼을 클릭했을 때 처리할 내용
    navigate('/')
  }

  return (
    <div className='write-container'>
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
  )
}

export default Write
