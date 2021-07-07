<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName" setting setting-text="家长端设置" @setting="$router.push({name: 'cm_setting'})">
            <el-tab-pane label="家园通知" name="notification">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="handleReset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page :columns="columns" :data="tableData" @currentChange="currentChange">
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button plain @click="addNotification(null)">发布通知</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column prop="orderNo" label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <template v-if="scope.row.postStatus === '已发布'">
                  <etm-text type="primary" @click="preview(scope.row.id)">预览</etm-text>
                  <etm-text type="primary" @click="readCount(scope.row.id)">阅读统计</etm-text>
                  <etm-text type="danger" @click="deleteNotification(scope.row.id)">删除</etm-text>
                </template>
                <template v-else>
                  <etm-text type="primary" @click="preview(scope.row.id)">预览</etm-text>
                  <etm-text type="primary" @click="addNotification(scope.row.id)">编辑</etm-text>
                  <etm-text type="primary" @click="publicNotification(scope.row.id)">发布</etm-text>
                  <etm-text type="danger" @click="deleteNotification(scope.row.id)">删除</etm-text>
                </template>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>

        <!--阅读统计-->
        <etm-drawer
          :visible.sync="showSide"
          :before-close="beforeClose"
        >
          <etm-layout-split>
            <etm-title size="big" :show-line="true" border>阅读统计</etm-title>
            <etm-tabs v-model="activeName1" :show-toggle="false">
              <el-tab-pane :label="`未读(${unReadNumber}人)`" name="false">
                <etm-table v-if="unReadCountTableData.length !== 0" :columns="readCountColumns" :data="unReadCountTableData" />
              </el-tab-pane>
              <el-tab-pane :label="`已读(${readNumber}人)`" name="true">
                <etm-table v-if="readCountTableData.length !== 0" :columns="readCountColumns" :data="readCountTableData" />
              </el-tab-pane>
            </etm-tabs>
          </etm-layout-split>
        </etm-drawer>
        <!--通知预览-->
        <etm-drawer
          :visible.sync="showSideNotify"
          :before-close="beforeClose"
        >
          <etm-layout-split>
            <etm-title size="big" :show-line="true" border>预览</etm-title>
            <div class="mockup">
              <div class="box-wrap">
                <etm-title :show-line="false">{{ previewData.notificationTitle }}</etm-title>
                <div class="time-and-author">
                  <span class="time">{{ previewData.createDateTime }}</span>
                  <span class="author">来源：{{ previewData.sourceName || AuthorName }}</span>
                </div>
                <div class="preview-content" v-html="previewData.notificationContent" />
              </div>
            </div>
          </etm-layout-split>
        </etm-drawer>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/2 17:44
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryNotificationList, removeNotification, queryReadCount, queryPreview, updateNotification } from '@/api/newDaycare/cmNoticeManage'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      showSide: false,
      showSideNotify: false,
      activeName: 'notification',
      activeName1: 'false',
      formData: [
        {
          type: 'input',
          label: '通知标题',
          value: '',
          prop: 'notification',
          props: {
            placeholder: '请输入通知标题'
          }
        }
      ],
      columns: [
        {
          label: '通知标题',
          prop: 'notificationTitle'
        },
        {
          label: '发布范围',
          prop: 'releaseScope'
        },
        {
          label: '未读人数',
          prop: 'unreadNumber'
        },
        {
          label: '发布人',
          prop: 'createName'
        },
        {
          label: '发布状态',
          prop: 'postStatus'
        },
        {
          label: '发布时间',
          prop: 'createDateTime'
        }
      ],
      tableData: {
        content: []
      },
      readCountColumns: [
        {
          label: '学员姓名',
          prop: 'childName'
        },
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '班级',
          prop: 'clazzName'
        },
        {
          label: '阅读状态',
          prop: 'start'
        }
      ],
      unReadCountTableData: [],
      readCountTableData: [],
      unReadNumber: '',
      readNumber: '',
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      },
      publicStatus: {
        PUBLISHED: '已发布',
        UNPUBLISHED: '未发布'
      },
      previewData: {}
    }
  },
  computed: {
    AuthorName() {
      return JSON.parse(localStorage.getItem('account')).name
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'daycare_cmNoticeManage') {
        this.init()
      }
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(search = {}) {
      const result = Object.assign({}, search, this.pageInfo)
      queryNotificationList(result).then(res => {
        if (res.message === '成功') {
          this.tableData = res.data
          this.tableData.content.forEach(item => {
            item.createDateTime = parseTime(item.createDateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            item.postStatus = this.publicStatus[item.postStatus]
          })
        }
      })
    },
    handleSearch() {
      const search = {
        notificationTitle: this.getObjectByProp('notification', this.formData).value
      }
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.init(search)
    },
    handleReset() {
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
    },
    currentChange(pageNum, pageSize) {
      const search = {
        notificationTitle: this.getObjectByProp('notification', this.formData).value
      }
      this.pageInfo = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      this.init(search)
    },
    preview(noticeId) {
      queryPreview({ noticeId }).then(res => {
        if (res.message === '成功') {
          res.data.createDateTime = parseTime(res.data.createDateTime, '')
          this.previewData = res.data
        }
      })
      this.showSideNotify = true
    },
    readCount(noticeId) {
      // 网络请求，成功才打开抽屉
      queryReadCount({
        noticeId
      }).then(res => {
        if (res.message === '成功') {
          res.data.forEach(item => {
            if (item.state === false) {
              item.data.forEach(tmp => {
                tmp.start = tmp.start === true ? '已读' : '未读'
                tmp.courseName = tmp.courseName === 'null' ? '--' : tmp.courseName
              })
              this.unReadCountTableData = item.data
              this.unReadNumber = item.count
            } else if (item.state === true) {
              item.data.forEach(tmp => {
                tmp.start = tmp.start === true ? '已读' : '未读'
                tmp.courseName = tmp.courseName === 'null' ? '--' : tmp.courseName
              })
              this.readCountTableData = item.data
              this.readNumber = item.count
            }
            this.showSide = true
          })
        }
      })
    },
    deleteNotification(noticeId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除通知？',
        content: '删除后，员工、家长将无法查看该条通知',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          removeNotification({ noticeId }).then(res => {
            if (res.message === '成功') {
              this.$message({
                message: '删除通知成功',
                type: 'success'
              })
              this.init()
            } else {
              this.$message({
                message: '删除通知失败',
                type: 'error'
              })
            }
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // editNotification(noticeId) {
    //   this.$router.push({
    //     path: '/newdaycare_addNotification',
    //     query: { noticeId }
    //   })
    // },
    publicNotification(noticeId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要发布通知吗？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          updateNotification({ noticeId }).then(res => {
            if (res.message === '成功') {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
              this.init()
            } else {
              this.$message({
                message: '发布失败',
                type: 'error'
              })
            }
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    beforeClose(done) {
      sessionStorage.removeItem('noticeId')
      this.unReadCountTableData = []
      this.readCountTableData = []
      this.previewData = {}
      this.activeName1 = 'false'
      done()
    },
    addNotification(noticeId) {
      this.$router.push({
        path: '/newdaycare_addNotification',
        query: {
          noticeId,
          t: Date.now()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  /deep/.layout-default {
    display: flex;
    flex-direction: column;
  }
  .mockup {
    flex: 1;
    padding: 55px 20px 25px 15px;
    height: 100%;
    overflow: hidden;
    background: url("../../../assets/images/daycare/preview-mockup.png") no-repeat;
    background-size: 100% calc(100vh - 96px);
    .box-wrap {
      padding: 0 14px;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      word-wrap:break-word;
      &::-webkit-scrollbar {display:none}
      .EtmTitle-wrap {
        padding-bottom: 0!important;
        font-weight: 700;
      }
      .time-and-author {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        //.author {
        //  margin-right: 10px;
        //}
      }
      .preview-content {
        /deep/img {
          width: 100%!important;
        }
      }
    }
  }
}
</style>
