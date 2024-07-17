import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeLink, setActiveLink] = useState('/')

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location.pathname])

  const getLinkStyle = (paths) => {
    return paths.includes(activeLink)
      ? { borderBottom: '5px solid #FF7342', fontWeight: 'bold' }
      : {}
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <div className='logo'>
        <img
          onClick={() => {
            handleLogoClick()
          }}
          src='/images/logo.svg'
          alt='Logo'
        />
      </div>
      <div className={styles.links}>
        <div
          className={styles.link}
          onClick={() => navigate('/')}
          style={getLinkStyle(['/', '/login', '/register'])}
        >
          홈
        </div>
        <div
          className={styles.link}
          onClick={() => navigate('/myProfile')}
          style={getLinkStyle(['/myProfile', '/write', '/myLikes'])}
        >
          내 독서일지
        </div>
        <div
          className={styles.link}
          onClick={() => navigate('/community')}
          style={getLinkStyle(['/community'])}
        >
          게시판
        </div>
        <div className={styles.link2} onClick={() => navigate('/write')}>
          일지 쓰기
        </div>
      </div>
    </nav>
  )
}

export default NavBar
