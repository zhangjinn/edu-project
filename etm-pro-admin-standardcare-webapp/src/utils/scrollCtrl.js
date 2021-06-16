// 无固定的表格类名
const TABLE_HEADER_CLASSNAME = 'el-table__header-wrapper'
const TABLE_BODY_CLASSNAME = 'el-table__body-wrapper'

// 左边固定列的表格类名
const TABLE_FIXED_CLASSNAME = 'el-table__fixed'

// 右边固定列的表格类名
const TABLE_FIXED_RIGHT_CLASSNAME = 'el-table__fixed-right'

const BTN_PREFIX_CLASSNAME = 'fi' // 标识表头是否已经处于置定状态的类名
const BTN_WIDTH = 28
const SCROLL_STEP = 30

class CtrlBtns {
  constructor () {
    this.leftCtrlBtn = document.createElement('div') // 左边按钮
    this.rightCtrlBtn = document.createElement('div') // 右边按钮
    this.leftBtnHandler = null // 左边按钮点击事件
    this.rightBtnHandler = null // 右边按钮点击事件
    this.tableScrollHandler = null // 表格滚动事件
  }

  init (el) {
    this.el = el // 指向.el-table
    this.hasLeftFixedTable = !!this.el.getElementsByClassName(TABLE_FIXED_CLASSNAME).length
    this.hasRightFixedTable = !!this.el.getElementsByClassName(TABLE_FIXED_RIGHT_CLASSNAME).length
    if (this.hasLeftFixedTable || this.hasRightFixedTable) { // 有固定列的时候添加控制按钮
      this.initCtrlBtns()
    }
    return this.hasLeftFixedTable || this.hasRightFixedTable
  }

  initCtrlBtns () {
    this.setBtnsStyle()
    this.initBtnsPosition()

    this.hasLeftFixedTable
      ? this.el.getElementsByClassName(TABLE_FIXED_CLASSNAME)[0].appendChild(this.leftCtrlBtn)
      : this.el.appendChild(this.leftCtrlBtn)

    this.hasRightFixedTable
      ? this.el.getElementsByClassName(TABLE_FIXED_RIGHT_CLASSNAME)[0].appendChild(this.rightCtrlBtn)
      : this.el.appendChild(this.rightCtrlBtn)
    this.initHandlers()
  }

  setBtnsStyle () {
    // 两个按钮的通用样式
    [this.rightCtrlBtn, this.leftCtrlBtn].forEach(btnEl => {
      btnEl.style.width = BTN_WIDTH + 'px'
      btnEl.style.height = this.el.querySelector(`.${TABLE_HEADER_CLASSNAME}`).clientHeight + 'px' // 和表头同一个高度
      btnEl.style.lineHeight = this.el.querySelector(`.${TABLE_HEADER_CLASSNAME}`).clientHeight + 'px'
      btnEl.style.fontSize = '13px'
      btnEl.style.fontWeight = 'bold'
      btnEl.style.textAlign = 'center'
      btnEl.style.color = '#999eab'
      btnEl.style.backgroundColor = '#EBEEF5'
      btnEl.style.opacity = '.9'
      btnEl.style.cursor = 'pointer'
    })

    // 右边按钮的特定样式
    this.rightCtrlBtn.innerHTML = '>'
    this.rightCtrlBtn.className = BTN_PREFIX_CLASSNAME + '-rightCtrl'

    // 左边按钮的特定样式
    this.leftCtrlBtn.innerHTML = '<'
    this.leftCtrlBtn.className = BTN_PREFIX_CLASSNAME + '-leftCtrl'
  }

  initBtnsPosition () {
    this.rightCtrlBtn.style.position = 'absolute'
    this.rightCtrlBtn.style.top = '0'

    // 有固定列时候，相对于固定列表格定位；无固定列的时候，相对于主表格定位
    this.rightCtrlBtn.style.left = this.hasRightFixedTable ? '1px' : 'auto'
    this.rightCtrlBtn.style.right = this.hasRightFixedTable ? 'auto' : '0'
    this.rightCtrlBtn.style.zIndex = this.hasRightFixedTable ? 3 : 0

    this.leftCtrlBtn.style.position = 'absolute'
    this.leftCtrlBtn.style.top = '0'

    // 有固定列时候，相对于固定列表格定位；无固定列的时候，相对于主表格定位
    this.leftCtrlBtn.style.left = this.hasLeftFixedTable ? 'auto' : '0'
    this.leftCtrlBtn.style.right = this.hasLeftFixedTable ? '1px' : 'auto'
    this.leftCtrlBtn.style.zIndex = this.hasLeftFixedTable ? 3 : 0

    this.judgeShowAndHide()
  }

  fixBtnsPosition (top, zIndex, tableObj) {
    this.rightCtrlBtn.style.position = 'fixed'
    this.rightCtrlBtn.style.top = top + 'px'
    this.rightCtrlBtn.style.zIndex = +zIndex + 2
    this.rightCtrlBtn.style.left =
      this.hasRightFixedTable
        ? tableObj.right - (this.el.querySelector(`.${TABLE_FIXED_RIGHT_CLASSNAME}`).clientWidth || 0) + 'px'
        : tableObj.right - BTN_WIDTH + 'px'

    this.leftCtrlBtn.style.position = 'fixed'
    this.leftCtrlBtn.style.top = top + 'px'
    this.leftCtrlBtn.style.zIndex = +zIndex + 2
    this.leftCtrlBtn.style.left =
      this.hasLeftFixedTable
        ? (this.el.querySelector(`.${TABLE_FIXED_CLASSNAME}`).clientWidth || 0) + tableObj.left - BTN_WIDTH + 'px'
        : this.leftCtrlBtn.style.left = tableObj.left + 'px'
  }

  initHandlers () {
    if (!this.leftBtnHandler) {
      this.leftBtnHandler = () => {
        this.el.querySelector(`.${TABLE_BODY_CLASSNAME}`).scrollLeft -= SCROLL_STEP
      }
    }
    if (!this.rightBtnHandler) {
      this.rightBtnHandler = () => {
        this.el.querySelector(`.${TABLE_BODY_CLASSNAME}`).scrollLeft += SCROLL_STEP
      }
    }
    if (!this.tableScrollHandler) {
      this.tableScrollHandler = () => {
        this.judgeShowAndHide()
      }
    }
    this.bindHandler()
  }

  judgeShowAndHide () {
    setTimeout(() => {
      const tableEl = this.el.querySelector(`.${TABLE_BODY_CLASSNAME}`)
      const left = tableEl.scrollLeft
      const scrollWidth = tableEl.scrollWidth
      const width = tableEl.clientWidth
      if (left === 0 && left === scrollWidth - width) { // 同时到顶，都不显示
        this.shownhide('')
      } else if (left === 0) { // 滚动到最左边，只显示左边按钮
        this.shownhide('r')
      } else if (left === scrollWidth - width) { // 滚动到最右边，只显示右边按钮
        this.shownhide('l')
      } else { // 在中间，两个按钮都显示
        this.shownhide('lr')
      }
    }, 0)
  }

  bindHandler () {
    // 给按钮绑定事件
    this.leftCtrlBtn.addEventListener('click', this.leftBtnHandler)
    this.rightCtrlBtn.addEventListener('click', this.rightBtnHandler)

    // 给滚动表格绑定事件
    this.el.querySelector(`.${TABLE_BODY_CLASSNAME}`).addEventListener('scroll', this.tableScrollHandler)
  }

  unbindHandler () { // 解绑
    this.leftCtrlBtn.removeEventListener('click', this.leftBtnHandler)
    this.rightCtrlBtn.removeEventListener('click', this.rightBtnHandler)
    this.el.querySelector(`.${TABLE_BODY_CLASSNAME}`).removeEventListener('scroll', this.tableScrollHandler)
  }

  shownhide (str) {
    this.leftCtrlBtn.style.display = 'none'
    this.rightCtrlBtn.style.display = 'none'
    if (str.includes('l')) {
      this.leftCtrlBtn.style.display = 'block'
    }
    if (str.includes('r')) {
      this.rightCtrlBtn.style.display = 'block'
    }
  }
}

export default CtrlBtns
