<template>
  <div ref="EtmLayoutSplit" class="EtmLayoutSplit-wrap" :style="styles">

    <!--左右布局-->
    <template v-if="$slots.left">
      <div
        v-if="$slots.left"
        class="layout-left"
        :style="[leftStyles]"
      >
        <slot name="left" />
      </div>
      <div v-if="$slots.right" class="layout-right" :style="rightStyles">
        <slot name="right" />
      </div>
    </template>

    <!--上下布局-->
    <template v-if="$slots.header">
      <div v-if="$slots.header" class="layout-header" :style="headerStyles">
        <slot name="header" />
      </div>
      <div v-if="$slots.body" class="layout-body" :style="bodyStyles">
        <slot name="body" />
      </div>
    </template>

    <!--默认布局-->
    <div v-if="$slots.default" class="layout-default" :style="defaultStyles">
      <slot />
    </div>
  </div>

</template>

<script>
/**
 * LayoutSplit create by haijinsha
 * createTime 2020/7/6 10:53
 */

// const WIDTH_MAP = {
//   big: '500px',
//   small: '250px'
// }
export default {
  name: 'EtmLayoutSplit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    styles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    // type: {
    //   type: String,
    //   required: false,
    //   default: '',
    //   validator(val) {
    //     return ['big', 'small'].includes(val)
    //   }
    // },
    leftStyles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    rightStyles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    headerStyles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    bodyStyles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    defaultStyles: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    // typeToWidth() {
    //   return WIDTH_MAP[this.type] || ''
    // }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.$slots.left) {
          this.$refs['EtmLayoutSplit'].style.flexDirection = 'row'
        } else if (this.$slots.header) {
          this.$refs['EtmLayoutSplit'].style.flexDirection = 'column'
        }
      })
    }
  }
}
</script>
<style lang="scss">
    @import "../../styles/src/etm/layout-split";
</style>
