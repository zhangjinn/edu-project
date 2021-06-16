<template>
  <etm-table-page
    :data="tableData"
    :columns="columns"
    :selection="true"
    @currentChange="currentChange"
    @selection-change="handleSelectionChange"
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
            alt=""
          >
          <img
            v-else
            :src="defaultAvatar"
            alt=""
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
          v-if="row.status === 'PENDING' || row.status === 'PROCESSED'"
          type="primary"
          @click="$emit('handle', row)"
        >
          回复
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
        // { label: '性别', prop: 'gender_p' },
        { label: '问题/意见', prop: 'opinion', width: '465' },
        { label: '反馈时间', prop: 'createTime_p', width: '180' },
        { label: '手机号码', prop: 'phone', width: '120' },
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
        feedbackType: 'PARENT',
        feedbackStatus: this.filter[0].value || null,
        startDate: Array.isArray(this.filter[3].value) ? this.filter[3].value[0] : null,
        endDate: Array.isArray(this.filter[3].value) ? this.filter[3].value[1] : null,
        confirmStartDate: Array.isArray(this.filter[2].value) ? this.filter[2].value[0] : null,
        confirmEndDate: Array.isArray(this.filter[2].value) ? this.filter[2].value[1] : null,
        childName: this.filter[1].value || null,
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
          v.gender_p = { MALE: '男性', FEMALE: '女性' }[v.gender]
        })
        this.tableData = data
      })
    },
    handleSelectionChange (val) {
      const result = []
      val.forEach(v => {
        if (v.status === 'PENDING' || v.status === 'PROCESSED') {
          result.push(v.id)
        }
      })
      this.$emit('selection', result)
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
