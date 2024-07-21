const getConsecutiveDays = (dailyStatus) => {
  if (!dailyStatus || dailyStatus.length === 0) return 0
  const reversedStatus = [...dailyStatus].reverse()
  if (reversedStatus[0] === 0) return 0
  let count = 0
  for (let status of reversedStatus) {
    if (status === 1) {
      count++
    } else {
      break
    }
  }
  return count
}

export default getConsecutiveDays
