const getConsecutiveDays = (attendance) => {
  let currentStreak = 0

  for (let i = attendance.length - 1; i >= 0; i--) {
    if (attendance[i] === 1) {
      currentStreak++
    } else {
      break
    }
  }

  return currentStreak
}

export default getConsecutiveDays
