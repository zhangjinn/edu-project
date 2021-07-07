<template>
  <div class="recordDetail-wrap">
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

    <etm-side
      :title="currentRow.customerName+ '的考勤记录详情'"
      :visible.sync="visible"
      class="side"
      @close="visible = false"
    >
      <etm-title>送园签入状态</etm-title>
      <status-item :data="recordDetail" :prop="detailPropEnter" />
      <etm-title>离园签出状态</etm-title>
      <status-item :data="recordDetail" :prop="detailPropLeave" />
    </etm-side>
  </div>
</template>

<script>
import { queryAttendanceCustomDetailById, queryAttendanceRecordDetailListPage } from '@/api/attendance'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import EtmSide from '@/layout/main/EtmSide/src/EtmSide'
import StatusItem from '@/views/sacc/attendance/components/statusItem'
import { getEnumValueByKey } from '@/enums'

/**
   *  2020/4/20 11:57
   *  haijinsha
   */
export default {
  name: 'RecordDetail',
  components: { StatusItem, EtmSide },
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
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      ],
      tableData: {},
      columns: [
        { label: '会员姓名', prop: 'customerName' },
        { label: '所在班级', prop: 'clazzName' },
        { label: '考勤日期', prop: 'attendanceDate' },
        { label: '送园签入状态', prop: 'enterStatusZH' },
        { label: '送园签入时间', prop: 'enterDate' },
        { label: '离园签出状态', prop: 'leaveStatusZH' },
        { label: '离园签出时间', prop: 'leaveDate' }
      ],
      visible: false,
      currentRow: {},
      recordDetail: {},
      detailPropEnter: [
        {
          title: '签入时间',
          prop: 'enterDate'
        },
        {
          title: '签入状态',
          prop: 'enterStatusZH'
        },
        {
          title: '操作人',
          prop: 'enterEmployeeName'
        },
        {
          title: '签入备注',
          prop: 'enterStatusRemarks'
        }
      ],
      detailPropLeave: [
        {
          title: '签出时间',
          prop: 'leaveDate'
        },
        {
          title: '签出状态',
          prop: 'leaveStatusZH'
        },
        {
          title: '操作人',
          prop: 'leaveEmployeeName'
        },
        {
          title: '接送人',
          prop: 'leaveSurrogate'
        },
        {
          title: '签出备注',
          prop: 'leaveStatusRemarks'
        }
      ]
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
      queryAttendanceRecordDetailListPage({
        customerName: this.getValueByProp('customerName'),
        clazzName: this.getValueByProp('clazzName'),
        startTime: this.getValueByProp('date')[0],
        endTime: this.getValueByProp('date')[1],
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.attendanceDate = parseTime(item.attendanceDate, '{y}-{m}-{d}')
          item.enterDate = parseTime(item.enterDate || Date.now(), '{hh}:{mm}:{ss}')
          item.leaveDate = parseTime(item.leaveDate || Date.now(), '{hh}:{mm}:{ss}')
          if (item.enterStatusDescription) {
            item.enterStatusZH = getEnumValueByKey(item.enterStatus) + item.enterStatusDescription
          } else {
            item.enterStatusZH = getEnumValueByKey(item.enterStatus)
          }
          if (item.leaveStatusDescription) {
            item.leaveStatusZH = getEnumValueByKey(item.leaveStatus) + item.leaveStatusDescription
          } else {
            item.leaveStatusZH = getEnumValueByKey(item.leaveStatus) || '-'
          }
        })
      })
    },
    search() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    reset() {
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    detail(row) {
      this.currentRow = row
      this.visible = true
      queryAttendanceCustomDetailById({ id: row.id }).then(res => {
        this.recordDetail = res.data
        if (getEnumValueByKey(this.recordDetail.enterStatus) === '请假') {
          const desc = this.recordDetail.enterStatusDescription.split(',').join('-')
          this.recordDetail.enterStatusZH = getEnumValueByKey(this.recordDetail.enterStatus) + desc
        } else {
          this.recordDetail.enterStatusZH = getEnumValueByKey(this.recordDetail.enterStatus)
        }

        if (getEnumValueByKey(this.recordDetail.leaveStatus) === '延长签出') {
          this.recordDetail.leaveStatusZH = getEnumValueByKey(this.recordDetail.leaveStatus) + this.recordDetail.leaveStatusDescription
        } else {
          this.recordDetail.leaveStatusZH = getEnumValueByKey(this.recordDetail.leaveStatus)
        }

        this.recordDetail.enterDate = parseTime(this.recordDetail.enterDate || Date.now(), '{y}-{m}-{d} {hh}:{mm}:{ss}')
        this.recordDetail.leaveDate = parseTime(this.recordDetail.leaveDate || Date.now(), '{y}-{m}-{d} {hh}:{mm}:{ss}')
        for (const recordDetailKey in this.recordDetail) {
          this.recordDetail[recordDetailKey] = this.recordDetail[recordDetailKey] || '-'
        }
        this.$forceUpdate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .recordDetail-wrap {

  }
</style>
