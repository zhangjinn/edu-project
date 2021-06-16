import XLSX from 'xlsx'

/**
 * @param jsonData: 表格数据
 * @param tableHead： 表头
 * @param merges: 合并单元格 [{row: '第几行开始', col: '第几列开始', rowspan: '要合并几行', col: '要合并几列'}]
 */
export function jsonToExcel ({ jsonData, tableHead, merges }) {
  // eslint-disable-next-line no-unused-vars
  const workBook = XLSX.utils.book_new()
  const workSheet = XLSX.utils.json_to_sheet(jsonData)
  tableHead && dealTableHead(tableHead, workSheet)
  merges && dealMerges(merges, workSheet)
  dealWidth(workSheet)
  console.log(workSheet)
  XLSX.utils.book_append_sheet(workBook, workSheet, '测试')
  XLSX.writeFile(workBook, '测试.xlsx', { cellStyles: true })
}

/**
 * 处理表头
 * @param head
 * @param workSheet
 */
function dealTableHead (head, workSheet) {
  // 获取最后表格范围
  const range = XLSX.utils.decode_range(workSheet['!ref'])
  for (let i = range.s.c; i <= range.e.c; i++) {
    // 获取每一列的第一行（A1,B1,...,XX1）
    const cellName = XLSX.utils.encode_col(i) + '1'
    // 修改表头
    workSheet[cellName].v = head[workSheet[cellName].v]
    workSheet[cellName].s = {
      patternType: 'solid',
      fgColor: { rgb: 'FFFF00' },
      bgColor: { indexed: 64 }
    }
  }
}

/**
 * 合并单元格
 * @param mergesArr: 要合并的单元格数据
 * @param workSheet
 */
function dealMerges (mergesArr, workSheet) {
  const merges = []
  for (const value of mergesArr) {
    merges.push({
      s: { r: value.row, c: value.col },
      e: { r: value.row + value.rowspan, c: value.col + value.colspan }
    })
  }
  workSheet['!merges'] = merges
}

/**
 * 自适应单元格列宽度
 * @param workSheet
 */
function dealWidth (workSheet) {
  const range = XLSX.utils.decode_range(workSheet['!ref'])
  const wch = []
  // 找出每一个最大的字符长度 * 2.2即自适应的宽度
  for (let c = range.s.c; c <= range.e.c; c++) {
    const maxLength = []
    for (let r = range.s.r; r <= range.e.r; r++) {
      const cellName = XLSX.utils.encode_col(c) + XLSX.utils.encode_row(r)
      maxLength.push(workSheet[cellName].v.toString().length * 2.2)
    }
    // 最小宽度为8
    wch.push({
      wch: Math.max(...maxLength) < 8 ? 8 : Math.max(...maxLength)
    })
  }
  workSheet['!cols'] = wch
}
