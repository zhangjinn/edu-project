<template>
  <div class="leave">
    <etm-table-page
      ref="table"
      :columns="columns"
      :data="tableData"
      index-type="index"
      border
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { queryLeaveRecord } from '@/api/neuroo/memberManage'
import transferDate from '@/utils/date'
export default {
  data() {
    return {
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          type: 'index',
          label: '序号',
          width: '60'
        },
        {
          label: '开始时间',
          prop: 'startTime'
        },
        {
          label: '结束时间',
          prop: 'endTime'
        },
        {
          label: '发起时间',
          prop: 'initialTime'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '审批人',
          prop: 'approver'
        },
        {
          label: '是否补课',
          prop: 'isMakeup'
        },
        {
          label: '应补课时',
          prop: 'periods'
        },
        {
          label: '请假备注',
          prop: 'leaveRemark'
        }
      ]
    }
  },
  computed: {
    id() {
      return localStorage.getItem('memberManage_neuroo_currentId')
    }
  },
  created() {
    // this.refreshTableData()
  },
  methods: {
    refresh() {
      this.refreshTableData()
    },
    refreshTableData() {
      const statusList = {
        'PENDING_REVIEW': '待审核',
        'FAIL': '不通过',
        'PASSED': '已通过',
        'RESCINDED': '已撤销'
      }
      queryLeaveRecord({
        customerId: this.id,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        const { data } = res
        data.content.forEach(v => {
          v.startTime = transferDate(v.startTime).time
          v.endTime = transferDate(v.endTime).time
          v.initialTime = transferDate(v.createTime).time
          v.status = statusList[v.status]
          if (Array.isArray(v.reviewerList)) {
            v.approver = v.reviewerList.join(' -> ')
          } else {
            v.approver = '无'
          }
          v.isMakeup = v.isRemedialLesson ? '是' : '否'
          // eslint-disable-next-line eqeqeq
          if (v.remedialLessonTime == undefined) {
            v.periods = '-'
          } else {
            v.periods = v.remedialLessonTime + '小时'
          }
          v.leaveRemark = v.remarks || '无'
        })
        this.tableData = data
      }).catch(err => {
        console.log(err)
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    }
  }
}
</script>

<style scoped lang="scss">
.leave {
  /*height: calc(100vh - 206px);*/
  /*overflow-y: auto;*/
  /*& >>> .el-table {*/
  /*  height: calc(100vh - 276px)!important;*/
  /*}*/
}
</style>
