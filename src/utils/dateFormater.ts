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
