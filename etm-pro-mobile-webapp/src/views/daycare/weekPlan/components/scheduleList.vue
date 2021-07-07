<script>
/**
 * scheduleList create by Administrator
 * createTime 2020/10/20 11:13
 */
export default {
  name: 'ScheduleList',
  components: {},
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: 'icon'
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: '#ccc'
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    this.vnode = this.$slots.default
  },
  mounted() {
  },
  // <van-icon name="fire-o" />
  methods: {
    renderSlot(h, vnode) {
      // 图标类型
      let icon = null
      switch (this.type) {
        case 'image' :
          icon = h('van-image', {
            style: {
              color: this.iconColor
            },
            attrs: {
              width: 16,
              height: 16,
              src: this.icon
            }
          })
          break
        case 'icon' :
          icon = h('van-icon', {
            style: {
              color: this.iconColor
            },
            attrs: {
              name: this.icon
            }
          })
          break
      }

      return vnode.map(cur => {
        return h('div', {
          class: ['scheduleList-item']
        }, [h('div', {
          class: ['schedule-icon']
        }, [icon]), h('div', {
          class: ['scheduleList-plan']
        }, [cur])])
      })
    }
  },
  render(createElement) {
    return createElement('div', {
      class: ['scheduleList-wrap']
    }, this.renderSlot(createElement, this.$slots.default))
  }
}
</script>
<style lang="scss" scoped>
.scheduleList-wrap {
  padding: 20px 24px 0 24px;

  .scheduleList-item {

    padding-bottom: 16px;
    position: relative;
    overflow: hidden;

    &:first-child:before,
    &:last-child:after {
      display: none;
    }

    &:after {
      position: absolute;
      top: calc(50% + 6px);
      left: 10px;
      border-left: 1px dashed $theme;
      content: '';
      opacity: .5;
      height: 100px;
      display: block;
    }

    &:before {
      position: absolute;
      top: 0;
      left: 10px;
      border-left: 1px dashed $theme;
      opacity: .5;
      content: '';
      height: calc(50% - 20px);
      display: block;
    }

    .schedule-icon {
      position: absolute;
      left: 11px;
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      top: 50%;
      transform: translate(-50%, -16px);
    }

    .scheduleList-plan {
      background: #fff;
      padding: 16px 12px;
      border-radius: 4px;
      margin-left: 28px;
      text-align: left;
    }
  }
}
</style>
