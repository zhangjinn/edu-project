<template>
  <div class="index-wrap">
    <etm-table
      :columns="columns"
      :data="tableData"
      index
    >
      <etm-table-tool-bar slot="tool">
        <etm-table-digit :data="tipData" />
        <div slot="right">
          <el-button type="primary">
            重新计划
          </el-button>
          <el-dropdown @command="moreMenu">
            <el-button plain>
              更多菜单<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="showSetting">
                显示设置
              </el-dropdown-item>
              <el-dropdown-item command="dietPlan">
                膳食计划报表
              </el-dropdown-item>
              <el-dropdown-item command="dietPlanSum">
                膳食计划汇总表
              </el-dropdown-item>
              <el-dropdown-item command="monthDietPlan">
                月伙食计划表
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </etm-table-tool-bar>
      <template slot="left">
        <el-table-column
          label="单价（元/斤）"
          prop="b"
        >
          <template slot-scope="{ row }">
            <el-form
              :model="row"
            >
              <el-form-item
                prop="b"
                :rules="[formValidate.isNumberRule()]"
              >
                <el-input
                  v-model="row.b"
                  @blur="priceChange(row)"
                />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
    </etm-table>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/3/12 16:00
 */
import formValidate from '@/utils/rules'
export default {
  name: 'Index',
  components: { },
  filters: {},
  mixins: [],
  props: {
    date: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns: [
        { label: '食材名称', prop: 'a', fixed: 'left', minWidth: 220 },
        { label: '每人每日用量（克）', prop: 'c' },
        { label: '能量（kcal）', prop: 'd' },
        { label: '蛋白质（克）', prop: 'e' },
        { label: '钙（毫克）', prop: 'f' },
        { label: '锌（毫克）', prop: 'g' },
        { label: '铁（毫克）', prop: 'h' },
        { label: '钠（毫克）', prop: 'i' },
        { label: '维生素A（微克）', prop: 'j' },
        { label: '维生素B2（毫克）', prop: 'k' },
        { label: '维生素C（毫克）', prop: 'l' },
        { label: '每人每月用量（斤）', prop: 'm' },
        { label: '所需费用（月）', prop: 'n' },
        { label: '全园每月用量（斤）', prop: 'o' },
        { label: '全园每周用量（斤）', prop: 'p' }
      ],
      tableData: [
        {
          a: '胡萝卜（红）[金笋，丁香萝卜]',
          b: '',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '1',
          i: '1',
          j: '1',
          k: '1',
          l: '1',
          m: '1',
          n: '1',
          o: '1',
          p: '1'
        },
        {
          a: '黄瓜[胡瓜]',
          b: '2',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '1',
          i: '1',
          j: '1',
          k: '1',
          l: '1',
          m: '1',
          n: '1',
          o: '1',
          p: '1'
        },
        {
          a: '木耳（干）[黑木耳、云耳]',
          b: '',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '1',
          i: '1',
          j: '1',
          k: '1',
          l: '1',
          m: '1',
          n: '1',
          o: '1',
          p: '1'
        }
      ],
      tipData: [
        {
          digit: '2020年2月',
          text: '计划范围'
        },
        {
          digit: '22',
          text: '计划天数'
        },
        {
          digit: '222',
          text: '计划人数'
        }
      ],
      formValidate: formValidate
    }
  },
  computed: {},
  watch: {
    date: {
      handler (val) {
        console.log(val)
        this.tipData[0].digit = val.substring(0, 7)
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    priceChange (row) {
      console.log(row)
    },
    moreMenu (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
