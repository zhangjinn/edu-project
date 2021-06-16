<template>
  <div class="EtmDrawer-wrap" :style="{position: visibility ? 'absolute': 'static'}">
    <span
      v-if="visibility && showClose"
      :style="{zIndex: zIndex}"
      :class="[
        'close',
        'close--' + type
      ]"
      @click="close"
    >X</span>
    <el-drawer
      ref="elDrawer"
      v-bind="$attrs"
      :size="size"
      :with-header="false"
      :modal-append-to-body="false"
      :visible.sync="visibility"
    >

      <slot />
    </el-drawer>
  </div>

</template>

<script>
/**
 * EtmDrawer create by haijinsha
 * createTime 2020/8/18 11:36
 */
export default {
  name: 'EtmDrawer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'small',
      validator(val) {
        return ['big', 'small'].includes(val)
      }
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zIndex: 2000
    }
  },
  computed: {
    visibility: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    size() {
      const config = {
        big: '980px',
        small: '420px'
      }
      return config[this.type]
    }
  },
  watch: {
    visibility() {
      this.$nextTick(() => {
        setTimeout(() => {
          document.activeElement.blur()
          this.zIndex = parseInt(this.$refs.elDrawer.$el.style.zIndex)
        }, 16)
      })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    close() {
      if (this.$attrs['before-close']) {
        this.$attrs['before-close'](done => {
          this.visibility = false
          this.$emit('close')
        })
      } else {
        this.visibility = false
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../styles/src/etm/drawer";
</style>
