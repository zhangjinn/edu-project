<template>
  <div class="record-wrap">
    <!--<etm-tool-bar v-show="showTool" v-model="formData">-->
    <!--  <el-button @click="search">搜索</el-button>-->
    <!--  <el-button class="etm-button-plain" @click="reset">重置</el-button>-->
    <!--</etm-tool-bar>-->
    <!--<div class="block" />-->
    <etm-table-page
      ref="etmTable"
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <el-table-column slot="right" label="操作">
        <template v-slot="{row}">
          <etm-text type="primary" @click="detail(row)">详情</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { queryAttendanceRecordListPage } from '@/api/attendance'
import { parseTime } from '@/utils'

/**
   *  2020/4/20 10:41
   *  haijinsha
   */
export default {
  name: 'Record',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    showTool: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: [
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
          props: {
            clearable: false,
            placeholder: '请输入班级名称',
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      columns: [
        { label: '会员姓名', prop: 'customerName' },
        { label: '班级名称', prop: 'clazzName' },
        { label: '应到天数', prop: 'shouldArriveNumber' },
        { label: '实到天数', prop: 'arrivedNumber' },
        { label: '请假次数', prop: 'requestForLeaveNumber' },
        { label: '缺勤次数', prop: 'absenceNumber' },
        { label: '迟到次数', prop: 'arriveLateNumber' },
        { label: '早退次数', prop: 'leaveEarlyNumber' }
      ],
      tableData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getObjectByProp('date').value = [parseTime(Date.now(), '{y}-{m}-{d}'), parseTime(Date.now(), '{y}-{m}-{d}')]
    this.init()
  },
  methods: {
    init() {
      queryAttendanceRecordListPage({
        customerName: this.getValueByProp('customerName'),
        clazzName: this.getValueByProp('clazzName'),
        startTime: this.getValueByProp('date')[0],
        endTime: this.getValueByProp('date')[1],
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formData[0].value = ''
      this.formData[1].value = ''
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    detail(row) {
      console.log(row)
      this.$store.dispatch('attendance/set_attendance_customer_info', row)
      this.$parent.$parent.$emit('switch', 'detail')
    }
  }
}
</script>

<style lang="scss" scoped>
  .record-wrap {

  }
</style>
