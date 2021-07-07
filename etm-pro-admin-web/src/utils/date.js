import { parseTime } from '@/utils/index'

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
      let timeDiff = Math.floor(time / 1000)
      const hour = Math.floor(timeDiff / 3600)
      timeDiff = timeDiff % 3600
      const miniute = Math.floor(timeDiff / 60)
      timeDiff = timeDiff % 60
      const second = timeDiff
      return {
        hours: ('0' + hour).slice(-2),
        miniutes: ('0' + miniute).slice(-2),
        seconds: ('0' + second).slice(-2)
      }
    },
    time: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
    fullTime: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
  }
}

/**
 * 通过月份获取开始和结束日期
 * @param month
 * @returns {{endDate: (string|null), startDate: (string|null)}}
 */
export function getStartDateAndEndDateByMonth(month = new Date().getMonth() + 1) {
  const year = new Date().getFullYear()
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  return {
    startDate: parseTime(firstDay, '{y}-{m}-{d}'),
    endDate: parseTime(lastDay, '{y}-{m}-{d}')
  }
}

/**
 * 通过Date获取当月的开始和结束日期
 * @param {Date} date
 * @returns {{endDate: string, startDate: string}} - yyyy-mm-dd
 */
export function getStartDateAndEndDateByDate(date = new Date()) {
  console.log(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  return {
    startDate: parseTime(firstDay, '{y}-{m}-{d}'),
    endDate: parseTime(lastDay, '{y}-{m}-{d}')
  }
}
