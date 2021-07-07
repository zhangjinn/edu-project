<template>
  <div ref="dragButton" class="dragButton" :type="type" :size="size" :position="position" :style="{top: top + 'px'}">
    <template v-if="iconDirection === 'left'">
      <span class="iconfont iconleft" />
      <span>{{ text }}</span>
    </template>
    <template v-else>
      <span>{{ text }}</span>
      <span class="iconfont iconright" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'DragButton',
  props: {
    size: {
      type: String,
      default() {
        return null
      }
    },
    iconDirection: {
      type: String,
      default() {
        return null
      }
    },
    position: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    },
    text: {
      type: String,
      default() {
        return null
      }
    },
    top: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  mounted() {
    const _this = this
    const dom = this.$refs.dragButton
    const maxH = document.body.clientHeight - dom.offsetHeight
    let scrollH = ''
    let top = ''
    let firstTime = ''
    let lastTime = ''
    dom.addEventListener('touchstart', function(e) {
      const ev = e || window.event
      const touch = ev.targetTouches[0]
      top = dom.offsetTop
      scrollH = touch.screenY
      firstTime = new Date().getTime()
      document.addEventListener('touchmove', e.preventDefault(), false)
    })
    dom.addEventListener('touchmove', function(e) {
      const ev = e || window.event
      const touch = ev.targetTouches[0]
      const height = touch.screenY - scrollH
      if (height + top < 0) {
        dom.style.top = '0px'
      } else if (height + top > maxH) {
        dom.style.top = maxH + 'px'
      } else {
        dom.style.top = height + top + 'px'
      }
    })
    dom.addEventListener('touchend', function(e) {
      lastTime = new Date().getTime()
      if ((lastTime - firstTime) < 200) {
        _this.buttonClick()
      }
      document.removeEventListener('touchmove', e.preventDefault())
    })
  },
  methods: {
    buttonClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
    .dragButton {
        position: fixed;
        padding: 0 15px 0 20px;
        height: 32px;
        font-size: 15px;
        line-height: 30px;
        background-color: $white;
        border: 1px solid $text-e;
        @include border-radius(16px 0 0 16px);
        box-shadow: 0px 1px 6px 0px rgba(222, 222, 222, 0.6);

        .iconfont {
            font-size: 12px;
            color: $text-6;
        }

        .iconleft {
            margin-right: 4px;
        }

        .iconright {
            margin-left: 6px;
        }

        &[position="left"] {
            left: 0;
        }

        &[position="right"] {
            right: 0;
        }

        &[type="primary"] {
            color: $theme;

            .iconfont {
                color: $theme;
            }
        }

        &[size="small"] {
            padding: 0 10px;
            height: 28px;
            font-size: 12px;
            line-height: 26px;
            @include border-radius(14px 0 0 14px);
        }
    }
</style>
