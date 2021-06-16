<!--suppress JSUnfilteredForInLoop -->
<template>
  <div
    class="EtmTablePage-wrap"
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
      :data="data.content"
      :header-cell-style="{background: '#fafafa'}"
      v-on="$listeners"
    >
      <el-table-column v-if="selection" fixed="left" type="selection" width="60" align="center" />
      <el-table-column v-if="index" fixed="left" type="index" width="60" align="center" :label="indexLabel" />

      <slot name="left" />
      <el-table-column
        v-for="(col, idx) of columns"
        :key="idx"
        :show-overflow-tooltip="true"
        :min-width="minWidth(col)"
        v-bind="{...col}"
      />
      <slot />
      <slot name="right" />
      <template slot="empty">
        <etm-empty v-bind="$attrs" />
      </template>
    </el-table>
    <el-pagination
      v-if="showPage"
      :current-page.sync="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :page-sizes="pageSizes"
      :total="data.totalElements"
      class="etm-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      v-bind="$attrs"
      @current-change="currentChange"
      @size-change="sizeChange"
      v-on="$listeners"
    />
  </div>
</template>

<script>/**
 *  2020/4/26 11:11
 *  haijinsha
 */
import EtmEmpty from '~/EtmEmpty/src/EtmEmpty'
import { throttle } from '~/utils/tool'

const MIN_HEIGHT = 50
const OFFSET_TOP = 66
const SPLIT_SYMBOL = '--'
export default {
  name: 'EtmTablePage',
  components: { EtmEmpty },
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left',
      validator(val) {
        return ['left', 'center', 'right'].includes(val)
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 100]
      }
    },
    offsetTop: {
      type: Number,
      default() {
        return OFFSET_TOP
      }
    },
    border: {
      type: Boolean,
      default: true
    },
    showPage: {
      type: Boolean,
      default: true
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
      indexType: '',
      tableHeight: MIN_HEIGHT,
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {
    'data': {
      async handler(data) {
        await this.transformDataNullToSymbol(data.content)
        await this.calcMinWidth()
        this.pageInfo.pageNum = data.pageNum
        this.$nextTick(() => {
          this.$refs.etmTable && this.$refs.etmTable.doLayout()
        })
      },
      deep: true
    }
  },
  created() {
    this.calcMinWidth()
  },
  mounted() {
    // setTimeout(() => {
    //   this.autoHeight()
    // }, 500)
    //
    // window.addEventListener('resize', () => {
    //   this.autoHeight()
    // })
    // window.addEventListener('click', () => {
    //   this.autoHeight()
    // })

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
      if (col.type) {
        console.error('如需要index/seletion等属性请直接传入index/selection')
      }
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
        // 修复空组件
        if (!node.componentOptions) {
          return
        }
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }

        if (node.componentOptions.propsData.type) {
          node.componentOptions.propsData.width = this.minWidth(node.componentOptions.propsData)
          node.componentOptions.propsData.align = 'center'
        }
      })
      this.$slots.right && this.$slots.right.forEach(node => {
        if (!node.componentOptions) {
          return
        }
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }
        if (node.componentOptions.propsData.type) {
          node.componentOptions.propsData.width = this.minWidth(node.componentOptions.propsData)
          node.componentOptions.propsData.align = 'center'
        }
      })
      this.$slots.default && this.$slots.default.forEach(node => {
        if (!node.componentOptions) {
          return
        }
        if (node.componentOptions.propsData.label) {
          node.componentOptions.propsData.minWidth = this.minWidth(node.componentOptions.propsData)
        }
        if (node.componentOptions.propsData.type) {
          node.componentOptions.propsData.width = this.minWidth(node.componentOptions.propsData)
          node.componentOptions.propsData.align = 'center'
        }
      })
    },
    init() {
      this.$refs.etmTable && this.$refs.etmTable.doLayout()
    },
    autoHeight() {
      this.$nextTick(() => {
        this.$refs.etmTable && setTimeout(() => {
          const height = window.innerHeight - this.$refs.etmTable.$el.offsetTop - this.offsetTop
          this.tableHeight = height < MIN_HEIGHT ? MIN_HEIGHT : height
        }, 500)
      })
    },
    currentChange(pageNum) {
      this.pageInfo.pageNum = pageNum
      this.emit()
    },
    sizeChange(size) {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = size
      this.emit()
    },
    emit() {
      const { pageNum, pageSize } = this.pageInfo
      this.$emit('currentChange', pageNum, pageSize)
    }
  }
}
</script>

<style lang="scss">
  @import "../../styles/src/etm/tablePage";
</style>
