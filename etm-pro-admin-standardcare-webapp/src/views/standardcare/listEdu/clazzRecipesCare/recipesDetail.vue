<template>
  <!--  <etm-main-body>-->
  <div class="recipesDetail">
    <EtmWeeklyCalendar
      v-if="customizeTime"
      ref="xlsxTable"
      :table-data="tableData"
      :add="false"
      :customize-time="customizeTime"
      @handleUpDate="handleUpDate"
    >
      <template slot="toolLeft">
        <span class="clazzName">{{ clazzName }}</span>&nbsp;&nbsp;
      </template>

      <span class="weekDayRange">
        <span>{{ weekDayRange.weekStartDay }}</span>至
        <span>{{ weekDayRange.weekEndDay }}</span>&nbsp;&nbsp;
        <span>{{ weekDayRange.yearName }}</span>&nbsp;&nbsp;
        第&nbsp;<span>{{ weekDayRange.weekName }}</span>&nbsp;周
      </span>

      <template slot="toolRight">
        <div class="showIngredients">
          <el-checkbox
            v-model="checked"
            @change="changeCheckbox"
          >
            显示食材用量
          </el-checkbox>
        </div>
        <el-button
          slot="right"
          plain
          class="exportBtn"
          @click="exportTable"
        >
          导出Excel
        </el-button>
      </template>
      <template v-slot:cell="data">
        <div
          v-for="(item,index) in data.cellList"
          :key="index"
          class="list-group-item"
        >
          <cellList
            type="recipesDetail"
            :data="item"
            :show-ingredients="checked"
          />
        </div>
      </template>
    </EtmWeeklyCalendar>
  </div>
<!--  </etm-main-body>-->
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
// import etmMainBody from '@/components/EtmMainBody'
import EtmWeeklyCalendar from '@/components/EtmWeeklyCalendar/index'
import cellList from './cellList'
import {
  queryWeekRecipesDetail
} from '@/api/standardcare/clazzRecipesCare'
export default {
  name: 'RecipesDetail',
  components: {
    // etmMainBody,
    EtmWeeklyCalendar,
    cellList
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      checked: false,
      tableData: {
        title: '时段',
        content: []
      },
      weekDayRange: {
        weekStartDay: '',
        weekEndDay: '',
        tuesday: '', // 和element-ui 周日历默认周二同步
        weekName: '',
        yearName: ''
      },
      clazzId: null,
      clazzName: null,
      customizeTime: null,
      recipesItemId: null,
      recipesItemListId: null

    }
  },

  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.clazzId = null
        this.customizeTime = null
        if (val.name === 'standardcare_clazzRecipesDetail') {
          this.clazzId = this.$route.query.clazzId
          this.clazzName = this.$route.query.clazzName
          this.customizeTime = this.$route.query.weekStartDate
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 切换周食谱
    handleUpDate (dateObj) {
      // console.log('handleUpDate=====')
      this.weekDayRange.weekStartDay = dateObj.weekStartDay
      this.weekDayRange.weekEndDay = dateObj.weekEndDay
      this.weekDayRange.tuesday = dateObj.tuesday
      this.weekDayRange.yearName = new Date(this.weekDayRange.tuesday).getFullYear()
      this.weekDayRange.weekName = getWeek(new Date(this.weekDayRange.tuesday))
      this.init()
      function getWeek (date) {
        let time = null
        let week = null
        const checkDate = new Date(date)
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7))
        time = checkDate.getTime()
        checkDate.setMonth(0)
        checkDate.setDate(1)
        week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1
        return week
      }
    },
    init () {
      queryWeekRecipesDetail({
        startDate: this.weekDayRange.weekStartDay,
        endDate: this.weekDayRange.weekEndDay,
        clazzId: this.clazzId
      }).then((res) => {
        this.tableData.content = res.data
      })
    },

    // 是否显示食材
    changeCheckbox (val) {
      this.checked = val
    },

    // 导出
    exportTable () {
      this.exportTableToExcel({
        ref: this.$refs.xlsxTable.$refs.weeklyCalendarTable.$el,
        name: `${this.clazzName}`,
        sheetName: this.clazzName,
        opt: {
          formatter: (key, cell, v) => {
            if (v && typeof v === 'string') {
              if (key.replace(/[^0-9]/ig, '') === '1') {
                return v.replaceAll(' ', '\n')
              } else {
                return v.replaceAll('编辑删除', '\n')
              }
            }
            return v
          }
        }
      })
    }

  }

}
</script>

<style scoped lang="scss">
.recipesDetail {
  background-color: $white;
  padding: 24px;

  .weekDayRange {
    margin-right: 24px;
  }
}

.exportBtn {
  margin-left: 24px;
}

.nonSchoolDay {
  color: #999;
  font-size: 14px;
  text-align: center;
}

.showIngredients {
  margin-left: 24px;
}

</style>
