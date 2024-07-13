const API_URI = process.env.REACT_APP_API_URI

const fetcher = async (url, token, method, params = {}) => {
  const resource =
    method === 'GET' ? `${url}?${new URLSearchParams(params)}` : url
  const init = ['POST', 'PUT', 'DELETE'].includes(method)
    ? {
        body: JSON.stringify(params),
        headers: {},
      }
    : { headers: {} }
  init.method = method
  init.headers['Content-Type'] = 'application/json'
  init.headers['x-access-token'] = token
  try {
    const res = await fetch(API_URI + resource, init)
    const data = await res.json()
    return data
  } catch (err) {
    return null
  }
}

class BackendApis {
  //프론트에서 백엔드로 api요청을 보낼때 사용하는 함수들을 모아놓은 곳입니다.
  //이곳에서 함수를 만들고 각 컴포넌트에서 이 함수를 호출하여 사용합니다.
  constructor() {
    this.token = localStorage.getItem('token') || null
  }

  async login(method = 'POST', params = {}) {
    const result = await fetcher('/api/auth/login', '', method, params)
    if (result.token) {
      this.token = result.token
      localStorage.setItem('token', this.token)
    }
    return result
  }

  async register(method = 'POST', params = {}) {
    const result = await fetcher('/api/auth/register', '', method, params)
    return result
  }

  async getMainInfo() {
    const result = await fetcher('/api/review/getMainInfo', this.token, 'GET')
    return result
  }

  async getMyProfile() {
    const result = await fetcher('/api/review/myProfile', this.token, 'GET')
    console.log(result)
    return result
  }

  async createReview(method = 'POST', params = {}) {
    const result = await fetcher('/api/review/createReview', '', method, params)
    return result
  }

  async getUserProfile(userId) {
    console.log('Fetching profile for userId:', userId) // Debugging
    const result = await fetcher(
      `/api/review/userProfile/${userId}`,
      this.token,
      'GET',
    )
    console.log('Profile fetch result:', result) // Debugging
    return result
  }

  async getCommunityReviews(date) {
    const result = await fetcher(`/api/review/community/${date}`, '', 'GET')
    console.log(result)
    return result
  }

  async createComment(reviewId, params = {}) {
    const result = await fetcher(
      `/api/comment/createComment/${reviewId}`,
      this.token,
      'POST',
      params,
    )
    return result
  }

  async deleteComment(commentId) {
    const result = await fetcher(
      `/api/comment/delete/${commentId}`,
      this.token,
      'DELETE',
    )
    return result
  }

  async getMyReview(userId, reviewId) {
    const result = await fetcher(
      `/api/review/getMyReview/${userId}/${reviewId}`,
      this.token,
      'GET',
    )
    return result
  }

  async updateMyReview(reviewId, userId, updateData) {
    const result = await fetcher(
      `/api/review/updateMyReview/${reviewId}/${userId}`,
      this.token,
      'PUT',
      updateData,
    )
    return result
  }
}

export default new BackendApis()
