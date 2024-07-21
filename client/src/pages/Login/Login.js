import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Login.module.css'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const result = await BackendApis.login('POST', { userName, password })

      if (!result || !result.token) {
        throw new Error(result.message || 'Invalid email or password')
      }

      navigate('/')
    } catch (error) {
      console.error('Error:', error)
      setError('잘못된 이메일 혹은 비밀번호 입니다.')
    }
  }

  const handleRegisterRedirect = () => {
    navigate('/register')
  }

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2 style={{ fontSize: '32px' }}>로그인</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputBox}>
            <label htmlFor='userName' className={styles.title}>
              이메일
            </label>
            <input
              type='email'
              id='userName'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder='이메일을 입력해주세요'
              className={styles.input}
              style={{ marginBottom: '24px' }}
            />
          </div>
          <div className={styles.inputBox}>
            <label htmlFor='password' className={styles.title}>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='비밀번호를 입력해주세요'
              className={styles.input}
              style={{ marginBottom: '8px' }}
            />
            <small style={{ fontSize: '13px', marginBottom: '28px' }}>
              * 영어와 숫자로 조합된 8자리 이상의 비밀번호
            </small>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type='submit' className={styles.button}>
            로그인
          </button>
          <button
            type='button'
            className={styles.button}
            onClick={handleRegisterRedirect}
            style={{ backgroundColor: '#ffffff', color: '#282828' }}
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
