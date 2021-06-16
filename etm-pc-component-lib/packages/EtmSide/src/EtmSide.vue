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
      default: 'rtl',
      validator(value) {
        return ['rtl', 'ltr', 'ttb', 'btt'].indexOf(value) !== -1
      }
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
@import "../../styles/src/etm/side";
</style>
