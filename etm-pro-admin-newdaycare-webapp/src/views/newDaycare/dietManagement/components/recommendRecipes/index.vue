<template>
  <div class="index-wrap">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <el-table-column
        slot="right"
        label="操作"
      >
        <template>
          <etm-text @click="applyRecipe">
            引用食谱
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-pop
      :visible="isShowApplyPopup"
      pop="complex"
      title="引用食谱"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseApply"
      @cancel="popCloseApply"
      @confirm="popConfirmApply"
    >
      <div class="popContent">
        <apply-pop
          v-if="isShowApplyPopup"
          ref="childPopForm"
        />
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/3/12 16:00
 */
import applyPop from '../recommendRecipes/components/applyPop'
export default {
  name: 'Index',
  components: { applyPop },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      isShowApplyPopup: false,
      tableData: {
        content: [
          { gradeName: '1111' }
        ]
      },
      columns: [ // 表格的列表头传值
        {
          label: '食谱封面',
          prop: 'gradeName'
        },
        {
          label: '食谱名称',
          prop: 'gradeName'
        },
        {
          label: '录入日期',
          prop: 'gradeName'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    currentChange () {
      this.init()
    },
    init () {
    },
    // 引用食谱
    applyRecipe () {
      this.isShowApplyPopup = true
    },
    popConfirmApply () {
      this.isShowApplyPopup = false
    },
    popCloseApply () {
      this.isShowApplyPopup = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
