import React from 'react'
import styles from './WriteForm.module.css'

const WriteForm = ({ formData, handleChange, handleSubmit, error }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h1>오늘은 독서 일지를 작성해볼까요?</h1>
      <div>
        <input
          type='text'
          name='startPage'
          value={formData.startPage}
          onChange={handleChange}
        />
        <span>페이지</span> <span>~</span>
        <input
          type='text'
          name='endPage'
          value={formData.endPage}
          onChange={handleChange}
        />
        <span>페이지</span>
      </div>
      <div>
        <div>제목</div>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <div>본문</div>
        <textarea
          name='content'
          value={formData.content}
          onChange={handleChange}
        />
      </div>
      <small>* 300자 이상 작성해야 해요!</small>
      {error && <p className={styles.error}>{error}</p>}
      <button type='submit'>업로드 하기</button>
    </form>
  )
}

export default WriteForm
