/**
 * 计算首页echarts的dataZoom的start和end，让其一开始就显示本周（今天）
 * @returns {{start: number, end: number}}
 */
export function calcStartAndEnd() {
  const nowDate = new Date()
  const lastDate = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0)
  const RADIO = 100 / lastDate.getDate()
  const start = RADIO * (nowDate.getDate() - 3)
  const end = 16 + start
  return {
    start,
    end
  }
}
