const truncateContent = (content, length) => {
  if (content.length > length) {
    return content.substring(0, length) + '...'
  }
  return content
}

export default truncateContent
