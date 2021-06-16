<template>
  <div class="feedback-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
          >
            <el-tab-pane
              label="员工反馈"
              name="employee"
            >
              <etm-tool-bar
                v-model="employeeFilter"
                @search="handleSearch"
                @reset="handleReset"
              >
                <div class="garden">
                  <span>园所:</span>
                  <el-cascader
                    v-model="queryGarden"
                    :options="options"
                    @change="handleGardenChange"
                  />
                </div>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-tool-bar slot="tool">
            <el-button
              slot="right"
              plain
              @click="handleReply"
            >
              批量回复
            </el-button>
          </etm-table-tool-bar>
          <etm-table-page
            :data="tableData"
            :columns="columns"
            :selection="true"
            @selection-change="handleSelectionChange"
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
                  @click="handleShowPicture(row.imageList)"
                >
                  查看图片
                </etm-text>
                <etm-text
                  v-if="row.status === 'PENDING' || row.status === 'PROCESSED'"
                  type="primary"
                  @click="handleSingleReply(row)"
                >
                  回复
                </etm-text>
                <etm-text
                  v-if="row.status === 'PROCESSED'"
                  type="primary"
                  @click="handleShowResult(row)"
                >
                  回复详情
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="showPop = false"
    >
      <etm-form
        ref="form"
        :model="formData"
        type="dialog"
        :rules="rules"
      >
        <el-form-item
          v-if="popTitle !== '批量回复'"
          label="问题/意见"
        >
          {{ opinion }}
        </el-form-item>
        <!-- 回复详情 -->
        <template v-if="popTitle === '回复详情'">
          <div
            v-for="(item, index) in resultList"
            :key="index"
            class="wrapper"
          >
            <el-form-item label="回复人">
              {{ item.employeeName }}
            </el-form-item>
            <el-form-item label="回复时间">
              {{ item.createTime | getFullTimeStr }}
            </el-form-item>
            <el-form-item label="回复内容">
              {{ item.handlingPinions }}
            </el-form-item>
          </div>
        </template>
        <el-form-item
          v-else
          label="回复内容"
          prop="content"
        >
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
    <div class="demo-image__preview">
      <el-image
        ref="image"
        :src="srcList[0]"
        :preview-src-list="srcList"
      />
    </div>
  </div>
</template>

<script>
import transferDate from '@/utils/date'
// import { queryOrganization } from '@/api/newDaycare/childDataHead'
import { queryFeedbackList, handleFeedback, queryFeedbackResultDetail, queryOrganization } from '@/api/newDaycare/feedb'

export default {
  filters: {
    getFullTimeStr (v) {
      return transferDate(v).fullTime
    }
  },
  data () {
    return {
      activeName: 'employee',
      queryGarden: '',
      options: [],
      employeeFilter: [
        {
          type: 'select',
          label: '状态',
          prop: 'status',
          options: [
            { label: '已处理', value: 'PROCESSED' },
            { label: '待处理', value: 'PENDING' },
            { label: '已撤销', value: 'REVOKED' }
          ],
          props: {
            placeholder: '全部'
          },
          value: ''
        },
        {
          label: '处理日期',
          type: 'date',
          value: '',
          prop: 'handleDate',
          // default: [parseTime(new Date(), '{y}-{m}-01'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '反馈日期',
          type: 'date',
          value: '',
          prop: 'feedbackDate',
          // default: [parseTime(new Date(), '{y}-{m}-01'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '反馈人',
          type: 'input',
          prop: 'feedback',
          value: '',
          props: {
            placeholder: '请输入宝宝姓名'
          }
        }
      ],
      rules: {
        content: [
          { required: true, message: '请输入内容' }
        ]
      },
      tableData: {
        content: []
      },
      columns: [
        { label: '所在园所', prop: 'organizationName', fixed: 'left' },
        { label: '反馈人', prop: 'name', fixed: 'left' },
        { label: '问题/意见', prop: 'opinion', width: '465' },
        {
          label: '反馈时间',
          prop: 'createTime_p',
          width: '180',
          sortable: true,
          sortMethod (a, b) {
            const valueA = +a.createTime_p.replace(/-/g, '')
            const valueB = +b.createTime_p.replace(/-/g, '')
            const compareA = Number.isNaN(valueA) ? 0 : valueA
            const compareB = Number.isNaN(valueB) ? 0 : valueB
            return compareA - compareB
          }
        },
        { label: '手机号码', prop: 'phone', width: '120' },
        { label: '处理人', prop: 'processorName' },
        {
          label: '处理时间',
          prop: 'processorTime_p',
          width: '180',
          fixed: 'right',
          sortable: true,
          sortMethod (a, b) {
            const valueA = +a.processorTime_p.replace(/-/g, '')
            const valueB = +b.processorTime_p.replace(/-/g, '')
            const compareA = Number.isNaN(valueA) ? 0 : valueA
            const compareB = Number.isNaN(valueB) ? 0 : valueB
            return compareA - compareB
          }
        },
        { label: '状态', prop: 'status_p', fixed: 'right', width: '75' }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      defaultAvatar: require('@/assets/images/moren.png'),
      popTitle: '',
      opinion: '',
      showPop: false,
      formData: {
        content: ''
      },
      feedbackIdList: [],
      srcList: [], // 展示的图片列表
      resultList: [] // 回复详情的详情列表
    }
  },
  created () {
    this.requireDefaultOrgData()
  },
  methods: {
    requireDefaultOrgData () {
      queryOrganization().then(res => {
        const { data } = res
        Array.isArray(data) && data.forEach(v => {
          v.label = v.areaName
          v.value = v.areaName
          v.sonOrganizationVOList.forEach(i => {
            i.label = i.organizationName
            i.value = i.sonOrganizationId
          })
          v.children = v.sonOrganizationVOList
        })
        this.options = data

        let opt = {}
        const enterpriseIdList = []
        if (this.options.length && this.options[0].sonOrganizationVOList && this.options[0].sonOrganizationVOList.length) {
          this.options[0].sonOrganizationVOList.forEach(v => {
            enterpriseIdList.push(v.sonOrganizationId)
          })
          opt = {
            enterpriseIdList
          }
        }
        this.refreshTableData(opt)
      })
    },
    handleGardenChange (val) {
      console.log(val)
    },
    handleSearch () {
      this.refreshTableData()
    },
    handleReset () {
      this.queryGarden = ''
      this.requireDefaultOrgData()
    },
    handleShowPicture (imageList) { // 展示图片列表
      const list = []
      imageList.forEach(v => {
        list.push(v.url)
      })
      this.srcList = list
      this.$refs.image.clickHandler()
    },
    handleSelectionChange (val) {
      const result = []
      val.forEach(v => {
        if (v.status === 'PENDING' || v.status === 'PROCESSED') {
          result.push(v.id)
        }
      })
      this.feedbackIdList = result
    },
    handleReply () { // 批量回复
      if (this.feedbackIdList.length) {
        this.popTitle = '批量回复'
        this.handlePopOpen()
      } else {
        this.$message.warning('请先选择')
      }
    },
    handleSingleReply (row) { // 单个回复
      this.popTitle = '回复'
      this.opinion = row.opinion
      this.feedbackIdList = [row.id]
      this.handlePopOpen()
    },
    handleShowResult (row) { // 回复详情
      this.popTitle = '回复详情'
      this.opinion = row.opinion
      queryFeedbackResultDetail({ feedbackId: row.id }).then(res => {
        this.resultList = res.data || []
        this.handlePopOpen()
      }).catch(err => {
        console.log(err)
        this.resultList = []
        this.handlePopOpen()
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData (opt = {}) {
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        feedbackType: 'HEADQUARTERS',
        enterpriseIdList: Array.isArray(this.queryGarden) ? this.queryGarden.slice(-1) : null,
        feedbackStatus: this.employeeFilter[0].value || null,
        confirmStartDate: Array.isArray(this.employeeFilter[1].value) ? this.employeeFilter[1].value[0] : null,
        confirmEndDate: Array.isArray(this.employeeFilter[1].value) ? this.employeeFilter[1].value[1] : null,
        startDate: Array.isArray(this.employeeFilter[2].value) ? this.employeeFilter[2].value[0] : null,
        endDate: Array.isArray(this.employeeFilter[2].value) ? this.employeeFilter[2].value[1] : null,
        employeeName: this.employeeFilter[3].value || null
      }
      queryFeedbackList(Object.assign(options, opt)).then(res => {
        const { data } = res
        Array.isArray(data.content) && data.content.forEach(v => {
          v.name = v.name || '-'
          v.processorName = v.processorName || '-'
          v.createTime_p = v.createTime ? transferDate(v.createTime).fullTime : '-'
          v.processorTime_p = v.processorTime_p ? transferDate(v.processorTime_p).fullTime : '-'
          v.status_p = { PENDING: '待处理', PROCESSED: '已处理', REVOKED: '已撤销' }[v.status]
        })
        this.tableData = data
      })
    },
    handlePopConfirm () {
      if (this.popTitle === '回复详情') {
        this.handlePopClose()
        return
      }
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          handleFeedback({
            feedbackIdList: this.feedbackIdList,
            handlingOpinions: this.formData.content
          }).then(res => {
            this.$message.success('处理成功')
            this.feedbackIdList = []
            this.handlePopClose()
            this.handleReset()
          }).catch(err => {
            console.log(err)
            this.feedbackIdList = []
            this.handlePopClose()
          })
        } else {
          return false
        }
      })
    },
    handlePopClose () {
      // this.formData.content = ''
      this.$refs.form.$children[0].resetFields()
      if (this.popTitle === '回复') {
        this.feedbackIdList = []
      }
      this.showPop = false
    },
    handlePopOpen () {
      if (this.popTitle === '回复' || this.popTitle === '批量回复') {
        this.formData.content = ''
      }
      this.showPop = true
    }
  }
}
</script>

<style scoped lang="scss">
.feedback-wrap {
  ::v-deep .avatar {
    align-items: center;
    display: flex;
    justify-content: center;

    img {
      border-radius: 50%;
      display: block;
      height: 43px;
      width: 43px;
    }
  }

  .demo-image__preview {
    height: 0;
    overflow: hidden;
  }

  .garden {
    display: inline-block;
    margin-right: 24px;

    span {
      margin-right: 6px;
    }
  }
}

.wrapper {
  border-top: 1px solid #e0e0e0;

  ::v-deep .el-form-item {
    margin-bottom: 8px;
  }
}
</style>
