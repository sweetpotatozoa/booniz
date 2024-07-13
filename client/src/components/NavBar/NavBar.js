import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NavBar.module.css'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  const goToHome = () => {
    navigate('/')
  }
  const goToMyProfile = () => {
    navigate('/myProfile')
  }
  const goToCommunity = () => {
    navigate('/community')
  }
  const goToWrite = () => {
    navigate('/write')
  }

  return (
    <nav className={styles.navbar}>
      <div className='logo'>
        <img src='/images/logo.svg' alt='Logo' />
      </div>
      <div className={styles.links}>
        <div className={styles.link} onClick={goToHome}>
          홈
        </div>
        <div className={styles.link} onClick={goToMyProfile}>
          내 독서일지
        </div>
        <div className={styles.link} onClick={goToCommunity}>
          게시판
        </div>
        <div className={styles.link2} onClick={goToWrite}>
          일지 쓰기
        </div>
      </div>
    </nav>
  )
}

export default NavBar
