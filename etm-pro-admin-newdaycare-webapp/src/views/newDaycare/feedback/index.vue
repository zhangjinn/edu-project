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
              />
            </el-tab-pane>
            <el-tab-pane
              label="家长反馈"
              name="parent"
            >
              <etm-tool-bar
                v-model="parentFilter"
                @search="handleSearch"
                @reset="handleReset"
              />
            </el-tab-pane>
            <el-tab-pane
              label="我的反馈"
              name="mine"
            >
              <etm-tool-bar
                v-model="mineFilter"
                @search="handleSearch"
                @reset="handleReset"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-tool-bar slot="tool">
            <template v-if="activeName === 'parent' || activeName === 'employee'">
              <el-button
                slot="right"
                plain
                @click="handleReply"
              >
                批量回复
              </el-button>
            </template>
            <template v-if="activeName === 'mine'">
              <el-button
                slot="right"
                plain
                @click="handleAdd"
              >
                添加意见/反馈
              </el-button>
            </template>
          </etm-table-tool-bar>
          <component
            :is="activeName"
            ref="table"
            :filter="filter"
            @view="handleShowPicture"
            @handle="handleSingleReply"
            @selection="handleSelection"
            @result="handleShowResult"
            @edit="handleEdit"
            @cancel="handleCancel"
          />
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
      <add
        v-if="popTitle === '添加意见反馈'"
        ref="add"
      />
      <etm-form
        v-else
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
    <etm-drawer
      :visible.sync="showDrawer"
      type="small"
    >
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
          size="small"
        >
          编辑意见反馈
          <template slot="tool">
            <el-button
              plain
              size="mini"
              @click.stop="handleDrawerCancel"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click.stop="handleDrawerSave"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <add
          :id="id"
          ref="edit"
        />
      </etm-layout-split>
    </etm-drawer>
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
import employee from './employee'
import parent from './parent'
import mine from './mine'
import add from './addFeedback'
import transferDate from '@/utils/date'
import { handleFeedback, cancelFeedback, createFeedback, updateFeedback, queryFeedbackResultDetail } from '@/api/newDaycare/feedb'

export default {
  filters: {
    getFullTimeStr (v) {
      return transferDate(v).fullTime
    }
  },
  components: {
    employee,
    parent,
    mine,
    add
  },
  data () {
    return {
      activeName: 'employee',
      employeeFilter: [
        // {
        //   type: 'select',
        //   label: '园所',
        //   prop: 'garden',
        //   options: [],
        //   props: {
        //     placeholder: '全部'
        //   },
        //   value: ''
        // },
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
      parentFilter: [
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
          label: '反馈人',
          type: 'input',
          prop: 'feedback',
          value: '',
          props: {
            placeholder: '请输入宝宝姓名'
          }
        },
        {
          label: '确认日期',
          type: 'date',
          value: '',
          prop: 'confirmDate',
          // default: [parseTime(new Date(), '{y}-{m}-01'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        // {
        //   label: '提交人电话号码',
        //   type: 'input',
        //   prop: 'phone',
        //   value: '',
        //   props: {
        //     placeholder: '请输入电话号码'
        //   }
        // },
        {
          label: '交代日期',
          type: 'date',
          value: '',
          prop: 'explainDate',
          // default: [parseTime(new Date(), '{y}-{m}-01'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        }
      ],
      mineFilter: [
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
        }
      ],
      rules: {
        content: [
          { required: true, message: '请输入内容' }
        ]
      },
      id: undefined,
      srcList: [], // 展示的图片列表
      feedbackIdList: [],
      popTitle: '',
      showPop: false,
      showDrawer: false,
      formData: {
        content: ''
      },
      opinion: '',
      resultList: []
    }
  },
  computed: {
    filter () {
      return {
        employee: this.employeeFilter,
        parent: this.parentFilter,
        mine: this.mineFilter
      }[this.activeName]
    }
  },
  methods: {
    handleSearch () {
      this.$refs.table.refreshTableData && this.$refs.table.refreshTableData()
    },
    handleReset () {
      this.handleSearch()
    },
    handleShowPicture (imageList) { // 展示图片列表
      const list = []
      imageList.forEach(v => {
        list.push(v.url)
      })
      this.srcList = list
      this.$refs.image.clickHandler()
    },
    handleSelection (list) {
      this.feedbackIdList = list
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
    handleAdd () { // 添加意见/反馈
      this.popTitle = '添加意见反馈'
      this.id = undefined
      this.handlePopOpen()
      this.$nextTick(() => {
        this.$refs.add.init && this.$refs.add.init()
      })
    },
    handleShowResult (row) { // 展示处理结果
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
    handleEdit (id) { // 编辑
      this.id = id
      this.showDrawer = true
      this.$nextTick(() => {
        this.$refs.edit.init && this.$refs.edit.init()
      })
    },
    handleCancel (id) { // 撤销
      this.$etmTip.init({
        type: 'warn',
        title: '确认要执行撤销',
        content: '该问题反馈将彻底删除',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          cancelFeedback({
            feedbackId: id
          }).then(res => {
            this.$message.success('撤销成功')
            this.$etmTip.close()
            this.handleSearch()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handlePopConfirm () {
      if (this.popTitle === '回复详情') {
        this.handlePopClose()
      } else if (this.popTitle === '添加意见反馈') {
        this.$refs.add.$refs.form.$children[0].validate(valid => {
          if (valid) {
            const { target, content, previewSrcKey } = this.$refs.add.formData
            const imageList = []
            previewSrcKey.forEach((v, i) => {
              imageList.push({
                url: v,
                name: i + Date.now()
              })
            })
            createFeedback({
              opinion: content,
              areaObject: target,
              imageList
            }).then(res => {
              this.$message.success('添加成功')
              this.handlePopClose()
              this.handleSearch()
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs.form.$children[0].validate(valid => {
          if (valid) {
            handleFeedback({
              feedbackIdList: this.feedbackIdList,
              handlingOpinions: this.formData.content
            }).then(res => {
              this.$message.success('处理成功')
              this.feedbackIdList = []
              this.handlePopClose()
              this.handleSearch()
            }).catch(err => {
              console.log(err)
              this.feedbackIdList = []
              this.handlePopClose()
            })
          } else {
            return false
          }
        })
      }
    },
    handlePopClose () {
      this.$refs.form && this.$refs.form.$children[0].resetFields()
      this.$refs.add && this.$refs.add.$refs.form.$children[0].resetFields()
      if (this.popTitle === '回复') {
        this.feedbackIdList = []
      }
      this.showPop = false
    },
    handleDrawerCancel () {
      this.showDrawer = false
    },
    handleDrawerSave () {
      this.$refs.edit.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const { target, content, previewSrcKey } = this.$refs.edit.formData
          const imageList = []
          previewSrcKey.forEach((v, i) => {
            imageList.push({
              url: v,
              name: i + Date.now()
            })
          })
          updateFeedback({
            feedbackId: this.id,
            opinion: content,
            areaObject: target,
            imageList
          }).then(res => {
            this.$message.success('修改成功')
            this.showDrawer = false
            this.handleSearch()
            this.id = undefined
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopOpen () {
      if (this.popTitle === '回复处理' || this.popTitle === '批量回复处理') {
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
  }

  .demo-image__preview {
    height: 0;
    overflow: hidden;
  }
}

.wrapper {
  border-top: 1px solid #e0e0e0;

  ::v-deep .el-form-item {
    margin-bottom: 8px;
  }
}
</style>
