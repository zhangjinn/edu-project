<template>
  <div class="EtmTablePage-wrap">
    <div class="tool">
      <div class="toolLeft">
        <slot name="toolLeft" />
      </div>

      <div class="toolRight">
        <EtmWeeklyChangeTag v-show="weekTag" @weekClick="weekClick" />
        <slot name="toolRight" />
      </div>
    </div>
    <el-table
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
            <div>
              <p>时段</p>
              {{ scope.row.label.name }}
            </div>
          </div>
          <div v-else class="cellContent">
            <slot
              name="cell"
              :cellList="scope.row[col.prop]"
              :labelId="scope.row.label.id"
              :labelRound="scope.row.label.name"
              :colProp="col.prop.toUpperCase()"
              :dayStep="col.step"
            />
          </div>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>

import EtmWeeklyChangeTag
  from '@/views/guardcare/edu/scheduleManage/components/EtmWeeklyCalendar/components/EtmWeeklyChangeTag'

export default {
  name: 'Index',
  components: {
    EtmWeeklyChangeTag
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
    titleTime: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      columns: [ // 表格的列表头传值
        {
          label: '上课时段',
          prop: 'label'

        },
        {
          label: '周一',
          prop: 'mon',
          step: 0
        },
        {
          label: '周二',
          prop: 'tues',
          step: 1
        },
        {
          label: '周三',
          prop: 'wed',
          step: 2
        },
        {
          label: '周四',
          prop: 'thur',
          step: 3
        },
        {
          label: '周五',
          prop: 'fri',
          step: 4
        },
        {
          label: '周六',
          prop: 'sat',
          step: 5
        },
        {
          label: '周日',
          prop: 'sun',
          step: 6
        }
      ],
      weekStartDay: '',
      weekEndDay: ''
    }
  },
  watch: {
    tableData: function() {
      this.init()
    }
  },
  created() {
    // this.init()
  },
  mounted() {

  },

  methods: {

    // labelId左侧第一列id，cellList单元格数据列表，colProp表头prop值
    editCell(labelId, cellList, colProp) {
      const col = colProp.toUpperCase()
      this.$emit('handleAdd', labelId, cellList, col)
    },
    changeColumnTitle() {
      this.columns[0].label = this.tableData.title
    },

    weekClick(week) {
      if (!this.titleTime) {
        return
      }
      this.columns[0].label = this.tableData.title
      const dataArr = []
      week.map((val, index) => {
        dataArr.push(val.titleDate)
        if (index === 0) {
          this.weekStartDay = val.formatDate
        }
        if (index === 6) {
          this.weekEndDay = val.formatDate
        }
      })
      this.columns.map((val, index) => {
        if (val.prop !== 'label') {
          val.label = dataArr[index - 1]
        }
      })
      const obj = {
        weekStartDay: this.weekStartDay,
        weekEndDay: this.weekEndDay
      }

      this.$emit('handleUpDate', obj)
    }

  }

}
</script>

<style lang="scss" scoped>
.EtmTablePage-wrap {

  /deep/ .el-table__header-wrapper {
    th {
      border-right: none;
      border-left: none;
    }
  }

  /deep/ .el-table--border {
    border-left: none;
  }

  /deep/ .el-table__row {
    td:first-child {
      border-left: 1px solid #ebeef5
    }

    td {
      padding: 0;
    }

    .cell {
      padding-left: 0px;
      padding-right: 0px;
      display: flex;
    }
  }

  .el-table--border::after, .el-table--group::after {
    width: 0;
  }

  .tool {
    margin-bottom: 16px;
  }

  .tool, .toolLeft, .toolRight {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cellContent {
    width: 100%;

  }

}
</style>
