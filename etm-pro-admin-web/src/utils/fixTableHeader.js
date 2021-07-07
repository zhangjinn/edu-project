import Vue from 'vue'
import Ctrl from './scrollCtrl'

const fixFunObj = {} // 用于存放滚动容器的监听scroll事件
const setWidthFunObj = {} // 用于存放页面resize后重新计算head宽度事件
const autoMoveFunObj = {} // 用户存放如果是DOM元素内局部滚动时，document滚动时，fix布局的表头也需要跟着document一起向上滚动
const tableObj = {} // 存放el-table组件相对于视口的位置数据

const DIRECTIVE_NAME = 'fixedHead' // vue指令的名字
const FIXED_CLASSNAME = 'f-fixed' // 标识表头是否已经处于置定状态的类名
let FIXED_ZINDEX = '2000' // 设置了置定的表头的z-index值

// 无固定的表格类名
const TABLE_CLASSNAME = 'el-table'
const TABLE_HEADER_CLASSNAME = 'el-table__header-wrapper'
const TABLE_BODY_CLASSNAME = 'el-table__body-wrapper'

// 左边固定列的表格类名
const TABLE_FIXED_CLASSNAME = 'el-table__fixed'
const TABLE_FIXED_HEADER_CLASSNAME = 'el-table__fixed-header-wrapper'
const TABLE_FIXED_BODY_CLASSNAME = 'el-table__fixed-body-wrapper'

// 右边固定列的表格类名
const TABLE_FIXED_RIGHT_CLASSNAME = 'el-table__fixed-right'

// 获取表格中的所有表头元素
function getTableHeaders(el, isFixed) {
  return [...el.getElementsByClassName(TABLE_HEADER_CLASSNAME), ...el.getElementsByClassName(TABLE_FIXED_HEADER_CLASSNAME)]
}

// 设置头部固定时表头外容器的宽度写死为表格body的宽度
function setHeadWidth(el) {
  setTimeout(() => {
    // 获取到当前表格个表格body的宽度
    const width = getComputedStyle(
      el.getElementsByClassName(TABLE_BODY_CLASSNAME)[0]
    ).width

    // 给表头设置和表身一样的宽度
    const tableParent = el.getElementsByClassName(TABLE_HEADER_CLASSNAME)
    for (let i = 0; i < tableParent.length; i++) {
      tableParent[i].style.width = width
    }
  }, 0)
}

// 重新计算有关定位的数据
function resetPositionData(el, vnode) {
  const uid = vnode.componentInstance._uid
  setHeadWidth(el)
  tableObj[uid] = el.getBoundingClientRect()
}

// 具体判断是否固定头的主函数
function fixHead(parent, el, top, isFixed, tableObj, isresizetrigger) {
  /**
   * myTop 当前元素距离滚动父容器的高度，
   * fixtop 当前元素需要设置的绝对定位的高度
   * parentHeight 滚动父容器的高度，number类型
   */
  const trigger = isresizetrigger && el.querySelector(`.${TABLE_HEADER_CLASSNAME}`).className.includes(FIXED_CLASSNAME) // 标识是否是窗口大小变化进行调整了
  let myTop, fixtop, parentHeight
  const doms = getTableHeaders(el, isFixed) // 获取表头DOM节点
  Array.isArray(doms) && doms.forEach(dom => {
    if (parent.tagName) { // 如果是DOM内局部滚动
      // 当前元素距离滚动父容器的高度= 当前元素距离父元素的高度-父容器的滚动距离-表头的高度
      myTop = el.offsetTop - parent.scrollTop - dom.offsetHeight

      // 父元素高度
      const height = getComputedStyle(parent).height
      parentHeight = Number(height.slice(0, height.length - 2))

      // 绝对定位高度 = 滚动父容器相对于视口的高度 + 传入的吸顶高度
      fixtop = top + parent.getBoundingClientRect().top

      // 如果自己距离顶部距离大于父元素的高度，也就是自己还没在父元素滚动出来，直接return
      if (myTop > parentHeight) {
        return
      }
    } else {
      // document节点滚动
      // 当前元素距离滚动父容器的高度 = 当前元素距离视口顶端的距离
      myTop = el.getBoundingClientRect().top // tableObj
      // 父元素高度 = 视口的高度
      parentHeight = window.innerHeight
      //  绝对定位高度 = 传入的吸顶高度
      fixtop = top
      // 如果自己距离顶部距离大于父元素的高度，也就是自己还没在父元素滚动出来，直接return
      if (myTop > document.documentElement.scrollTop + parentHeight) {
        return
      }
    }
    if (isresizetrigger) {
      el._ctrl && el._ctrl.judgeShowAndHide()
    }
    if (trigger) { // 在标题浮动的情况下调整窗口大小，则强制fixed定位
      if (dom.parentNode.className.includes(TABLE_FIXED_RIGHT_CLASSNAME)) {
        const table = dom.querySelector('table')
        dom.style.left = tableObj.right - table.clientWidth + 'px'
        dom.style.right = '0'
      } else if (dom.parentNode.className.includes(TABLE_FIXED_CLASSNAME)) {
        dom.style.left = `${tableObj.left}px`
      }
      el._ctrl && el._ctrl.fixBtnsPosition(fixtop, FIXED_ZINDEX, tableObj)
      return
    }
    // 如果已经滚动的上去不在父容器显示了。直接return
    if (Math.abs(myTop) > el.offsetHeight + 100) {
      return
    }
    if (myTop < 0 && Math.abs(myTop) > el.offsetHeight) {
      // 如果当前表格已经完全滚动到父元素上面，也就是不在父元素显示了。则需要去除fixed定位
      removeClass(dom, el)
    } else if (myTop <= 0) {
      // 如果表头滚动到 父容器顶部了。fixed定位
      addClass(dom, fixtop, el, tableObj)
    } else if (myTop > 0) {
      // 如果表格向上滚动 又滚动到父容器里。取消fixed定位
      removeClass(dom, el)
    } else if (Math.abs(myTop) < el.offsetHeight) {
      // 如果滚动的距离的绝对值小于自身的高度，也就是说表格向上滚动，刚刚显示出表格的尾部是需要将表头fixed定位
      addClass(dom, fixtop, el, tableObj)
    }
  })
}

// 给固定头设置样式
function doFix(dom, top, el, tableObj) {
  dom.style.position = 'fixed'
  dom.style.zIndex = FIXED_ZINDEX

  // 定位控制按钮
  el._ctrl && el._ctrl.fixBtnsPosition(top, FIXED_ZINDEX, tableObj)

  if (dom.className.includes(TABLE_HEADER_CLASSNAME)) {
    // 定位普通table的表头
    dom.style.top = top + 'px'
    dom.parentNode.style.paddingTop = top + 'px'
  }

  if (dom.className.includes(TABLE_FIXED_HEADER_CLASSNAME)) {
    // 定位固定table的表头
    dom.style.top = top + 'px'
    dom.parentNode.style.paddingTop = top + 'px'

    // 调整固定table表头的样式
    const trDom = dom.querySelector('tr')
    trDom.style.backgroundColor = 'transparent'
    Array.prototype.forEach.call(trDom.querySelectorAll('.is-hidden'), dom => {
      dom.style.backgroundColor = 'transparent'
      dom.style.border = 'none'
    })

    // 定位固定table的表身
    dom.parentNode.querySelector(`.${TABLE_FIXED_BODY_CLASSNAME}`).style.top = top + 'px'

    // 水平定位固定table的表头
    if (dom.parentNode.className.includes(TABLE_FIXED_RIGHT_CLASSNAME)) { // 右边的固定列
      const table = dom.querySelector('table')
      dom.style.left = tableObj.right - table.clientWidth + 'px'
      dom.style.right = '0'
    } else if (dom.parentNode.className.includes(TABLE_FIXED_CLASSNAME)) { // 左边的固定列
      dom.style.left = `${tableObj.left}px`
    }

    // 等待表头fixed后，调整固定列的高度来保证正常显示全部的列的内容
    setTimeout(() => {
      dom.parentNode.style.height = +dom.parentNode.style.paddingTop.slice(0, -2) + +dom.parentNode.style.height.slice(0, -2) + 'px'
    }, 200)
  }

  // 禁用表头可拖拽调整大小的功能
  changeResizable(false, el)
}

// 给固定头取消样式
function removeFix(dom, el) {
  dom.style.top = '0'
  dom.style.zIndex = '0'

  // 定位控制按钮
  el._ctrl && el._ctrl.initBtnsPosition()

  if (dom.className.includes(TABLE_HEADER_CLASSNAME)) {
    dom.style.position = 'static'
    dom.parentNode.style.paddingTop = 0
  }
  if (dom.className.includes(TABLE_FIXED_HEADER_CLASSNAME)) {
    dom.style.position = 'absolute'
    dom.parentNode.querySelector(`.${TABLE_FIXED_BODY_CLASSNAME}`).style.top = dom.clientHeight + 'px'
    if (dom.parentNode.className.includes(TABLE_FIXED_RIGHT_CLASSNAME)) {
      dom.style.right = '0'
      dom.style.left = 'auto'
    } else if (dom.parentNode.className.includes(TABLE_FIXED_CLASSNAME)) {
      dom.style.left = '0'
    }
  }

  // 恢复表头可拖拽调整大小的功能
  changeResizable(true, el)
}

// 切换表头长度是否可拖拽调整的功能
function changeResizable(resizable, el) {
  if (el._VNODE) {
    el._VNODE.store.states._columns.forEach(column => {
      column.resizable = resizable
    })
    el._VNODE.store.updateColumns()
    el._VNODE.store.scheduleLayout()
  }
}

// 给固定头添加class
function addClass(dom, fixtop, el, tableObj) {
  const old = dom.className
  if (!old.includes(FIXED_CLASSNAME)) {
    dom.setAttribute('class', old + ` ${FIXED_CLASSNAME}`)
    doFix(dom, fixtop, el, tableObj)
  }
}

// 给固定头移除class
function removeClass(dom, el) {
  const old = dom.className
  const idx = old.indexOf(FIXED_CLASSNAME)
  if (idx !== -1) {
    const newClass = old.substr(0, idx - 1)
    dom.setAttribute('class', newClass)
    removeFix(dom, el)
  }
}

// 重写history的事件，用于监听url变化
function rewrite(type, history) {
  // 记录原生事件
  var orig = history[type]
  return function() {
    // 触发原生事件
    var rv = orig.apply(this, arguments)
    // 自定义事件
    var e = new Event(type)
    e.arguments = arguments
    // 触发自定义事件
    window.dispatchEvent(e)
    return rv
  }
}

// 获取table组件的vnode
function getTableVnode(vnode, el) {
  Array.isArray(vnode.componentInstance.$children) &&
  vnode.componentInstance.$children.forEach(c => {
    if (c.$el.className.includes('el-table') && !el._VNODE) {
      el._VNODE = c
    }
  })
}

let urlChangeFunc // 创建一个函数指针

// 全局注册 自定义事件
Vue.directive(DIRECTIVE_NAME, {
  bind(el, binding, vnode) {
    if (window.history && window.history.pushState && window.history.replaceState) {
      if (!window.history.pushState._rewrite) {
        window.history.pushState = rewrite('pushState', window.history)
        window.history.pushState._rewrite = true
      }
      if (!window.history.replaceState._rewrite) {
        window.history.replaceState = rewrite('replaceState', window.history)
        window.history.replaceState._rewrite = true
      }
    }
  },
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding, vnode) {
    el = el.querySelector(`.${TABLE_CLASSNAME}`)
    getTableVnode(vnode, el)

    // 判断是否有固定列来决定是否展示控制左右滚动的按钮
    if (!el._ctrl) {
      el._ctrl = new Ctrl()
    }
    Vue.nextTick(() => {
      if (!el._ctrl.init(el)) {
        // 不存在固定列则不生成滚动控制按钮
        el._ctrl = null
      }
    })

    const bindingTop = binding.value
      ? binding.value.top === undefined
        ? 84
        : binding.value.top
      : 84
    const bindingParent = binding.value
      ? binding.value.parent === undefined
        ? '#app'
        : binding.value.parent
      : '#app'
    FIXED_ZINDEX = binding.value
      ? binding.value.zIndex === undefined
        ? FIXED_ZINDEX
        : binding.value.zIndex
      : FIXED_ZINDEX

    // 获取当前vueComponent的ID。作为存放各种监听事件的key
    const uid = vnode.componentInstance._uid
    resetPositionData(el, vnode)

    // 当window resize时 重新计算设置表头宽度，并将监听函数存入 监听函数对象中，方便移除监听事件
    setWidthFunObj[uid] = () => {
      resetPositionData(el, vnode) // 每次调整窗口大小都要重置
      fixHead(scrollParent, el, bindingTop, true, tableObj[uid], true)
    }
    window.addEventListener('resize', setWidthFunObj[uid])

    // 获取当前滚动的容器是什么。如果是document滚动。则可默认不传入parent参数
    const scrollParent =
      document.querySelector(bindingParent) || document
    // 给滚动容器加scroll监听事件。并将监听函数存入 监听函数对象中，方便移除监听事件
    fixFunObj[uid] = () => {
      resetPositionData(el, vnode)
      fixHead(scrollParent, el, bindingTop, true, tableObj[uid])

      // 切换后重置按钮的定位
      // el._ctrl && Vue.nextTick(() => {
      //   el._ctrl.initBtnsPosition()
      // })
    }
    scrollParent.addEventListener('scroll', fixFunObj[uid])

    autoMoveFunObj[uid] = () => {
      const doms = getTableHeaders(el, true)
      Array.isArray(doms) && doms.forEach(dom => {
        // 如果当前表头是fixed定位。则跟着document滚动一起滚
        if (getComputedStyle(dom).position === 'fixed') {
          // 滚动的距离是： 滚动父容器距离视口顶端高度 + 传入的吸顶固定距离
          const fixtop =
          bindingTop + scrollParent.getBoundingClientRect().top
          doFix(dom, fixtop, 'fixed', tableObj[uid])
        }
      })
    }
    // 如果是局部DOM元素内滚动。则需要监听document滚动，document滚动是同步让表头一起滚动。并将监听函数存入 监听函数对象中，方便移除监听事件
    if (bindingParent) {
      document.addEventListener('scroll', autoMoveFunObj[uid])
    }

    urlChangeFunc = function() {
      // 这里vnode是etm-table的组件，理论上没有写activated函数
      if (!vnode.componentOptions.Ctor.options.activated) {
        // 注入activated生命周期函数
        vnode.componentOptions.Ctor.options.activated = [function() {
          // 让视图滚动到顶部，然后再消除掉表头的fixed状态
          document.querySelector('._scrollTop').scrollIntoView()
          const el = document.querySelector(`.${TABLE_CLASSNAME}`)
          const doms = getTableHeaders(el)
          Array.isArray(doms) && doms.forEach(dom => {
            removeClass(dom, el)
          })

          // 切换后重置按钮的定位
          el._ctrl && Vue.nextTick(() => {
            el._ctrl.initBtnsPosition()
          })
        }]
      }
    }

    // 从其他标签切换过来的时候url变化，需要重新判断位置
    window.addEventListener('pushState', urlChangeFunc)
    window.addEventListener('replaceState', urlChangeFunc)
  },
  // component 更新后。重新计算表头宽度
  componentUpdated(el, binding, vnode) {
    const uid = vnode.componentInstance._uid
    fixFunObj[uid]()
  },
  // 节点取消绑定时 移除各项监听事件。
  unbind(el, binding, vnode) {
    el = el.querySelector(`.${TABLE_CLASSNAME}`)

    const uid = vnode.componentInstance._uid
    window.removeEventListener('resize', setWidthFunObj[uid])

    const bindingParent = binding.value ? binding.value.parent : '#app'
    const scrollParent =
      document.querySelector(bindingParent) || document
    scrollParent.removeEventListener('scroll', fixFunObj[uid])

    if (bindingParent) {
      document.removeEventListener('scroll', autoMoveFunObj[uid])
    }

    el._VNODE = null
    el._ctrl && el._ctrl.unbindHandler()
    el._ctrl = null

    window.removeEventListener('pushState', urlChangeFunc)
    window.removeEventListener('replaceState', urlChangeFunc)
  }
})
