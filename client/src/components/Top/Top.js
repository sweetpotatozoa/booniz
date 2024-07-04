import styles from './Top.module.css'

const Top = ({ greeting }) => {
  return <div className={styles.hello}>{greeting}</div>
}

export default Top
