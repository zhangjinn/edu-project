<template>
    <div class="etm-form-demo-wrap">
        <high-code :code="code" :description="description">
          无
        </high-code>
        <params-table :table-data="tableData"/>
    </div>
</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-weekly-calendar-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {

      tableData: [
        {
          param: 'tableData',
          description: '显示的数据',
          type: 'Object',
          option: '--',
          default: '--'
        },
        {
          param: 'weekTag',
          description: '是否显示上下周切换按钮',
          type: 'Boolean',
          option: '--',
          default: 'true'
        },
        {
          param: 'add',
          description: '是否显示所有单元格内的加号（单元格数据不为null情况下）',
          type: 'Boolean',
          option: '--',
          default: 'true'
        },
        {
          param: 'titleTime',
          description: '是否显示表头内对应的日期',
          type: 'Boolean',
          option: '--',
          default: 'true'
        },
        {
          param: 'handleAdd',
          description: '点击单元格内默认加号触发的事件,参数（labelId, cellList, colProp）',
          type: 'Function',
          option: '--',
          default: '--'
        },
        {
          param: 'handleUpDate',
          description: '切换上下周触发事件，参数（当前周开始结束日期）',
          type: 'Function',
          option: '--',
          default: '--'
        }
      ],
      code: `
    <template>
      <etm-weekly-calendar :table-data="tableData" :week-tag="false" @handleAdd="handleAdd" @handleUpDate="upDate">
        <template slot="toolLeft">
          头部左侧内容
        </template>
        <template slot="toolRight">
          头部右侧内容
        </template>
        <template v-slot:cell="data">
          <div v-if="data.cellList">
            <div v-for="(item,index) in data.cellList" :key="index">
              //  自定义单元格内容
              <cell :data="item"/>
            </div>
          </div>
        </template>
      </etm-weekly-calendar>
    </template>
    <script>
      import etmWeeklyCalendar from '@/views/guardcare/edu/scheduleManage/components/EtmWeeklyCalendar/index'
      export default {
        name: 'etm-weekly-calendar-demo',
        components: {
          etmWeeklyCalendar,
        },
        data() {
          return {
            tableData: {
              title: '表头第一列内容',
              content: [{
                  label: {
                      id: '当前行第一列id',
                      name: "当前行第一列名称"
                  },
                  data: {
                      mon: [],
                      tues: [],
                      wed: [],
                      thur: [],
                      fri: [],
                      sat: [],
                      sun: []
                  }
              }]
            }
          }
        }
      }
      `,
      description: '一般用于周日历模块（ 需要后端配合组织对应数据结构 ）'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
      change(val) {
        console.log(val)
      }
  }
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>
