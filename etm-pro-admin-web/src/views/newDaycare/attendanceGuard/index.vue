<template>
  <div class="attendance">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :show-toggle="activeName === 'tab2'"
          :setting="activeName === 'tab2'"
          @setting="toSetting"
        >
          <el-tab-pane label="快捷考勤" name="tab1" />
          <el-tab-pane
            label="幼儿请假"
            name="tab2"
          >
            <etm-tool-bar
              v-model="nope"
              @search="search"
              @reset="reset"
            >
              <el-form-item label="幼儿姓名:">
                <el-input v-model="filters.name" placeholder="请输入幼儿姓名" />
              </el-form-item>
              <el-form-item label="班级:">
                <etm-clazz-cascader :clear="clear" @change="getClazzId" />
              </el-form-item>
              <el-form-item label="登记时间:">
                <el-date-picker
                  v-model="filters.time"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="状态:">
                <el-select
                  v-model="filters.state"
                  filterable
                >
                  <el-option label="全部" value="" />
                  <el-option label="待确认" value="PENDING_REVIEW" />
                  <el-option label="已确认" value="PASSED" />
                  <el-option label="已撤销" value="RESCINDED" />
                </el-select>
              </el-form-item>
            </etm-tool-bar>
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <div v-if="activeName === 'tab1'">
          <sign-component />
        </div>
        <div v-else-if="activeName === 'tab2'">
          <etm-table-page
            :data="tableData"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <el-button
                slot="right"
                type="primary"
                @click.stop="handleAdd"
              ><i class="el-icon-plus" />&nbsp;&nbsp;添加请假
              </el-button>
            </etm-table-tool-bar>
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              slot="left"
              :label="column.label"
              :prop="column.prop"
            >
              <template slot-scope="scope">
                <a v-if="column._link" @click.stop="showDetail(column, scope)">{{ scope.row[column.prop] }}</a>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="状态" width="100">
              <template v-slot="scoped">
                <etm-status v-if="scoped.row.status==='PENDING_REVIEW'" type="danger">{{
                  scoped.row.enumState
                }}
                </etm-status>
                <etm-status v-else-if="scoped.row.status==='PASSED'" type="primary">{{
                  scoped.row.enumState
                }}
                </etm-status>
                <etm-status v-else type="inactive">{{ scoped.row.enumState }}</etm-status>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="操作"
            >
              <template slot-scope="scoped">
                <etm-text
                  v-if="!scoped.row.isFromParents"
                  type="primary"
                  @click.stop="handleEdit(scoped)"
                >编辑
                </etm-text>
                <etm-text
                  v-if="!scoped.row.isFromParents"
                  type="danger"
                  @click.stop="handleDelete(scoped)"
                >删除
                </etm-text>
                <etm-text
                  v-if="scoped.row.isFromParents && scoped.row.status === 'PENDING_REVIEW'"
                  type="primary"
                  @click.stop="handleConfirm(scoped)"
                >确定
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </div>
    </etm-layout-split>
    <etm-pop
      :visible="showPop"
      pop="complex"
      title="添加请假"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <add-component ref="add" :list="diseaseList" />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="small"
    >
      <etm-layout-split>
        <etm-title :show-line="false" border size="big">
          {{ drawerTitle }}
          <template slot="tool">
            <el-button v-show="drawerState === 'detail'" plain size="mini" @click.stop="handleDrawerEdit">编辑</el-button>
            <el-button v-show="drawerState === 'edit'" plain size="mini" @click.stop="showDrawer = false">取消</el-button>
            <el-button v-show="drawerState === 'edit'" type="primary" size="mini" @click.stop="handleDrawerSave">保存
            </el-button>
          </template>
        </etm-title>
        <component
          :is="drawerComponent"
          ref="drawer"
          :list="diseaseList"
        />
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>
<script>
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
import transferDate from '@/utils/date'
import {
  queryLeaveListByPage,
  queryIllnessList,
  removeLeaveItem,
  createLeaveItem,
  modifyLeaveItem,
  approveLeaveItem
} from '@/api/newDaycare/attendanceGuard'
import addComponent from './component/add'
import detailComponent from './component/detail'
import signComponent from './component/sign'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  components: {
    EtmClazzCascader,
    addComponent,
    signComponent
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'tab1',
      nope: [],
      filters: {
        name: '',
        grade: '',
        clazz: '',
        time: '',
        state: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        content: [{}]
      },
      columns: [
        {
          label: '幼儿姓名',
          prop: 'childName'
        },
        {
          label: '所在班级',
          prop: 'clazzName'
        },
        {
          label: '请假类型',
          prop: 'leave'
        },
        {
          label: '病症',
          prop: 'disease'
        },
        {
          label: '请假日期',
          prop: 'leaveDate'
        },
        {
          label: '请假事由',
          prop: 'leaveReason'
        },
        {
          label: '登记人',
          prop: 'registrant'
        },
        {
          label: '登记时间',
          prop: 'registTime'
        }
        // {
        //   label: '状态',
        //   prop: 'state'
        // }
      ],
      showPop: false,
      showDrawer: false,
      diseaseList: [],
      queryObj: null,
      activeRow: null,
      drawerState: 'edit',
      clear: false
    }
  },
  computed: {
    drawerComponent() {
      return { edit: addComponent, detail: detailComponent }[this.drawerState]
    },
    drawerTitle() {
      return { edit: '编辑请假', detail: '请假详情' }[this.drawerState]
    }
  },
  created() {
    this.refreshTableData()
    this.getDiseaseList()
  },
  methods: {
    toSetting() { // 跳转到设置页
      this.$router.push('/newdaycare_attendanceGuardcare/setting')
    },
    getDiseaseList() {
      this.diseaseList = []
      return queryIllnessList().then(res => {
        res.data.forEach(v => {
          this.diseaseList.push({
            name: v.illnessName,
            value: v.illnessId
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    getClazzId(value) {
      if (value.length) {
        this.filters.grade = value[0]
        this.filters.clazz = value[1]
      } else {
        this.filters.grade = ''
        this.filters.clazz = ''
      }
    },
    search() { // 确认筛选查询
      if (!this.filters.name && !this.filters.grade && !this.filters.clazz && !this.filters.time && !this.filters.state) {
        this.queryObj = null
      } else {
        this.queryObj = {}
      }
      if (this.filters.name) this.queryObj.childName = this.filters.name
      if (this.filters.grade && this.filters.clazz) {
        this.queryObj.gradeId = this.filters.grade
        this.queryObj.clazzId = this.filters.clazz
      }
      if (this.filters.state) this.queryObj.status = this.filters.state
      if (Array.isArray(this.filters.time)) {
        this.queryObj.startDate = transferDate(this.filters.time[0]).time
        this.queryObj.endDate = transferDate(this.filters.time[1]).time
      }
      this.refreshTableData()
    },
    reset() { // 重置筛选条件
      this.filters = {
        name: '',
        grade: '',
        clazz: '',
        time: '',
        state: ''
      }
      this.clear = !this.clear
      this.queryObj = null
      this.refreshTableData()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData() {
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.queryObj) options = Object.assign({}, options, this.queryObj)
      queryLeaveListByPage(options).then(res => {
        const { data } = res
        data.content.forEach(v => {
          v.leave = { 'SICK_LEAVE': '病假', 'LEAVE': '事假' }[v.leaveType]
          v.disease = v.illnessNameList.join(' ') || '-'
          v.leaveDate = `${transferDate(v.startTime).time}至${transferDate(v.endTime).time}`
          v.leaveReason = v.leaveReason || '-'
          v.registrant = v.registrant || '-'
          v.registTime = transferDate(v.createTime).time
          v.enumState = { 'PENDING_REVIEW': '待确认', 'PASSED': '已确认', 'RESCINDED': '已撤销' }[v.status]
        })
        this.tableData = data
      }).catch(err => {
        this.tableData = []
        console.error(err)
      })
    },
    handleEdit(s) {
      this.drawerState = 'edit'
      this.activeRow = s.row
      Promise.resolve(
        this.getDiseaseList()
      ).then(
        () => {
          this.showDrawer = true
          this.$nextTick(() => {
            this.$refs.drawer.getData(s.row.leaveRequestId) // 触发弹窗组件的getData事件，获取详情内容
          })
        }
      ).catch(err => {
        console.error(err)
      })
    },
    handleDelete(s) {
      this.activeRow = s.row
      this.$etmTip.init({
        type: 'warn',
        title: '删除确认',
        content: `确认删除${s.row.childName}的请假申请？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: this.handleDeleteConfirm,
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleDeleteConfirm() { // 调用接口删除信息
      removeLeaveItem(this.activeRow.leaveRequestId).then(res => {
        this.$etmTip.close()
        this.$message.success('删除成功')
        this.refreshTableData()
      }).catch(err => {
        this.$etmTip.close()
        console.error(err)
      })
    },
    handleAdd() {
      Promise.resolve(
        this.getDiseaseList()
      ).then(
        () => {
          this.handlePopOpen()
        }
      ).catch(err => {
        console.error(err)
      })
    },
    showDetail(c, s) {
      this.drawerState = 'detail'
      this.activeRow = s.row
      Promise.resolve(
        this.getDiseaseList()
      ).then(
        () => {
          this.showDrawer = true
          this.$nextTick(() => {
            this.$refs.drawer.getData(s.row.leaveRequestId) // 触发弹窗组件的getData事件，获取详情内容
          })
        }
      ).catch(err => {
        console.error(err)
      })
    },
    handlePopOpen() {
      this.showPop = true
    },
    handlePopClose() {
      this.$refs.add.$refs.form.$children[0].resetFields()
      this.showPop = false
    },
    handlePopConfirm() { // 新增
      this.$refs.add.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const data = this.$refs.add.formData
          const imageList = []
          data.previewSrcKey.forEach((v, i) => {
            imageList.push({
              url: v,
              name: i + Date.now()
            })
          })
          createLeaveItem({
            childId: data.childTargets[0].childId,
            startTime: transferDate(data.startTime).time + ' 00:00:00',
            endTime: transferDate(data.endTime).time + ' 23:59:59',
            leaveType: data.leaveType,
            illnessIdList: data.disease,
            leaveReason: data.leaveReason,
            imageList,
            isNotice: { 'yes': true, 'no': false }[data.notify]
          }).then(res => {
            this.$message.success('新增成功')
            this.handlePopClose()
            this.refreshTableData()
          }).catch(err => {
            this.handlePopClose()
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    handleDrawerEdit() {
      this.handleEdit({ row: this.activeRow })
    },
    handleDrawerSave() { // 修改
      this.$refs.drawer.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const data = this.$refs.drawer.formData
          const imageList = []
          data.previewSrcKey.forEach((v, i) => {
            imageList.push({
              url: v,
              name: i + Date.now()
            })
          })
          modifyLeaveItem(this.activeRow.leaveRequestId, {
            startTime: transferDate(data.startTime).time + ' 00:00:00',
            endTime: transferDate(data.endTime).time + ' 23:59:59',
            leaveType: data.leaveType,
            illnessIdList: data.disease,
            leaveReason: data.leaveReason,
            imageList,
            isNotice: { 'yes': true, 'no': false }[data.notify]
          }).then(res => {
            this.$message.success('修改成功')
            this.showDrawer = false
            this.refreshTableData()
          }).catch(err => {
            this.showDrawer = false
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    handleConfirm(s) {
      this.$etmTip.init({
        type: 'warn',
        title: '请假确认',
        content: `确认${s.row.childName}的请假申请？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.acceptLeave(s)
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    acceptLeave(s) { // 确认请假申请
      approveLeaveItem(s.row.leaveRequestId).then(res => {
        this.$etmTip.close()
        this.$message.success('确认成功')
        this.refreshTableData()
      }).catch(err => {
        console.error(err)
        this.$etmTip.close()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.attendance {
  margin-top: 16px;

  & > > > .el-drawer__body {
    .EtmLayoutSplit-wrap {
      height: 100vh;
      overflow-y: auto;
      @include bgc_white();
    }
  }
}
</style>
