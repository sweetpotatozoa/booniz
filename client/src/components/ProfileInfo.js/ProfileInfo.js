import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfileInfo.module.css'

const ProfileInfo = ({
  nickName,
  consecutiveDays,
  completionRate,
  readPages,
}) => {
  const navigate = useNavigate()

  return (
    <div className={styles.profileInfo}>
      <div>
        <div>{nickName}님</div>
      </div>
      <div>연속 기록: {consecutiveDays}일차</div>
      <div>완독률: {completionRate.toFixed(2)}%</div>
      <div>읽은 쪽수: {readPages}쪽</div>
      <button onClick={() => navigate('/myLikes')}>좋아요한 글</button>
    </div>
  )
}

export default ProfileInfo
