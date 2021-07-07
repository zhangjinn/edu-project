import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1'
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  }
  workbook.Sheets[sheetName] = sheet
  const wbout = XLSX.write(workbook, {
    // 生成excel的配置项
    bookType: 'xlsx', // 文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  })
  return new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  })
}

// 字符串转ArrayBuffer
function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url) // 创建blob地址
  }
  var aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event
  if (window.MouseEvent) event = new MouseEvent('click')
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  }
  aLink.dispatchEvent(event)
}

// 将符合elementUI表格格式的数据（或etm-table-page组件）转换成二维数组的格式
function convert2Array({ data, columns, component }) {
  const result = []
  const header = []
  if (component) { // 传入表格元素，间接获取里面需要导出的数据
    let selection = []
    for (let i = 0; i < component.$children.length; i++) {
      if (component.$children[i].selection) {
        selection = component.$children[i].selection
        break
      }
    }
    return convert2Array({
      columns: component.columns,
      data: selection
    })
  } else { // 按照格式直接传入需要导出的数据
    const propOrder = []
    columns.forEach(v => {
      if (v.label && v.prop) {
        header.push(v.label)
        propOrder.push(v.prop)
      }
    })
    result.push(header)
    data.forEach(v => {
      const item = []
      propOrder.forEach(o => {
        item.push(v[o])
      })
      result.push(item)
    })
  }
  return result
}

export default function({ data, columns, component, fileName }) {
  fileName = fileName || '导出表格'
  const sheet = XLSX.utils.aoa_to_sheet(convert2Array({ data, columns, component }))
  saveAs(sheet2blob(sheet), `${fileName}.xlsx`)
}
