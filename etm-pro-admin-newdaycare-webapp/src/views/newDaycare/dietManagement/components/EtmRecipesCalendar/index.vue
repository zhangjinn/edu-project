<template>
  <div class="index-wrap">
    <!--食谱名称title-->
    <div class="recipeTitle">
      <slot name="recipeTitle" />
    </div>

    <!--工具栏-->
    <div class="tool">
      <!--左侧插槽-->
      <div class="toolLeft">
        <slot name="toolLeft" />
      </div>

      <div class="toolRight">
        <slot name="toolRight" />
      </div>
    </div>
    <div class="content">
      <!--展示table列表-->
      <div
        class="table"
        :class="{ 'streach' : isShrinkTable}"
      >
        <div class="top">
          <etm-tabs
            class="topTab"
            :show-toggle="false"
            style="height: 38px;
  line-height: 38px;"
          >
            <el-tab-pane
              v-for="(tab, index) in dayList"
              :key="index"
              :label="tab.label"
              :name="tab.name"
            />
          </etm-tabs>
        </div>
        <div class="bottom">
          <el-table
            ref="recipeCalendarTable"
            v-bind="$attrs"
            class="etm-recipe"
            :data="tableData.content"
            border
            v-on="$listeners"
          >
            <el-table-column
              v-for="(col,index) in columns"
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
                  v-else-if="col.prop === 'mon' "
                  class="cellContent"
                >
                  <slot
                    name="cell"
                    :labelId="scope.row.label.id"
                    :labelName="scope.row.label.name"
                    :cellList="scope.row.data[col.prop]"
                    :colProp="col.prop.toUpperCase()"
                  />
                  <!--v-if="add && scope.row.data[col.prop]"-->
                  <EtmCellAddBtn
                    @click.native.stop="editCell(scope.row.label.id, scope.row.data[col.prop], col.prop, scope.row.label.name)"
                  />
                </div>
                <!--<div v-else />-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!--营养素分布table-->
      <div
        class="nutrientTable"
        :class="{ 'shrink' : isShrinkTable}"
      >
        <div
          v-if="!isShrinkTable"
          class="streachStatus"
        >
          <div class="nutrienTableTitle">
            <etm-text @click="shrinkTable">
              {{ isShrinkTable ? '展开':'收起' }}
            </etm-text>
            <etm-text>营养素分布</etm-text>
            <etm-text>评价规则</etm-text>
          </div>

          <div class="nutrientTabs">
            <etm-tabs
              class="tabs"
              :show-toggle="false"
              style="height: 38px;
  line-height: 38px;"
            >
              <el-tab-pane
                v-for="(tab, index) in dayList"
                :key="index"
                :label="tab.label"
                :name="tab.name"
              />
            </etm-tabs>
          </div>

          <div class="nutrienTableContent">
            <el-table
              :data="nutrienTableData"
              border
            >
              <el-table-column
                v-for="(col,index) in nutrienTableColumns"
                :key="index"
                :label="col.label"
                v-bind="{...col}"
              />
            </el-table>
          </div>
        </div>

        <div
          v-else
          class="shrinkStatus"
        >
          <div class="nutrienTableTitle">
            <etm-text @click="shrinkTable">
              展开
            </etm-text>
          </div>

          <div class="nutrientTableName">
            <span
              style="display: flex;
  flex-direction: column;"
              class="text"
            >营养素分布</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/3/11 18:40
 */
import EtmCellAddBtn from '../EtmWeeklyCalendar/components/EtmCellAddBtn'

export default {
  name: 'Index',
  components: { EtmCellAddBtn },
  filters: {},
  mixins: [],
  props: {
    tableData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      nutrienTableData: [],
      openText: '',
      dayList: [
        {
          label: '周一',
          name: 'mon'
        },
        {
          label: '周二',
          name: 'tues'
        },
        {
          label: '周三',
          name: 'wed'
        },
        {
          label: '周四',
          name: 'thur'
        },
        {
          label: '周五',
          name: 'fri'
        },
        {
          label: '周六',
          name: 'sat'
        },
        {
          label: '周日',
          name: 'sun'
        }
      ],
      columns: [ // 表格的列表头传值
        {
          label: '餐次',
          prop: 'label'
        },
        {
          label: '菜肴',
          prop: 'mon'
        },
        {
          label: '食材',
          prop: 'tues'
        }
        // {
        //   label: '菜肴',
        //   prop: 'food'
        // },
        // {
        //   label: '食材',
        //   prop: 'tues'
        // }
      ],
      nutrienTableColumns: [
        {
          label: '营养素',
          prop: 'nutrient',
          align: 'center'
        },
        {
          label: '标准量',
          prop: 'standard',
          align: 'center'
        },
        {
          label: '摄入量',
          prop: 'intake',
          align: 'center'
        },
        {
          label: '百分比',
          prop: 'precent',
          align: 'center'
        },
        {
          label: '评价',
          prop: 'rate',
          align: 'center'
        }
      ],
      add: true,
      isShrinkTable: false
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
    init () {
      console.log(this.tableData, 'tableData1111')
    },
    editCell (labelId, cellList, colProp, labelName) {
      const col = colProp.toUpperCase()
      this.$emit('handleAdd', labelId, cellList, col, labelName)
    },
    shrinkTable () {
      this.isShrinkTable = !this.isShrinkTable
    }
  }
}
</script>
<style lang="scss" scoped>
  .cellContent {
    background: #f2f8fe;
  }

  .recipeTitle {
    text-align: center;
  }

  .tool,
  .toolLeft,
  .toolRight {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .tool {
    margin-bottom: 10px;
  }

  /*内容主体*/
  .content {
    display: flex;

    .table {
      transition: width 0.5s;
      width: 72%;
    }

    .streach {
      transition: width 0.5s;
      width: 90%;
    }
  }

  .nutrientTable {
    background: #fff;
    transition: width 0.5s;
    width: 28%;

    .shrinkStatus {
      height: 100%;
    }

    .nutrienTableTitle {
      border: 1px solid #eee;
      display: flex;
      height: 42px;
      justify-content: space-between;
      line-height: 42px;
      padding: 0 10px;
    }

    .nutrientTableName {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 60%;
      justify-content: center;
    }

    .tabs {
      ::v-deep .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
        height: 39px;
        /* width: 100%; */
        text-align: center;
        /* margin: 0 auto; */
        /*margin-left: 10px;*/
      }
    }
  }

  .shrink {
    transition: width 0.5s;
    width: 10%;
  }

  .top {
    border: 1px solid #eee;
    border-bottom: 0;
    height: 40px;

    .topTab {
      ::v-deep .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
        height: 41px;
        width: 100%;
      }

      ::v-deep .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
        text-align: center;
        width: 14%;
      }
    }
  }
</style>
