<template>
  <div class="mealsCollapse-wrap">
    <etm-layout-split v-if="'date' in collapseData">
      <etm-title border size="big">报餐详情</etm-title>
      <etm-field-label label="报餐日期" type="left">{{ showTime(collapseData.date) }}</etm-field-label>
      <etm-field-label label="学生餐" type="left">{{ collapseData.childMealAmount }}</etm-field-label>
      <etm-field-label label="员工餐" type="left">{{ collapseData.employeeMealAmount }}</etm-field-label>
      <el-collapse v-model="collapseActiveNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in collapseData.list"
          :key="index"
          :name="index"
        >
          <!--          `${item.clazzName} ${item.childMealAmount + item.employeeMealAmount}`-->
          <template slot="title">
            {{ item.clazzName }}<span class="title-count">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.childMealAmount + item.employeeMealAmount }}</span>
          </template>
          <etm-field-label label="报餐老师" type="left">{{ item.orderPersonName }}</etm-field-label>
          <etm-field-label label="学员餐" type="left">{{ item.childMealAmount }}</etm-field-label>
          <etm-field-label label="员工餐" type="left">{{ item.employeeMealAmount }}</etm-field-label>
          <etm-field-label label="备注" type="left">{{ item.remark }}</etm-field-label>
        </el-collapse-item>
      </el-collapse>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * mealsCollapse create by 油麦菜
 * createTime 2020/9/18 15:58
 */
import { mealOrderDetail } from '@/api/newDaycare/melasRecord'
import { parseTime } from '@/utils'

export default {
  name: 'MealsCollapse',
  components: {},
  filters: {},
  mixins: [],
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      collapseActiveNames: ['1'],
      collapseData: {}
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
  destroyed() {
  },
  methods: {
    init() {
      mealOrderDetail({
        date: this.date
      }).then(res => {
        if (res.message === '成功') {
          this.collapseData = res.data
        } else {
          this.$message({
            type: 'error',
            message: '访问失败，请重新访问'
          })
        }
      })
    },
    handleChange(val) {
    }
  }
}
</script>
<style lang="scss" scoped>
.mealsCollapse-wrap {
  .title-count {
    color: $main-color;
  }
}
</style>
