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
  const [passwordError, setPasswordError] = useState('')
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
    setPasswordError('')
  }

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2 style={{ fontSize: '32px' }}>회원가입</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.section}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
              로그인 정보
            </h3>
            <div className={styles.inputGroup}>
              <input
                type='email'
                id='userName'
                name='userName'
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder='이메일'
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                required
                placeholder='비밀번호(영어+숫자 8자 이상)'
                className={styles.input}
              />
              {passwordError && (
                <div className={styles.passwordError}>{passwordError}</div>
              )}
            </div>
          </div>
          <div className={styles.section}>
            <h3
              style={{
                fontSize: '20px',
                marginBottom: '8px',
                marginTop: '20px',
              }}
            >
              인적사항
            </h3>
            <div className={styles.inputGroup}>
              <input
                type='text'
                id='realName'
                name='realName'
                value={formData.realName}
                onChange={handleChange}
                required
                placeholder='이름'
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type='text'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder='전화번호'
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type='number'
                id='age'
                name='age'
                value={formData.age}
                onChange={handleChange}
                required
                placeholder='생년월일 (2000.00.00)'
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type='text'
                id='nickName'
                name='nickName'
                value={formData.nickName}
                onChange={handleChange}
                required
                placeholder='닉네임(나중에 변경이 불가능합니다)'
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <select
                id='inflowChannel'
                name='inflowChannel'
                value={formData.inflowChannel}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value='' disabled>
                  가입 경로를 선택하세요
                </option>
                <option value='지인 추천'>지인 추천</option>
                <option value='블라인드'>블라인드</option>
                <option value='인스타그램'>인스타그램</option>
                <option value='기타'>기타</option>
              </select>
            </div>
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
