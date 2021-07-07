export default function transferDate(timestamp) {
  timestamp = timestamp || Date.now()
  const date = new Date(timestamp)
  return {
    year: date.getFullYear(),
    month: ('0' + (date.getMonth() + 1)).slice(-2),
    date: ('0' + date.getDate()).slice(-2),
    hours: ('0' + date.getHours()).slice(-2),
    miniutes: ('0' + date.getMinutes()).slice(-2),
    seconds: ('0' + date.getSeconds()).slice(-2),
    gap(time) {
      if (time <= 0) return {
        hour: 0,
        miniute: 0,
        second: 0,
        hours: '00',
        miniutes: '00',
        seconds: '00'
      }
      let timeDiff = Math.floor(time / 1000)
      const hour = Math.floor(timeDiff / 3600)
      timeDiff = timeDiff % 3600
      const miniute = Math.floor(timeDiff / 60)
      timeDiff = timeDiff % 60
      const second = timeDiff
      return {
        hour,
        miniute,
        second,
        hours: ('0' + hour).slice(-2),
        miniutes: ('0' + miniute).slice(-2),
        seconds: ('0' + second).slice(-2)
      }
    },
    time: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
    clock: `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`,
    fullTime: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
  }
}