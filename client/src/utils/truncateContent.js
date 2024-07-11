const truncateContent = (content, limit) => {
  if (!content) return '' // content가 null이거나 undefined인 경우 빈 문자열 반환
  return content.length > limit ? content.substring(0, limit) + '...' : content
}

export default truncateContent
