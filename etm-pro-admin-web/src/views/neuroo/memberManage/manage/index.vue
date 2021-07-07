<template>
  <div class="memberManage_neuroo_manage">
    <etm-layout-split>
      <div slot="header">
        <fil ref="filter" @query="query" />
      </div>
      <div slot="body">
        <etm-table-page
          ref="table"
          :columns="columns"
          :data="tableData"
          index-type="index"
          border
          @currentChange="currentChange"
          @selection-change="selectionChange"
        >
          <etm-table-tool-bar v-show="activeName === 'IN'" slot="tool">
            <!-- <el-checkbox v-model="selectAll" :class="['selectAll', {active: selectAll}]">选中所有页（共X条）</el-checkbox> -->
            <div slot="right">
              <!-- <el-button type="primary" @click.stop="toAdd"><i class="el-icon-plus" />&nbsp;&nbsp;新增会员</el-button> -->
              <el-button plain :disabled="disabled" style="margin-left: 8px;" @click.stop="switchState">毕业</el-button>
            </div>
          </etm-table-tool-bar>
          <etm-table-tool-bar v-show="activeName === 'OUT'" slot="tool">
            <div slot="right">
              <el-button plain :disabled="disabled" style="margin-left: 8px;" @click.stop="switchState">入园</el-button>
              <el-button plain :disabled="disabled" @click.stop="exportToExcel">导出表格</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" type="selection" />
          <el-table-column slot="left" label="会员姓名" fixed="left" width="150">
            <template slot-scope="scoped">
              <a @click.stop="showDetail(scoped)">{{ scoped.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column slot="right" label="操作" width="230">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="handleDetail(scoped)">详情</etm-text>
              <etm-text v-show="activeName === 'IN'" type="primary" @click.stop="handleGraduate(scoped)">毕业</etm-text>
              <etm-text type="primary" @click.stop="handleModify(scoped)">修改</etm-text>
              <etm-text v-show="activeName === 'IN'" type="primary" @click.stop="handleTransfer(scoped)">转园</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <Etm-pop
      :visible="pop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div>
        <etm-form v-if="popTitle === '毕业'" type="dialog">
          <el-form-item label="毕业原因">
            <el-select v-model="reason" placeholder="请选择原因">
              <el-option v-show="canGraduate" label="毕业离园" value="GRADUATED" />
              <el-option label="退费离园" value="REFUND" />
              <el-option label="其他原因" value="OTHER" />
            </el-select>
          </el-form-item>
        </etm-form>
        <etm-table
          v-if="popTitle !== '转园'"
          :columns="popColumnSettings"
          :data="popTableData"
        />
        <div v-if="popTitle === '转园'">
          <etm-form ref="form" type="dialog">
            <el-form-item label="当前园区：">
              {{ selectScoped.schoolName || '-' }}
            </el-form-item>
            <el-form-item label="选择园区：" prop="school">
              <el-select v-model="selectSchool" placeholder="请选择园区">
                <el-option v-for="(school, index) in schoolList" :key="index" :label="school.name" :value="school.id" />
              </el-select>
            </el-form-item>
          </etm-form>
          <p class="warn">注意：转园后所有的当前的订单的剩余课时都会清零转移，该学员转园后，当前园区的未消的排课都会被清空</p>
        </div>
      </div>
    </Etm-pop>
    <Etm-side
      :visible="side"
      title="宝宝详情"
      @close="handleSideClose"
      @open="handleSideOpen"
    >
      <info :content="babyInfo" :name="babyName" />
    </Etm-side>
  </div>
</template>

<script>
import EtmPop from '@/layout/main/EtmPop'
import EtmSide from '@/layout/main/EtmSide'
import info from './info'
import fil from './filter'
import { getRegisteredMemberList, getGraduatedMemberList, getMemberDetail, graduate, enter, transferSchool, getSchoolList } from '@/api/neuroo/memberManage'
import transferDate from '@/utils/date'
import getXlsx from '@/utils/xlsx'
export default {
  components: {
    fil,
    EtmPop,
    EtmSide,
    info
  },
  data() {
    return {
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      popTableData: [],
      popColumnSettings: [],
      selection: [],
      popTitle: '弹窗标题',
      disabled: true,
      pop: false,
      reason: '',
      selectAll: false,
      selectSchool: '',
      side: false,
      babyInfo: null,
      babyName: '',
      enable: true,
      selectScoped: {},
      rawSchoolList: [],
      schoolList: [],
      canGraduate: true
    }
  },
  computed: {
    activeName() {
      return this.$store.state.memberManageNeuroo.customerState
    },
    columns() {
      if (this.activeName === 'IN') {
        return [
          {
            label: '家长姓名',
            prop: 'parentName'
          },
          {
            label: '电话号码',
            prop: 'telephone'
          },
          {
            label: '生日',
            prop: 'birthday'
          },
          {
            label: '月龄',
            prop: 'monthAge'
          },
          {
            label: '消课状态',
            prop: 'eliminationStatus'
          },
          {
            label: '入园时间',
            prop: 'enterSchoolTime'
          },
          {
            label: '总课时',
            prop: 'totalHour'
          },
          {
            label: '剩余总课时',
            prop: 'leftTotalHour'
          },
          {
            label: '上课园区',
            prop: 'schoolName'
          }
        ]
      } else if (this.activeName === 'OUT') {
        return [
          {
            label: '性别',
            prop: 'gender'
          },
          {
            label: '家长姓名',
            prop: 'parentName'
          },
          {
            label: '联系电话',
            prop: 'telephone'
          },
          {
            label: '入园时间',
            prop: 'enterSchoolTime'
          },
          {
            label: '毕业时间',
            prop: 'graduateTime'
          },
          {
            label: '离园原因',
            prop: 'graduateReason'
          },
          {
            label: '上课园区',
            prop: 'schoolName'
          }
        ]
      } else {
        return []
      }
    },
    filter() {
      return this.$store.state.memberManageNeuroo.filter
    }
  },
  watch: {
    activeName: {
      handler(v) {
        this.$store.commit('memberManageNeuroo/SET_FILTER', null)
        this.refreshTableData()
      },
      immediate: true
    },
    filter: {
      handler(v) {
        this.refreshTableData()
      },
      deep: true
    },
    selection(v) {
      v.length ? this.disabled = false : this.disabled = true
    }
  },
  created() {
    getSchoolList().then(res => {
      this.rawSchoolList = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    query() {
      this.pageInfo.pageNum = 1
    },
    toDetail() {
      this.$emit('switch', { target: 'detail', index: 0 })
    },
    toModify() {
      this.$emit('switch', { target: 'modify', index: 1 })
    },
    toAdd() {
      this.$emit('switch', { target: 'add', index: 2 })
    },
    refreshTableData() {
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.filter) {
        Object.assign(options, this.filter)
        for (const k in options) {
          if (!options[k]) {
            delete options[k]
          }
        }
      }
      if (this.activeName === 'IN') {
        // 在册会员
        getRegisteredMemberList(options).then(res => {
          const { data } = res
          data.content.forEach(v => {
            v.birthday = v.birthday ? transferDate(v.birthday).time : '-'
            v.enterSchoolTime = v.enterSchoolTime ? transferDate(v.enterSchoolTime).time : '-'
          })
          this.tableData = data
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.activeName === 'OUT') {
        // 毕业会员
        getGraduatedMemberList(options).then(res => {
          const { data } = res
          data.content.forEach(v => {
            v.graduateTime = v.graduateTime ? transferDate(v.graduateTime).time : '-'
            v.enterSchoolTime = v.enterSchoolTime ? transferDate(v.enterSchoolTime).time : '-'
          })
          this.tableData = data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    selectionChange(val) {
      this.selection = val
    },
    exportToExcel() {
      if (!this.enable) {
        return
      }
      this.enable = false
      let fileName
      if (this.activeName === 'IN') {
        fileName = '在册会员名单'
      }
      if (this.activeName === 'OUT') {
        fileName = '毕业会员名单'
      }
      getXlsx({
        data: this.selection,
        columns: [
          {
            label: '会员姓名',
            prop: 'name'
          },
          ...this.columns
        ],
        fileName
      })
      setTimeout(() => {
        this.enable = true
      }, 1000)
    },
    switchState() {
      if (this.activeName === 'IN') {
        this.popTitle = '毕业'
        this.reason = ''
        this.popColumnSettings = [
          {
            label: '会员姓名',
            prop: 'name'
          },
          {
            label: '性别',
            prop: 'gender'
          },
          {
            label: '家长姓名',
            prop: 'parentName'
          },
          {
            label: '入园时间',
            prop: 'enterSchoolTime'
          }
        ]
      }
      if (this.activeName === 'OUT') {
        this.popTitle = '入园'
        this.popColumnSettings = [
          {
            label: '会员姓名',
            prop: 'name'
          },
          {
            label: '性别',
            prop: 'gender'
          },
          {
            label: '家长姓名',
            prop: 'parentName'
          },
          {
            label: '联系电话',
            prop: 'telephone'
          },
          {
            label: '入园时间',
            prop: 'enterSchoolTime'
          },
          {
            label: '离园时间',
            prop: 'graduateTime'
          },
          {
            label: '离园原因',
            prop: 'graduateReason'
          }
        ]
      }
      this.popTableData = this.selection
      this.handlePopOpen()
    },
    handleDetail(scoped) {
      localStorage.setItem('memberManage_neuroo_currentId', scoped.row.id)
      localStorage.setItem('memberManage_neuroo_memberState', this.activeName)
      this.toDetail()
    },
    handleGraduate(scoped) {
      this.selection = [scoped.row]
      this.switchState()
    },
    handleModify(scoped) {
      localStorage.setItem('memberManage_neuroo_currentId', scoped.row.id)
      this.toModify()
    },
    handleTransfer(scoped) {
      this.popTitle = '转园'
      this.selectScoped = scoped.row
      this.schoolList = []
      this.rawSchoolList.forEach(v => {
        if (v.id !== scoped.row.schoolId) {
          this.schoolList.push(v)
        }
      })
      this.handlePopOpen()
    },
    showDetail(scoped) {
      getMemberDetail(scoped.row.id).then(res => {
        const { data } = res
        data.customerInfo.birthday = transferDate(data.customerInfo.birthday).time
        data.customerInfo.enterSchoolTime = transferDate(data.customerInfo.enterSchoolTime).time
        this.babyInfo = data
        this.babyName = scoped.row.name
        this.handleSideOpen()
      }).catch(err => {
        console.log(err)
      })
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
      this.selectSchool = ''
    },
    handlePopConfirm() {
      if (this.popTitle === '毕业') {
        if (this.reason) {
          const customerIds = []
          this.selection.forEach(v => {
            customerIds.push(v.id)
          })
          graduate({ customerIds, leaveSchoolType: this.reason })
            .then(res => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.refreshTableData()
              this.handlePopClose()
            })
            .catch(err => {
              console.log(err)
              this.handlePopClose()
            })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择毕业原因'
          })
        }
      }
      if (this.popTitle === '入园') {
        const customerIds = []
        this.selection.forEach(v => {
          customerIds.push(v.id)
        })
        enter(customerIds)
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.refreshTableData()
            this.handlePopClose()
          })
          .catch(err => {
            console.log(err)
            this.handlePopClose()
          })
      }
      if (this.popTitle === '转园') {
        transferSchool({
          targetSchoolId: this.selectSchool,
          customerId: this.selectScoped.id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.refreshTableData()
          this.handlePopClose()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    handleSideOpen() {
      this.side = true
    },
    handleSideClose() {
      this.side = false
    }
  }
}
</script>

<style scoped lang="scss">
.memberManage_neuroo_manage {
  @include bgc_bg_color();
  .selectAll {
    border: 1px solid;
    border-radius: 2px;
    padding: 0 10px;
    @include bc_border_color_base();
    @include c_text_color();
    &:hover, &.active {
      @include c_main_color();
      @include bc_main_color();
    }
  }
}
.warn {
  font-size: 12px;
  @include c_error_color();
  padding-left: 100px;
  width: 90%;
}
</style>
