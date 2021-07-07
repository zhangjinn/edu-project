<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="tabsActivateName" :setting="hasAuthOfBool('daycare.mealsRecord.setting')" @setting="setting">
            <el-tab-pane label="报餐统计" name="mealsRecord">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="handleReset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page :data="tableData" :columns="columns" @currentChange="currentChange">
            <etm-table-tool-bar slot="tool">
              <etm-table-digit :data="tipData" />
            </etm-table-tool-bar>
            <el-table-column label="日期" width="120" fixed>
              <template slot-scope="{row}">
                <etm-text @click="mealsDetail(row)">{{ showTime(row.date) }}</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <!--  报餐详情  -->
    <etm-drawer :visible.sync="showMeals">
      <meals-collapse v-if="showMeals" :date="monthProp" />
    </etm-drawer>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/18 9:52
 */
import mealsCollapse from './components/mealsCollapse'
import EtmTableDigit from '@/components/EtmTableDigit'
import { mealsOrder } from '@/api/newDaycare/melasRecord'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Index',
  components: {
    mealsCollapse,
    EtmTableDigit
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabsActivateName: 'mealsRecord',
      monthProp: '',
      showMeals: false,
      formData: [
        {
          label: '月份',
          type: 'date',
          value: '',
          prop: 'time',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'month',
            placeholder: '年/月',
            clearable: false,
            'picker-options': {
              disabledDate(time) {
                return time.getTime() > new Date().getTime()
              }
            }
          }
        }
      ],
      // totalChildMealAmount: '',
      // totalEmpMealAmount: '',
      // percentTotalChildMealAmount: '',
      tipData: [],
      columns: [
        {
          label: '报餐班级数量',
          prop: 'orderCourseAmount'
        },
        {
          label: '学员普通餐数量',
          prop: 'childNormalMealAmount'
        },
        {
          label: '特殊学员餐数量',
          prop: 'childSpecMealAmount'
        },
        {
          label: '员工餐数量',
          prop: 'employeeMealAmount'
        },
        {
          label: '总报餐数',
          prop: 'totalMealAmount'
        },
        {
          label: '学生餐/员工餐',
          prop: 'percentChildEmployee'
        }
      ],
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: []
      }
    }
  },
  computed: {
    showTime() {
      return time => {
        return parseTime(time, '{y}-{m}-{d}')
      }
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const obj = {
        date: this.getObjectByProp('time', this.formData).value,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        paged: true
      }
      mealsOrder(obj).then(res => {
        if (res.message === '成功') {
          // console.log(res)
          // this.totalChildMealAmount = res.data.totalChildMealAmount
          // this.totalEmpMealAmount = res.data.totalEmpMealAmount
          // this.percentTotalChildMealAmount = res.data.percentTotalChildMealAmount
          this.tipData = []
          this.tipData.push(
            {
              digit: `${res.data.totalChildMealAmount}/${res.data.totalEmpMealAmount}`,
              text: '学员餐总数/员工餐总数'
            },
            {
              digit: res.data.percentTotalChildMealAmount,
              text: '报餐人效'
            }
          )
          this.tableData = res.data.list
        }
      })
    },
    setting() {
      this.$router.push('/newdaycare_mealsRecordSetting')
    },
    mealsDetail(row) {
      this.monthProp = parseTime(row.date, '{y}-{m}-{d}')
      this.showMeals = true
    },
    changeDate(val) {
      this.formData.month = parseTime(val.getTime(), '{y}-{m}-{d}')
    },
    handleSearch() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    handleReset() {
      this.pageInfo.pageNum = 1
      // this.init()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    handleChange(val) {
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
