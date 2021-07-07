<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" @toggle="toggle">
          <el-tab-pane label="考勤统计" name="first">
            <etm-tool-bar v-show="showTool" v-model="formData1" @search="search('total', formData1)" />
          </el-tab-pane>
          <el-tab-pane label="会员考勤记录" name="second">
            <etm-tool-bar v-show="showTool" v-model="formData2" @search="search('record', formData2)" />
          </el-tab-pane>
          <el-tab-pane label="考勤详情记录" name="third">
            <etm-tool-bar v-show="showTool" v-model="formData3" @search="search('record-detail', formData3)" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <div class="content">
          <total v-if="activeName === 'first'" ref="total" />
          <record v-if="activeName === 'second'" ref="record" />
          <record-detail v-if="activeName === 'third'" ref="record-detail" />
        </div>
      </div>
    </etm-layout-split>

  </div>
</template>

<script>
import Total from '@/views/sacc/attendance/components/total'
import Record from '@/views/sacc/attendance/components/record'
import RecordDetail from '@/views/sacc/attendance/components/recordDetail'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

/**
   *  2020/4/14 10:54
   *  haijinsha
   */
export default {
  name: 'Index',
  components: { RecordDetail, Record, Total },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      showTool: true,
      activeName: 'first',
      currentDate: new Date(),
      dateData: [],
      visible: false,
      editData: {
        in: '',
        out: '',
        other: '',
        time: ''
      },
      formData1: [
        {
          label: '统计日期',
          type: 'date',
          prop: 'attendanceDate',
          value: '',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            clearable: false,
            placeholder: '请选择日期',
            valueFormat: 'yyyy-MM-dd',
            defaultValue: new Date()
          }
        }
      ],
      formData2: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '日期范围',
          type: 'date',
          prop: 'date',
          value: [],
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            clearable: false,
            placeholder: '请输入班级名称',
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      formData3: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '日期范围',
          type: 'date',
          prop: 'date',
          value: [],
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    isWeekEnd(date) {
      const weekDay = new Date(date).getDay()
      // return weekDay === 0 || weekDay === 6 || false
      return [0, 6].includes(weekDay)
    },
    isPreMonth(date, data) {
      return data.type === 'prev-month'
    },
    isCurrentMonth(date, data) {
      return data.type === 'current-month'
    },
    isNextMonth(date, data) {
      return data.type === 'next-month'
    },
    isEdit(date, data) {
      // 如果是当前月, 并且数据大于当日的话,就返回true, 禁用操作
      return data.type === 'current-month' && new Date(data.day).getTime() > new Date().getTime()
    },
    changeData(data) {
      console.log(data)
    },
    handleEnter(data) {
      // console.log(data)
      console.log(1111)
      data.visible = true
    },
    handleLeave(data) {
      // console.log(data)
      data.visible = false
    },
    handleClick(data) {
      console.log(data)
      this.editData = Object.assign({ in: '', out: '', other: '' }, data)
      console.log(this.editData)
      this.visible = true
    },
    confirm() {
      this.$refs.edit.validator().then(res => {
        this.$message.success('验证成功')
        this.$refs.edit.resetFields()
        this.cancel()
      })
    },
    cancel() {
      this.visible = false
    },
    toggle(val) {
      this.showTool = val
    },
    search(ref, formData) {
      this.$refs[ref].formData = formData
      this.$refs[ref].init()
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    font-size: 14px;

    & /deep/ .el-calendar-day {
      /*height: 120px;*/
      height: auto;
      padding: 0;
    }

    .weekEnd {
      /*background-color: red;*/
      /*user-select: none;*/
      /*pointer-events: none;*/
    }

    .no-edit {
      background-color: #fdfcff;
    }

    & /deep/ .el-calendar-table__row {
      td:not(.current) {
        pointer-events: none;
      }

      td.next {
        display: none;
      }

      td.prev {
        .el-calendar-day {
          display: none;
        }
      }
    }

    // 上一个月
    .pre-month {
    }

    // 当前月
    .current-month {
    }

    // 下一个月
    .next-month {

    }

    .box {
      position: relative;
      height: 120px;
      display: flex;
      flex-direction: column;

      .calendar-day {
        font-size: 16px;
        margin-bottom: 8px;
        padding: 8px 0 0 8px;
      }

      .item-box {
        padding: 8px;
        flex: 1;

        & > div {
          line-height: 1.5;
        }

        .btn-edit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background-color: $main-color;
          color: #fff;
          display: none;
        }
      }
    }

    .active {
      display: block !important;
    }

    .desc {
      padding: 20px;
      color: $secondary-color;

      .chi {
        color: #FF3F2A;
      }

      .yan {
        color: #FBA047;
      }
    }
  }
</style>
