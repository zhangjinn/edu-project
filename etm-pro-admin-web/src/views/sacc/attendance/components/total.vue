<template>
  <div class="total-wrap">
    <etm-table-page
      ref="etmTable"
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { queryAttendanceTotalListPage } from '@/api/attendance'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

/**
   *  2020/4/20 10:34
   *  haijinsha
   */
export default {
  name: 'Total',
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
          label: '统计日期',
          type: 'date',
          prop: 'attendanceDate',
          value: '',
          props: {
            clearable: false,
            placeholder: '请选择日期',
            valueFormat: 'yyyy-MM-dd',
            defaultValue: new Date()
          }
        }
      ],
      columns: [
        {
          label: '班级名称',
          prop: 'clazzName'
        },
        {
          label: '应到人数',
          prop: 'shouldArriveNumber'
        },
        {
          label: '实到人数',
          prop: 'arrivedNumber'
        },
        {
          label: '请假人数',
          prop: 'requestForLeaveNumber'
        },
        {
          label: '缺勤人数',
          prop: 'absenceNumber'
        },
        {
          label: '出勤率',
          prop: 'rateOfAttendance'
        }
      ],
      tableData: {}
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    this.getObjectByProp('attendanceDate').value = parseTime(Date.now(), '{y}-{m}-{d}')
    this.init()
  },
  methods: {
    init() {
      queryAttendanceTotalListPage({
        attendanceDate: this.getValueByProp('attendanceDate'),
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(res => {
        this.tableData = res.data
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    search() {
      this.init()
    },
    reset() {
    },
    setting() {
      this.$parent.$emit('switch', 'setting')
    }
  }
}
</script>

<style lang="scss" scoped>
  .total-wrap {

  }
</style>
