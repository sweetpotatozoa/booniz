import React from 'react'
import styles from './WriteForm.module.css'

const WriteForm = ({ formData, handleChange, handleSubmit, error }) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>오늘의 독서 일지를 작성해볼까요?</h1>
      <div className={styles.pages}>
        읽은 쪽수
        <div className={styles.page}>
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
      </div>
      <div className={styles.container}>
        <div className={styles.title}>제목</div>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.title}>본문</div>
        <textarea
          name='content'
          value={formData.content}
          onChange={handleChange}
          className={styles.input}
          style={{ height: '176px' }}
        />
      </div>
      <div className={styles.bottom}>
        <div className={styles.text} id='text'>
          <div className={styles.detail}>* 300자 이상 작성해야 해요!</div>
          {error ? <div className={styles.error}>{error}</div> : null}
        </div>
        <button type='submit'>업로드 하기</button>
      </div>
    </form>
  )
}

export default WriteForm
