<template>
  <div
    class="button-message-drag"
    @mousedown="onmousedown"
  >
    <section class="ad-group-push">
      <i
        class="icon iconfont"
        :class="icon"
      />
      <p>{{ text }}</p>
    </section>
    <!--    <section class="five-g-Message">-->
    <!--      <i-->
    <!--        class="icon iconfont icon5G"-->
    <!--      />-->
    <!--      <p>5G消息</p>-->
    <!--    </section>-->
  </div>
</template>

<script>

export default {
  name: 'ButtonDrag',

  props: {
    type: {
      type: String,
      default: 'vertical',
      validator: function (value) {
        return ['vertical', 'horizontal', 'allRound'].includes(value)
      }
    },
    icon: {
      type: String,
      default: 'iconquntuiguang'
    },
    text: {
      type: String,
      default: '广告群推'
    },
    rangeLeftPosition: {
      type: Number,
      default: 190 + 16
    },
    rangeRightPosition: {
      type: Number,
      default: 2 + 16
    },
    rangeTopPosition: {
      type: Number,
      default: 95 + 16
    },
    rangeBottomPosition: {
      type: Number,
      default: 64 + 16
    }
  },
  data () {
    return {
      flags: false
    }
  },

  methods: {
    onmousedown (e) {
      this.flags = false
      let odiv = null

      if (e.target.tagName === 'DIV') {
        odiv = e.target
      } else {
        odiv = document.getElementsByClassName('button-message-drag')[0]
      }

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop

      let left = ''
      let top = ''
      document.onmousemove = (e) => {
        e.preventDefault()

        this.flags = true
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        left = e.clientX - disX
        top = e.clientY - disY

        // 滑块滑动范围
        const rangeLeftPosition = this.rangeLeftPosition
        const rangeRightPosition = screenWidth - odiv.clientWidth - this.rangeRightPosition
        const rangeTopPosition = this.rangeTopPosition
        const rangeBottomPosition = screenHeight - odiv.clientHeight - this.rangeBottomPosition
        // 限制滑块超出页面
        if (this.type === 'horizontal') {
          if (left <= rangeLeftPosition) {
            left = rangeLeftPosition
          } else if (left >= rangeRightPosition) {
            left = rangeRightPosition
          }
          odiv.style.left = left + 'px'
        } else if (this.type === 'vertical') {
          if (top <= rangeTopPosition) {
            top = rangeTopPosition
          } else if (top >= rangeBottomPosition) {
            top = rangeBottomPosition
          }
          odiv.style.top = top + 'px'
        } else {
          if (left <= rangeLeftPosition) {
            left = rangeLeftPosition
          } else if (left >= rangeRightPosition) {
            left = rangeRightPosition
          }

          if (top <= rangeTopPosition) {
            top = rangeTopPosition
          } else if (top >= rangeBottomPosition) {
            top = rangeBottomPosition
          }
          odiv.style.left = left + 'px'
          odiv.style.top = top + 'px'
        }
      }
      document.onmouseup = (e) => {
        if (!this.flags) {
          if (e.target.className === 'ad-group-push' || e.target.parentNode.className === 'ad-group-push') {
            this.$emit('handleClick')
          } else if (e.target.className === 'five-g-Message' || e.target.parentNode.className === 'five-g-Message') {
            console.log(222)
            this.$emit('handleFiveGClick')
          }
        }
        this.flags = false
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }

}
</script>

<style scoped lang="scss">
.button-message-drag{
  position: fixed;
  right: 25px;
  bottom: 128px;
  width: 68px;
  //height: 128px;
  height: 64px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #C18608;
  border: 1px solid #FFBD34;
  box-shadow: 0px 8px 10px 0px rgba(0, 19, 64, 0.3);
  border-radius: 2px;
  color: $white;
  font-size: 14px;
  font-weight: 400;
  padding:8px 0;
  z-index: 100;

  section{
    cursor: pointer;
  }

  .icon{
    display: inline-block;
    width: 40px;
    height: 18px;
    line-height: 18px;
    font-size: 16px;
  }
}
</style>
