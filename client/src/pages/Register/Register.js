import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Register.module.css'

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    realName: '',
    phoneNumber: '',
    age: '',
    nickName: '',
    inflowChannel: '',
  })
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState(
    '영어와 숫자로 조합된 8자리 이상의 비밀번호',
  )
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // 비밀번호 유효성 검사
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordPattern.test(formData.password)) {
      setPasswordError(
        '비밀번호는 영어와 숫자를 포함한 8자리 이상이어야 합니다.',
      )
      return
    }

    try {
      const result = await BackendApis.register('POST', formData)

      if (
        result &&
        result.message === '회원가입에 성공하였습니다. 로그인해주세요.'
      ) {
        console.log(result)
        navigate('/login')
      } else {
        setError(result.message || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      setError(error.message)
    }
  }

  const handlePasswordFocus = () => {
    setPasswordError('영어와 숫자로 조합된 8자리 이상의 비밀번호')
  }

  return (
    <>
      <NavBar />
      <div className={styles.registerContainer}>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <h2>회원가입</h2>
          <div className={styles.inputGroup}>
            <label htmlFor='userName'>이메일</label>
            <input
              type='email'
              id='userName'
              name='userName'
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder='이메일을 입력해주세요'
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='password'>비밀번호</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              onFocus={handlePasswordFocus}
              required
              placeholder='비밀번호를 입력해주세요'
              className={styles.input}
            />
            {passwordError && (
              <div className={styles.passwordError}>{passwordError}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='realName'>이름</label>
            <input
              type='text'
              id='realName'
              name='realName'
              value={formData.realName}
              onChange={handleChange}
              required
              placeholder='이름을 입력해주세요'
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='phoneNumber'>전화번호</label>
            <input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder='전화번호를 입력해주세요'
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='age'>나이</label>
            <input
              type='number'
              id='age'
              name='age'
              value={formData.age}
              onChange={handleChange}
              required
              placeholder='나이를 입력해주세요'
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='nickName'>닉네임</label>
            <input
              type='text'
              id='nickName'
              name='nickName'
              value={formData.nickName}
              onChange={handleChange}
              required
              placeholder='닉네임을 입력해주세요'
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='inflowChannel'>가입 경로</label>
            <input
              type='text'
              id='inflowChannel'
              name='inflowChannel'
              value={formData.inflowChannel}
              onChange={handleChange}
              required
              placeholder='가입 경로를 입력해주세요'
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type='submit' className={styles.button}>
            회원가입 하기
          </button>
        </form>
      </div>
    </>
  )
}

export default Register
