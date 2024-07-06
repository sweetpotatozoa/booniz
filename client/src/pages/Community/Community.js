import React, { useState, useEffect } from 'react'

const Community = () => {
  const [reviews, setReviews] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const fetchReviews = async (selectedDate) => {
    try {
      const response = await fetch(`/api/community/${selectedDate}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setReviews(data.reviewsDB)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('데이터를 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchReviews(date)
  }, [date])

  const handleDateChange = (e) => {
    setDate(e.target.value)
  }

  return (
    <div className='community-container'>
      <h2>다른 사람들은 어떤 기록을 썼을까요?</h2>
      <div className='date-picker'>
        <input type='date' value={date} onChange={handleDateChange} />
      </div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className='reviews-section'>
          {reviews.map((review, index) => (
            <div key={index} className='review-card'>
              <div className='review-header'>
                <h3>{review.nickname}</h3>
                <p>{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <h2>독서 기록 제목: {review.title}</h2>
              <p>{review.content}</p>
              <div className='review-footer'>
                <button>좋아요 {review.likes}</button>
                <button>댓글 {review.comments.length}</button>
              </div>
              <div className='comments-section'>
                {review.comments.map((comment, idx) => (
                  <div key={idx} className='comment'>
                    <p>{comment.content}</p>
                    <p>
                      <small>
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Community
