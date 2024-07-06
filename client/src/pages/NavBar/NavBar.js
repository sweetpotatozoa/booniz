import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='navbar'>
      <div className='logo'>
        <img src='로고_이미지_링크' alt='Logo' />
      </div>
      <ul className='nav-links'>
        <li>
          <Link to='/'>홈</Link>
        </li>
        <li>
          <Link to='/myProfile'>내 독서일지</Link>
        </li>
        <li>
          <Link to='/community'>커뮤니티</Link>
        </li>
        <li>
          <Link to='/write'>독서일지 쓰기</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
