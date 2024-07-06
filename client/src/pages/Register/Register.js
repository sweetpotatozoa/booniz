import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [nickname, setNickname] = useState('')
  const [referral, setReferral] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleMainRedirect = () => {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        phone,
        birthdate,
        nickname,
        referral,
      }),
    })

    if (response.ok) {
      // 회원가입 성공 시 처리
      const data = await response.json()
      console.log('회원가입 성공:', data)
    } else {
      // 회원가입 실패 시 처리
      setError('회원가입에 실패했습니다.')
    }
  }

  return (
    <div className='register-container'>
      <form onSubmit={handleSubmit} className='register-form'>
        <h2>회원가입</h2>
        <div className='input-group'>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='이메일을 입력해주세요'
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
          />
          <small>영어+숫자 8자 이상</small>
        </div>
        <div className='input-group'>
          <label htmlFor='name'>이름</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='이름을 입력해주세요'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='phone'>전화번호</label>
          <input
            type='tel'
            id='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder='전화번호를 입력해주세요'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='birthdate'>생년월일</label>
          <input
            type='date'
            id='birthdate'
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            placeholder='2000.00.00'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='nickname'>닉네임</label>
          <input
            type='text'
            id='nickname'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            placeholder='닉네임을 입력해주세요'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='referral'>가입 경로</label>
          <input
            type='text'
            id='referral'
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            required
            placeholder='가입 경로를 입력해주세요'
          />
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit' className='button' onClick={handleMainRedirect}>
          회원가입 하기
        </button>
      </form>
    </div>
  )
}

export default Register
