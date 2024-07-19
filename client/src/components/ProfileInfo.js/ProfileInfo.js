import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfileInfo.module.css'

const ProfileInfo = ({
  nickName,
  consecutiveDays,
  completionRate,
  readPages,
  myProfile = false,
}) => {
  const navigate = useNavigate()

  return (
    <div className={styles.profileInfo}>
      <div className={styles.basicInfo}>
        <div className={styles.userName}>{nickName}님</div>
        <div className={styles.orangeCircle}></div>
        <div className={styles.infos}>
          <div className={styles.info}>
            {consecutiveDays}일차
            <br /> <span>연속 기록</span>
          </div>
          <div
            className={styles.info}
            style={{
              borderLeft: '2px solid #7D7D7D',
              borderRight: '2px solid #7D7D7D',
            }}
          >
            {completionRate.toFixed(2)}%
            <br />
            <span>완독률</span>
          </div>
          <div className={styles.info}>
            {readPages}p
            <br />
            <span>읽은 쪽수</span>
          </div>
        </div>
      </div>
      {myProfile && (
        <button
          onClick={() => navigate('/myLikes')}
          className={styles.likedReviews}
        >
          좋아요한 글
        </button>
      )}
    </div>
  )
}

export default ProfileInfo
