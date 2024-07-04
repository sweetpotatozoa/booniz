import styles from './Top2.module.css'
import { Link } from 'react-router-dom'

const Top2 = () => {
  return (
    <div className={styles.top}>
      ddanjit
      <div className={styles.navs1}>
        <Link to='/'>
          <img className={styles.nav2} src='/images/vector.png' alt='Info' />
        </Link>
      </div>
    </div>
  )
}

export default Top2
