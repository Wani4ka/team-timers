export const useTimeFormatter = () => {
  const getMinutes = (time: number) => Math.floor(time / 60000)
  const getSeconds = (time: number) => Math.floor(time / 1000) % 60
  const getMillis = (time: number) => Math.floor(time % 1000)

  const format00 = (x: number) => `0${x}`.slice(-2)
  const format000 = (x: number) => `00${x}`.slice(-3)
  const format = (time: number) => `${getMinutes(time)}:${format00(getSeconds(time))}`
  const formatMillis = (time: number) => format00(Math.floor(getMillis(time) / 10))
  const formatWithMillis = (time: number) => `${format(time)}.${formatMillis(time)}`

  return { getMinutes, getSeconds, getMillis, format00, format000, format, formatMillis, formatWithMillis }
}
