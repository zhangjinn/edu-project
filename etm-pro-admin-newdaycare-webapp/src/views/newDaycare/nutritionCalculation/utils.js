// exceljs(支持设置excel样式)中文官方文档：https://github.com/exceljs/exceljs/blob/master/README_zh.md

import excelJs from 'exceljs'
import { parseTime } from '@/utils'
import { Message } from 'element-ui'

/**
 * 将数据转成excel
 * @param columns: etm-table的columns
 * @param tableData: etm-table的tableData
 * @param merges {array}: 要合并单元格的数组  按开始行，开始列，要合并几行，要合并几列（开始行/列从1算起）
 * @param name: 表格名字
 * @param sheetName: sheet的名字
 * @param style: 单元格样式
 * * style结构如下,请看dealStyle函数
 * const style={getColumn:{1:{font:{bold:true}}},getRow:{4:{font:{bold:true}}},getCell:{'A1':{font:{bold:true}}}}
 */
export function dataToExcel ({ columns = null, tableData = null, merges = null, name = null, sheetName = name, style = null }) {
  const workBook = new excelJs.Workbook()
  const workSheet = workBook.addWorksheet(sheetName)
  // 表头
  workSheet.columns = columns.map(item => {
    return {
      header: item.label,
      key: item.prop
    }
  })
  workSheet.addRows(tableData.map(item => Object.values(item)))
  merges && dealMerges(merges, workSheet)
  // 处理自适应列宽度
  dealColWidth(workSheet)
  // 处理样式
  dealStyle(style, workSheet)
  // 导出excel
  workBook.xlsx.writeBuffer().then(res => {
    downloadFile(res, name)
  }).catch(err => {
    console.log(err, '导出失败')
    Message({
      message: '导出失败',
      type: 'error'
    })
  })
}

/**
 * 自适应列宽度
 * @param workSheet
 */
function dealColWidth (workSheet) {
  workSheet._columns.forEach(item => {
    const width = Math.max(...item.values.filter(item => item).map(item => item.toString().length))
    item.width = width * 2.2 < 8 ? 8 : width * 2.2
  })
}

/**
 * 处理合并单元格
 * @param merges: 要合并单元格的数组  按开始行，开始列，要合并几行，要合并几列（开始行/列从1算起）
 * @param workSheet
 */
function dealMerges (merges, workSheet) {
  merges.forEach(item => {
    const rowspan = item.rowspan > 0 ? item.rowspan - 1 : 0
    const colspan = item.colspan > 0 ? item.colspan - 1 : 0
    const arrMerges = [item.row, item.col, item.row + rowspan, item.col + colspan]
    workSheet.mergeCells(arrMerges)
  })
}

/**
 * 下载文件 blob的type类型：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * @param buffer
 * @param name
 */
// eslint-disable-next-line no-unused-vars
function downloadFile (buffer, name) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const downloadElement = document.createElement('a')
  downloadElement.download = name || parseTime(Date.now(), '{y}年{m}月{d}日 {h}时{i}分{s}秒')
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}

/**
 * 修改单元格样式
 * https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%A0%B7%E5%BC%8F
 * style结构如下
 * const style={getColumn:{1:{font:{bold:true}}},getRow:{4:{font:{bold:true}}},getCell:{'A1':{font:{bold:true}}}}
 * @param workSheet
 * @param style
 */
function dealStyle (style, workSheet) {
  if (!style) {
    // 表头加粗
    workSheet.getRow(1).font = {
      bold: true
    }
    return
  }
  for (const key in style) {
    if (Object.prototype.hasOwnProperty.call(style, key)) {
      const obj = style[key] // 取出结果: obj = {1:{font:{bold:true}}}
      for (let col in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, col)) {
          // obj[col]结果：obj[col] = {font:{bold:true}}
          Object.entries(obj[col]).forEach(sty => {
            // getColumn和getRow方法的参数需要number类型
            if (['getColumn', 'getRow'].includes(key)) { col = parseInt(col) }
            // 下面代码相当于：workSheet.getColumn(1).font = {bold: true}
            workSheet[key](col)[sty[0]] = sty[1]
          })
        }
      }
    }
  }
}
