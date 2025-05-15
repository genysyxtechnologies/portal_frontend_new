import dayjs from 'dayjs'

export const formatDateOfBirth = (dobArray: [number, number, number]) => {
  if (!dobArray) return ''
  const formattedDate = dayjs()
    .year(dobArray[0])
    .month(dobArray[1] - 1)
    .date(dobArray[2])
    .format('YYYY-MM-DD')

  return formattedDate
}

// get the current date and time

export const getCurrentDateAndTime = () => {
  const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return formattedDate
}
