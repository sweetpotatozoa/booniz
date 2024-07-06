import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('로그인 성공:', data)
      // 로그인 성공 시 처리
    } else {
      setError('로그인에 실패했습니다.')
    }
  }

  const handleRegisterRedirect = () => {
    navigate('/register')
  }

  return (
    <div className='login-container'>
      <form onSubmit={handleLogin} className='login-form'>
        <h2>로그인</h2>
        <div className='input-group'>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='이메일을 입력해주세요'
            className='input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='password'>비밀번호</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='비밀번호를 입력해주세요'
            className='input'
          />
          <small>영어와 숫자로 조합된 8자리 이상의 비밀번호</small>
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit' className='button'>
          로그인
        </button>
        <button
          type='button'
          className='register-button'
          onClick={handleRegisterRedirect}
        >
          회원가입
        </button>
      </form>
    </div>
  )
}

export default Login
