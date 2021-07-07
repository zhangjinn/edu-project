<template>
  <div class="etmSide">
    <el-drawer
      v-bind="attributes"
      v-on="events"
    >
      <slot />
      <component :is="attributes.content" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'EtmSide',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '请加上标题'
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    size: {
      type: [String, Number],
      default: '420'
    },
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    elementAttributes: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    elementEvents: {
      type: Object
    }
  },
  computed: {
    attributes() {
      const propsArr = ['visible', 'title', 'appendToBody', 'direction', 'size', 'content']
      const userObj = {}
      propsArr.forEach(v => {
        userObj[v] = this[v]
      })
      return Object.assign({}, userObj, this.elementAttributes)
    },
    events() {
      const userObj = {
        open: this.handleOpen,
        close: this.handleClose
      }
      return Object.assign({}, userObj, this.elementEvents)
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleOpen() {
      this.$emit('open')
    }
  }
}
</script>

<style lang="scss">
  .el-drawer > header > span:focus {
    outline-color: white;
  }
  .el-drawer > header > button:focus {
    outline-color: white;
  }
  .el-drawer > header > button:hover {
    color: rgb(64, 158, 255);
  }
.el-drawer.rtl {
  @include bgc_white();
  width: 420px;
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0 18px 0 24px;
    min-height: 55px;
    border-bottom: 1px solid;
    @include bc_divide_color();
    & > span {
      font-size: $title-fontSize;
      @include c_title_color();
    }
    .el-dialog__close:hover {
      @include c_main_color();
    }
  }
  .el-drawer__body {
    // padding-top: 16px;
    /*margin-top: 56px;*/
  }
}
</style>
