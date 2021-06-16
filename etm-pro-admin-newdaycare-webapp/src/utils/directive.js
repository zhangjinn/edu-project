/**
 *自定义指令
 * */
import Vue from 'vue'
import { getCodeByPath } from '@/auth'

Vue.directive('preventReClick', {
  inserted (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  }
})

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    // el.focus()
    el.children[0].focus()
  }
})
// 添加表单focus v-in-focus
Vue.directive('inFocus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    el.querySelector('input , textarea').focus()
  }
})
let hiddenButtonAuth = null
Vue.directive('has', {
  inserted (el, binding) {
    if (!hiddenButtonAuth) {
      hiddenButtonAuth = JSON.parse(localStorage.getItem('CACHESOLUTION')).map(item => {
        return item.hiddenButtonList.map(button => {
          try {
            return JSON.parse(button.config).authId
          } catch (e) {
            console.error('error in src/utils/directive.js:37 function:() ', e)
          }
        })
      }).flat(Infinity)
    }
    const BUTTON = JSON.parse(localStorage.getItem('BUTTON'))
    const code = getCodeByPath(binding.value.authId)

    const findHidden = hiddenButtonAuth.find(authId => authId === code + '')
    if (findHidden) {
      el.style.display = 'none'
      return false
    }

    const result = BUTTON.find(item => {
      if (item.identify) {
        try {
          item.identify = JSON.parse(item.identify)
        } catch (e) {
          console.error('序列化资源标识失败, 请确认标识是否为JSON格式', item)
        }
      }
      return item.identify.authId === code
    })
    el.setAttribute('auth', JSON.stringify(binding.value.authId, null))
    el.setAttribute('code', JSON.stringify(code, null))
    if (!result) {
      el.style.display = ''
      return true
    } else if (result.buttonEnabled) {
      el.style.display = ''
      return true
    } else {
      el.style.display = 'none'
      return false
    }
  }
})

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    // dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'
    dragDom.style.userSelect = 'none'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const screenWidth = document.body.clientWidth // body当前宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth // 对话框宽度
      const dragDomheight = dragDom.offsetHeight // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left')
      let styT = sty(dragDom, 'top')

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        // styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100) // eslint不通过
        // styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100) // eslint不通过
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -(minDragDomLeft)
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-(top) > minDragDomTop) {
          top = -(minDragDomTop)
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

// v-drag: 使得元素在可视范围内拖拽移动
Vue.directive('drag', {
  inserted (el, binding, vnode, oldVnode) {
    setTimeout(() => {
      const dragDom = el
      const offsetObj = getOffset(dragDom)
      dragDom.style.cursor = 'move'
      // dragDom.style.position = 'relative'
      // dragDom.style.zIndex = '99999999'
      const startPosition = { // 记录下相对于初始状态下平移的坐标
        x: 0,
        y: 0
      }
      dragDom.onmousedown = e => {
        let startX = e.clientX
        let startY = e.clientY

        const screenWidth = document.body.clientWidth // body当前宽度
        const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

        const dragDomWidth = dragDom.offsetWidth // 对话框宽度
        const dragDomheight = dragDom.offsetHeight // 对话框高度

        const minX = -offsetObj.left
        const maxX = screenWidth - dragDomWidth - offsetObj.left

        const minY = -offsetObj.top
        const maxY = screenHeight - dragDomheight - offsetObj.top

        document.onmousemove = function (e) {
          startPosition.x += e.clientX - startX
          startPosition.y += e.clientY - startY
          dragDom.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px)`
          startX = e.clientX
          startY = e.clientY
        }

        document.onmouseup = function (e) {
          if (startPosition.x < minX) {
            startPosition.x = minX
          }
          if (startPosition.x > maxX) {
            startPosition.x = maxX
          }
          if (startPosition.y < minY) {
            startPosition.y = minY
          }
          if (startPosition.y > maxY) {
            startPosition.y = maxY
          }
          dragDom.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px)`
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }, 0)
    function getOffset (el) {
      var obj = {
        top: 0,
        left: 0
      }
      while (el !== document.body) {
        obj.top += el.offsetTop + el.offsetParent.clientTop
        obj.left += el.offsetLeft + el.offsetParent.clientLeft
        el = el.offsetParent
      }
      return obj
    }
  }
})
