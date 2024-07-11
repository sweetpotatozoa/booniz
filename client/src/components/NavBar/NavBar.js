import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NavBar.module.css'

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className='logo'>
        <img src='로고_이미지_링크' alt='Logo' />
      </div>
      <div className={styles.links}>
        <div className={styles.link}>
          <Link to='/'>홈</Link>
        </div>
        <div className={styles.link}>
          <Link to='/myProfile'>내 독서일지</Link>
        </div>
        <div className={styles.link}>
          <Link to='/community'>게시판</Link>
        </div>
        <div className={styles.link2}>
          <Link to='/write'>일지 쓰기</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
