<template>
  <div class="EtmTablePage-wrap">
    <div class="tool">
      <div class="toolLeft">
        <slot name="toolLeft" />
      </div>

      <div class="toolRight">
        <slot />
        <EtmWeeklyChangeTag
          v-show="weekTag"
          :custom-default-date="customizeTime"
          @weekClick="weekClick"
        />
        <slot name="toolRight" />
      </div>
    </div>
    <el-table
      ref="weeklyCalendarTable"
      v-bind="$attrs"
      :data="tableData.content"
      class="etm-table"
      border
      v-on="$listeners"
    >
      <el-table-column
        v-for="(col, index) of columns"
        :key="index"
        :label="col.label"
        v-bind="{...col}"
      >
        <template slot-scope="scope">
          <div v-if="col.prop==='label'">
            <span>
              {{ scope.row.label.name }}
            </span>
          </div>
          <div
            v-else
            class="cellContent"
          >
            <slot
              name="cell"
              :labelId="scope.row.label.id"
              :labelName="scope.row.label.name"
              :cellList="scope.row.data[col.prop]"
              :colProp="col.prop.toUpperCase()"
            />
            <EtmCellAddBtn
              v-if="add && scope.row.data[col.prop]"
              @click.native.stop="editCell(scope.row.label.id, scope.row.data[col.prop], col.prop, scope.row.label.name)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import EtmWeeklyChangeTag from './components/EtmWeeklyChangeTag'
import EtmCellAddBtn from './components/EtmCellAddBtn'

export default {
  name: 'Index',
  components: {
    EtmWeeklyChangeTag,
    EtmCellAddBtn
  },
  props: {
    tableData: {
      type: Object,
      required: true
    },
    weekTag: {
      type: Boolean,
      default: true
    },
    add: {
      type: Boolean,
      default: true
    },
    titleTime: {
      type: Boolean,
      default: true
    },
    customizeTime: {
      type: String, // 2020-20-10
      default: function () {
        return ''
      }

    }

  },
  data () {
    return {
      columns: [ // 表格的列表头传值
        {
          label: '上课时段',
          prop: 'label'
        },
        {
          label: '周一',
          prop: 'mon'
        },
        {
          label: '周二',
          prop: 'tues'
        },
        {
          label: '周三',
          prop: 'wed'
        },
        {
          label: '周四',
          prop: 'thur'
        },
        {
          label: '周五',
          prop: 'fri'
        },
        {
          label: '周六',
          prop: 'sat'
        },
        {
          label: '周日',
          prop: 'sun'
        }
      ],
      weekStartDay: '',
      weekEndDay: ''
    }
  },

  methods: {
    // labelId左侧第一列id，cellList单元格数据列表，colProp表头prop值
    editCell (labelId, cellList, colProp, labelName) {
      const col = colProp.toUpperCase()
      this.$emit('handleAdd', labelId, cellList, col, labelName)
    },
    changeColumnTitle () {
      this.columns[0].label = this.tableData.title
    },

    // 通过按钮切换更改日期
    weekClick (week) {
      this.columns[0].label = this.tableData.title
      if (!this.titleTime) {
        return
      }
      const dataArr = []
      const obj = {}
      week.map((val, index) => {
        dataArr.push(val.titleDate)
      })
      this.columns.map((val, index) => {
        if (val.prop !== 'label') {
          // val.label = dataArr[index - 1]
        }
      })
      obj.weekStartDay = week[0].formatDate
      obj.weekEndDay = week[6].formatDate
      obj.tuesday = week[1].formatDate
      obj.wednesday = week[2].formatDate
      obj.thursday = week[3].formatDate
      obj.friday = week[4].formatDate
      obj.saturday = week[5].formatDate

      this.$emit('handleUpDate', obj)
    }

    // 自定义日期
    // getWeek(input_day) {
    //   if (!input_day) {
    //     return
    //   }
    //   // 一天里一共的毫秒数
    //   const oneDayTime = 1000 * 60 * 60 * 24
    //   const today = new Date(input_day)
    //   // 若那一天是周末时，则强制赋值为7
    //   const todayDay = today.getDay() || 7
    //   const startDate = new Date(
    //     today.getTime() - oneDayTime * (todayDay - 1)
    //   )
    //   const dateList = []
    //   let temp = ''
    //   for (let i = 0; i < 7; i++) {
    //     temp = new Date(startDate.getTime() + i * oneDayTime)
    //
    //     dateList[i] = this.formatDate(temp)
    //   }
    //   console.log(dateList)
    //   this.columns.map((val, index) => {
    //     if (val.prop !== 'label') {
    //       val.label = dateList[index - 1]
    //     }
    //   })
    // },
    // formatDate(date) {
    //   const seperator = '.'
    //   let month = date.getMonth() + 1
    //   let day = date.getDate()
    //   const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
    //
    //   if (month >= 1 && month <= 9) {
    //     month = '0' + month
    //   }
    //   if (day >= 0 && day <= 9) {
    //     day = '0' + day
    //   }
    //   return week + '(' + month + seperator + day + ')'
    // }

  }

}
</script>

<style lang="scss" scoped>
  .EtmTablePage-wrap {
    ::v-deep.el-table__header-wrapper {
      th {
        border-left: 0;
        border-right: 0;
      }
    }

    ::v-deep.el-table--border {
      border-left: 0;
    }

    ::v-deep.el-table__row {
      td:first-child {
        border-left: 1px solid #ebeef5;
      }

      .cell {
        display: flex;
        padding-left: 8px;
        padding-right: 8px;
      }
    }

    .el-table--border::after,
    .el-table--group::after {
      width: 0;
    }

    .tool {
      margin-bottom: 16px;
    }

    .tool,
    .toolLeft,
    .toolRight {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .cellContent {
      width: 100%;

    }

  }
</style>
<style lang="scss">
.EtmTablePage-wrap .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: transparent;
}
</style>
