<template>
  <div class="EtmTablePage-wrap">
    <div class="tool">
      <div class="toolLeft">
        <slot name="toolLeft" />
      </div>

      <div class="toolRight">
        <!--        <EtmWeeklyChangeTag v-show="weekTag" @weekClick="weekClick" />-->
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
          <!--设置第一列为row label-->
          <div v-if="col.prop==='label'">
            <span>
              {{ scope.row.label }}
            </span>
          </div>
          <!--设置第一列后台的内容为slot-->
          <div
            v-else
            class="cellContent"
          >
            <slot
              name="cell"
              :labelId="scope.row.label"
              :cellList="scope.row.data[col.prop]"
              :colProp="col.label.split('\n')[1]"
            />
            <EtmCellAddBtn
              v-if="add"
              @click.native.stop="editCell(scope.row.label, scope.row.data[col.prop], col.label)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

// import EtmWeeklyChangeTag from './EtmWeeklyChangeTag'
import EtmCellAddBtn from './EtmCellAddBtn'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    // EtmWeeklyChangeTag,
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
    date: {
      type: String,
      default: ''
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
  watch: {
    tableData: function () {
      this.init()
    },
    date: {
      handler (v) {
        if (v) this.changeColumnTitle()
      },
      immediate: true
    }
  },
  created () {
    // this.init()
    // this.changeColumnTitle()
  },
  methods: {

    // labelId左侧第一列id，cellList单元格数据列表，colProp表头prop值
    editCell (labelId, cellList, colProp) {
      const col = colProp.split('\n')
      this.$emit('handleAdd', labelId, cellList, col[1])
    },
    changeColumnTitle () {
      const oneDayTime = 24 * 60 * 60 * 1000
      const dateTime = new Date(this.date).getTime()
      this.columns = this.columns.map((v, i) => {
        if (i === 0) {
          v.label = this.tableData.title
        } else {
          const label = parseTime((dateTime + (i - 1) * oneDayTime), '{y}-{m}-{d}')
          v.label = v.label.split('\n')[0] + ('\n' + label)
        }
        return v
      })
    },

    weekClick (week) {
      this.columns[0].label = this.tableData.title

      if (!this.titleTime) {
        return
      }
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
<style lang="scss" scoped>
.EtmTablePage-wrap .el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: transparent;
}

.el-table {
  .el-table__header-wrapper {
    .has-gutter {
      .cell {
        white-space: pre-line;
      }
    }
  }
}
</style>
