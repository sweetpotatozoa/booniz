import React from 'react'

const MyProfile = () => {
  // 예제 데이터
  const userProfile = {
    nickname: '민지님',
    age: '30',
    completionRate: 80,
    readPages: 150,
  }

  const reviews = [
    {
      title: '독서 기록 제목 1',
      content:
        '여기는 독서 기록 내용 1입니다. 오늘 읽은 책에 대해 쓴 내용을 여기에 작성합니다.',
      updatedAt: '2023-07-01T12:34:56Z',
      comments: [
        { content: '좋은 글이네요!', createdAt: '2023-07-01T14:34:56Z' },
      ],
    },
    {
      title: '독서 기록 제목 2',
      content:
        '여기는 독서 기록 내용 2입니다. 오늘 읽은 책에 대해 쓴 내용을 여기에 작성합니다.',
      updatedAt: '2023-07-02T12:34:56Z',
      comments: [
        { content: '잘 읽었습니다.', createdAt: '2023-07-02T14:34:56Z' },
      ],
    },
  ]

  return (
    <div className='myProfile-container'>
      <div className='profile-header'>
        <h1>{userProfile.nickname}, 매일 독서기록을 쓰고 선물 받아가세요</h1>
        <div className='profile-info'>
          <p>닉네임: {userProfile.nickname}</p>
          <p>나이: {userProfile.age}</p>
          <p>완독률: {userProfile.completionRate}%</p>
          <p>읽은 쪽수: {userProfile.readPages}쪽</p>
        </div>
      </div>
      <div className='reviews-section'>
        {reviews.map((review, index) => (
          <div key={index} className='review-card'>
            <div className='review-header'>
              <h2>{index + 1}일차 독서기록</h2>
              <p>
                <strong>독서 기록 제목:</strong> {review.title}
              </p>
              <p>
                <strong>내용:</strong> {review.content}
              </p>
              <p>
                <strong>작성일:</strong>{' '}
                {new Date(review.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className='comments-section'>
              <h3>댓글</h3>
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
    </div>
  )
}

export default MyProfile
