<template>
  <div class="notAttendance-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      border
      selection
      @currentChange="currentChange"
      @selection-change="select"
    >
      <etm-table-tool-bar slot="tool">
        <el-alert
          v-if="settingEnable"
          :closable="false"
          :title="title"
          show-icon
          type="warning"
        />
        <div slot="right">
          <el-button v-has="{authId: 'daycare.attendanceCare.createBatch'}" plain @click="addArticle">批量考勤
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" fixed="left" label="学员姓名" width="220">
        <template slot-scope="scoped">
          <etm-text type="primary" @click.stop="handleRowClick(scoped.row)">{{ scoped.row.childName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" width="120">
        <template v-slot="row">
          <etm-text v-has="{authId: 'daycare.attendanceCare.createBatch'}" type="primary" @click="handleEdit(row.row)">
            考勤
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <!--  操作考勤  -->
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="考勤"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="closeShowPop"
      @confirm="attend"
      @cancel="closeShowPop"
    >
      <etm-form ref="form" :model="form" type="dialog">
        <el-form-item
          label="考勤状态"
          prop="statusId"
          :rules="formValidate.nullValueRule(true,'请选择考勤类型')"
        >
          <el-select v-model="form.statusId" placeholder="请选择考勤类型">
            <el-option
              v-for="item in danceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.statusId==='ASK_FOR_LEAVE'"
          label="请假原因"
          prop="details"
          :rules="formValidate.nullValueRule(true,'请输入请假原因')"
        >
          <el-input
            v-model="form.details"
            type="textarea"
            :rows="3"
            show-word-limit
            resize="none"
            placeholder="请输入请假原因"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
    <!--    批量考勤-->
    <etm-pop
      :visible="addPop"
      :pop="allType"
      title="批量考勤"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="addPop = true"
      @close="addPop = false"
      @confirm="allDance"
      @cancel="addPop = false"
    >
      <all-dance v-if="addPop" ref="childPopForm" :options="options" />
    </etm-pop>
    <!--学员详情-->
    <etm-drawer
      :visible.sync="childDetail.visible"
      type="big"
    >
      <etm-layout-split
        v-if="childDetail.visible"
        :left-styles="{minWidth: '560px', maxWidth: '560px'}"
        :styles="{height: '100vh'}"
        class="child-info-box"
      >
        <div slot="left" class="left">
          <child-logs :child-id="childDetail.childId" />
        </div>
        <div slot="right" class="right">
          <child-info :child-id="childDetail.childId" :category="currentTab" @update="update" />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * notAttendance create by Administrator
 * createTime 2020/09/08 15:46
 */
import formValidate from '@/utils/rules'
import allDance from '@/views/newDaycare/attendanceCare/notAttendance/allDance'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryAttendanceCare,
  createAttendanceCare,
  createDelAttendanceCare,
  queryAttendanceCareSetting
} from '@/api/newDaycare/attendanceCare'
import { parseTime } from '@/utils'
import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'

export default {
  name: 'NotAttendance',
  components: { ChildInfo, ChildLogs, allDance },
  filters: {},
  mixins: [baseMixin],
  props: {
    notSearch: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      formValidate,
      showPop: false,
      addPop: false,
      popType: 'simple',
      allType: 'simple',
      stuID: '',
      currentTab: 'DEAL',
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: ''
      },
      delId: [],
      options: [],
      modify: true,
      danceOptions: [
        { label: '到园', value: 'IN_SCHOOL' },
        { label: '缺勤', value: 'ABSENT_FROM_WORK' },
        { label: '请假', value: 'ASK_FOR_LEAVE' }
      ],
      form: {
        statusId: null,
        details: null
      },
      columns: [
        { label: '所在班级', prop: 'clazzName' },
        { label: '班主任', prop: 'headTeacherName' },
        { label: '考勤状态', prop: 'status' }
      ],
      tableData: {
        content: [
          {}
        ]
      },
      title: '',
      settingEnable: false
    }
  },
  computed: {},
  watch: {
    notSearch: {
      handler() {
        this.pageInfo.pageNum = 1
        this.init()
        // console.log(this.notSearch)
      },
      deep: true
    }
  },
  created() {
    this.getSetting()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryAttendanceCare({
        type: 'NOT_ATTENDANCE',
        childName: (this.notSearch.childName) || null,
        clazzName: (this.notSearch.clazzName) || null,
        date: this.notSearch.date || parseTime(new Date(), '{y}-{m}-{d}'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.date = ''
          item.date = parseTime(item.courseDate, '{y}-{m}-{d}' + '(星期' + '{a}' + ') ')
          if (item.status === 'NOT_ATTENDANCE') {
            item.status = '未考勤'
          } else if (item.status === 'ABSENT_FROM_WORK') {
            item.status = '缺勤'
          } else {
            item.status = '请假'
          }
        })
      })
    },
    currentChange(pageNum, pageSize) {
      // console.log(pageNum,pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    handleEdit(row) {
      this.showPop = true
      this.stuID = row.childId
      // console.log(row.modify)
      this.danceOptions = [
        { label: '到园', value: 'IN_SCHOOL' },
        { label: '缺勤', value: 'ABSENT_FROM_WORK' },
        { label: '请假', value: 'ASK_FOR_LEAVE' }
      ]
    },
    attend() {
      // this.showPop = false
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(this.form))
          // console.log(formData)
          // this.showPop = false
          this.$refs['form'].$children[0].resetFields()
          // console.log(this.stuID)
          createAttendanceCare({
            childIdList: [this.stuID],
            status: formData.statusId,
            reason: (formData.details) || null,
            attendanceDate: this.notSearch.date || parseTime(new Date(), '{y}-{m}-{d}')
          }).then(res => {
            this.showPop = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.init()
          })
        }
      })
    },
    closeShowPop() {
      this.showPop = false
      this.$refs['form'].$children[0].resetFields()
    },
    select(e) {
      // console.log(e)
      this.options = []
      this.delId = []
      for (let i = 0; i < e.length; i++) {
        this.options.push({
          value: e[i].childId,
          label: e[i].childName
        })
        this.delId.push(e[i].childId)
      }
    },
    addArticle() {
      this.addPop = true
    },
    allDance() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          createAttendanceCare({
            childIdList: formData.stuNames,
            status: formData.statusId,
            reason: (formData.details) || null,
            attendanceDate: this.notSearch.date || parseTime(new Date(), '{y}-{m}-{d}')
          }).then(res => {
            this.addPop = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.init()
          })
        }
      })
    },
    cancelAppointment() {
      if (this.delId.length) {
        this.$etmTip.init({
          type: 'warn',
          title: '确认要取消预约？',
          content: '确认要取消预约？',
          confirmBtn: '确认',
          cancelBtn: '取消',
          confirm: () => {
            if (this.delId.length !== 0) {
              createDelAttendanceCare({ idList: this.delId }).then(res => {
                this.init()
                this.$message.success('操作成功')
                this.$etmTip.close()
              })
            } else {
              this.$message.error('请选择学员')
              this.$etmTip.close()
            }
          },
          cancel: () => {
            this.$etmTip.close()
          }
        })
        this.$etmTip.open()
      } else {
        this.$message.error('请选择学员')
      }
    },
    handleRowClick(row) {
      this.childDetail.visible = true
      this.childDetail.childId = row.childId
    },
    update() {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init()
      const childId = this.childDetail.childId
      this.childDetail.childId = ''
      setTimeout(() => {
        this.childDetail.childId = childId
      }, 16)
    },
    getSetting() {
      queryAttendanceCareSetting().then(res => {
        // console.log(res.data)
        this.settingEnable = res.data.enable && res.data.value
        this.title = `请假连续大于${res.data.value}天，合同时长将自动顺延`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.notAttendance-wrap {
  .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  ::v-deep .el-alert{
    padding: 0px 8px;
  }
  ::v-deep .EtmDrawer-wrap {
    .EtmLayoutSplit-wrap {
      .layout-left {
        margin-right: 8px;
      }
    }
  }
}
</style>
