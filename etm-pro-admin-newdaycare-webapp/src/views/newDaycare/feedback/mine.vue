<template>
  <etm-table-page
    :data="tableData"
    :columns="columns"
    @currentChange="currentChange"
  >
    <el-table-column
      slot="left"
      label="头像"
      prop="avatar"
      align="center"
      width="80"
      fixed="left"
    >
      <template slot-scope="{row}">
        <div class="avatar">
          <img
            v-if="row.avatar !== '--' && row.avatar"
            :src="row.avatar"
            alt="avatar"
          >
          <img
            v-else
            :src="defaultAvatar"
            alt="defaultAvatar"
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column
      slot="right"
      label="操作"
      fixed="right"
      width="100"
    >
      <template slot-scope="{row}">
        <etm-text
          v-if="row.imageList.length"
          type="primary"
          @click="$emit('view', row.imageList)"
        >
          查看图片
        </etm-text>
        <etm-text
          v-if="row.status === 'PENDING'"
          type="primary"
          @click="$emit('edit', row.id)"
        >
          编辑
        </etm-text>
        <etm-text
          v-if="row.status === 'PENDING'"
          type="primary"
          @click="$emit('cancel', row.id)"
        >
          撤销
        </etm-text>
        <etm-text
          v-if="row.status === 'PROCESSED'"
          type="primary"
          @click="$emit('result', row)"
        >
          回复详情
        </etm-text>
      </template>
    </el-table-column>
  </etm-table-page>
</template>

<script>
import {
  queryFeedbackList
} from '@/api/newDaycare/feedb'
import transferDate from '@/utils/date'
export default {
  props: {
    filter: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableData: {
        content: []
      },
      columns: [
        { label: '反馈人', prop: 'name', fixed: 'left' },
        { label: '问题/意见', prop: 'opinion', width: '465' },
        { label: '反馈时间', prop: 'createTime_p', width: '180' },
        { label: '处理人', prop: 'processorName' },
        { label: '处理时间', prop: 'processorTime_p', width: '180', fixed: 'right' },
        { label: '状态', prop: 'status_p', fixed: 'right', width: '75' }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      defaultAvatar: require('@/assets/images/moren.png')
    }
  },
  created () {
    this.refreshTableData()
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData () {
      const options = {
        feedbackType: 'MINE',
        feedbackStatus: this.filter[0].value || null,
        startDate: Array.isArray(this.filter[1].value) ? this.filter[1].value[0] : null,
        endDate: Array.isArray(this.filter[1].value) ? this.filter[1].value[1] : null,
        confirmStartDate: Array.isArray(this.filter[2].value) ? this.filter[2].value[0] : null,
        confirmEndDate: Array.isArray(this.filter[2].value) ? this.filter[2].value[1] : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryFeedbackList(options).then(res => {
        const { data } = res
        Array.isArray(data.content) && data.content.forEach(v => {
          v.name = v.name || '-'
          v.processorName = v.processorName || '-'
          v.createTime_p = v.createTime ? transferDate(v.createTime).fullTime : '-'
          v.processorTime_p = v.processorTime ? transferDate(v.processorTime).fullTime : '-'
          v.status_p = { PENDING: '待处理', PROCESSED: '已处理', REVOKED: '已撤销' }[v.status]
        })
        this.tableData = data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.avatar {
  img {
    border-radius: 50%;
    display: block;
    height: 43px;
    width: 43px;
  }
}
</style>
