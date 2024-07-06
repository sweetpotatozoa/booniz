import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackendApis from '../../utils/backendApis'

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
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const result = await BackendApis.register('POST', formData)

      if (!result || result.error) {
        throw new Error(result.message || '회원가입에 실패했습니다.')
      }

      navigate('/login')
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  return (
    <div className='register-container'>
      <form onSubmit={handleRegister} className='register-form'>
        <h2>회원가입</h2>
        <div className='input-group'>
          <label htmlFor='userName'>이메일</label>
          <input
            type='email'
            id='userName'
            name='userName'
            value={formData.userName}
            onChange={handleChange}
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
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            placeholder='비밀번호를 입력해주세요'
            className='input'
          />
          <small>영어와 숫자로 조합된 8자리 이상의 비밀번호</small>
        </div>
        <div className='input-group'>
          <label htmlFor='realName'>이름</label>
          <input
            type='text'
            id='realName'
            name='realName'
            value={formData.realName}
            onChange={handleChange}
            required
            placeholder='이름을 입력해주세요'
            className='input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='phoneNumber'>전화번호</label>
          <input
            type='text'
            id='phoneNumber'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder='전화번호를 입력해주세요'
            className='input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='age'>나이</label>
          <input
            type='number'
            id='age'
            name='age'
            value={formData.age}
            onChange={handleChange}
            required
            placeholder='나이를 입력해주세요'
            className='input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='nickName'>닉네임</label>
          <input
            type='text'
            id='nickName'
            name='nickName'
            value={formData.nickName}
            onChange={handleChange}
            required
            placeholder='닉네임을 입력해주세요'
            className='input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='inflowChannel'>가입 경로</label>
          <input
            type='text'
            id='inflowChannel'
            name='inflowChannel'
            value={formData.inflowChannel}
            onChange={handleChange}
            required
            placeholder='가입 경로를 입력해주세요'
            className='input'
          />
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit' className='button'>
          회원가입 하기
        </button>
      </form>
    </div>
  )
}

export default Register
