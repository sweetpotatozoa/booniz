//css모듈화를 위한 import
import styles from './Home.module.css'
//Top 컴포넌트를 import
import Top from '../../components/Top/Top'
//백엔드 API 호출을 위한 import
import backendApis from '../../utils/backendApis'

const Home = () => {
  return (
    <div>
      <Top greeting='Hello, Next!' />
    </div>
  )
}

export default Home
