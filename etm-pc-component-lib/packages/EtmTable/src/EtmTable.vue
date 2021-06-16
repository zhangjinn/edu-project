<template>
  <div
    class="EtmTable-wrap"
    :class="[
      {
        tool: $slots.tool
      }
    ]"
  >
    <div v-if="$slots.tool">
      <slot name="tool" />
    </div>
    <el-table
      ref="etmTable"
      style="transition: all .2s"
      :border="border"
      v-bind="$attrs"
      :stripe="stripe"
      :header-cell-style="{background: '#fafafa'}"
      v-on="$listeners"
    >
      <el-table-column v-if="selection" fixed="left" type="selection" width="60" align="center" />
      <el-table-column v-if="index" fixed="left" type="index" width="60" align="center" :label="indexLabel" />
      <slot name="left" />
      <el-table-column
        v-for="(col, index) of columns"
        :key="index"
        :show-overflow-tooltip="true"
        :min-width="minWidth(col)"
        :align="col.align || align"
        v-bind="{...col}"
      />
      <slot />
      <slot name="right" />
      <template slot="empty">
        <etm-empty v-bind="$attrs" />
      </template>
    </el-table>
  </div>

</template>

<script>
import EtmEmpty from '~/EtmEmpty/src/EtmEmpty'
import { throttle } from '~/utils/tool'

/**
 * EtmTable create by haijinsha
 * createTime 2020/6/30 14:55
 */
const MIN_HEIGHT = 50
const OFFSET_TOP = 36
const SPLIT_SYMBOL = '--'
export default {
  name: 'EtmTable',
  components: { EtmEmpty },
  filters: {},
  mixins: [],
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    border: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'left',
      validator(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    height: {
      type: Number,
      default: 0
    },
    stripe: {
      type: Boolean,
      default: true
    },
    fontWidth: {
      type: Number,
      default: 16
    },
    index: {
      type: Boolean,
      default: false
    },
    indexLabel: {
      type: String,
      default: '序号'
    },
    selection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: 50
    }
  },
  computed: {},
  watch: {
    '$attrs.data'(value) {
      console.log(value)
      this.transformDataNullToSymbol(value)
      this.calcMinWidth()
    }
  },
  created() {
    this.calcMinWidth()
  },
  mounted() {
    function resize() {
      window.addEventListener('resize', throttle(() => {
        this.$nextTick(() => {
          this.$refs.etmTable && this.$refs.etmTable.doLayout()
        })
      }))
    }

    this.$on('hook:mounted', resize)
    this.$on('hook:destroyed', resize)
    this.$nextTick(() => {
      setTimeout(() => {
        this.init()
      }, 100)
    })
  },
  methods: {
    transformDataNullToSymbol(data) {
      data.forEach(item => {
        for (const itemKey in item) {
          if (item[itemKey] === null) {
            item[itemKey] = SPLIT_SYMBOL
          }
          if (item[itemKey] === undefined) {
            item[itemKey] = SPLIT_SYMBOL
          }
          if (item[itemKey] === '') {
            item[itemKey] = SPLIT_SYMBOL
          }
        }
      })
    },
    /**
     * 设置最小宽度为60
     * 如果有传入minWidth就根据minWidth来设置, 否则就根据label的字段length来计算
     * 权重 minWidth > label.length
     * @param col
     * @returns {number}
     */
    minWidth(col) {
      let minWidth = 60

      if (col.label) {
        const padding = 10 + 16
        minWidth = col.label.length * this.fontWidth + padding
      }
      if (col.minWidth) {
        minWidth = col.minWidth
      }
      return minWidth
    },
    calcMinWidth() {
      this.$slots.left && this.$slots.left.forEach(node => {
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }
      })
      this.$slots.right && this.$slots.right.forEach(node => {
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }
      })
      this.$slots.default && this.$slots.default.forEach(node => {
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }
      })
    },
    init() {
      this.$refs.etmTable && this.$refs.etmTable.doLayout()
    },
    autoHeight() {
      this.$nextTick(() => {
        if (this.height) {
          return
        }
        this.$refs.etmTable && setTimeout(() => {
          const height = window.innerHeight - this.$refs.etmTable.$el.offsetTop - OFFSET_TOP
          this.tableHeight = height < MIN_HEIGHT ? MIN_HEIGHT : height
        }, 500)
      })
    }
  }
}
</script>
<style lang="scss">
  @import "../../styles/src/etm/table";
</style>
