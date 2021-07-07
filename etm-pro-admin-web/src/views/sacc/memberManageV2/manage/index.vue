<template>
  <div class="memberManage_manage">
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
            <div slot="right">
              <!-- <el-button type="primary" @click.stop="toAdd"><i class="el-icon-plus" />&nbsp;&nbsp;{{ $t('memberManage.addMemberBtnText') }}</el-button> -->
              <el-button plain @click.stop="handleBatchArrange">批量分班</el-button>
              <el-button plain @click.stop="exportToExcel">导出表格</el-button>
              <el-button plain style="margin-left: 8px;" @click.stop="switchState">离园</el-button>
            </div>
          </etm-table-tool-bar>
          <etm-table-tool-bar v-show="activeName === 'OUT'" slot="tool">
            <div slot="right">
              <el-button plain @click.stop="exportToExcel">导出表格</el-button>
              <el-button plain style="margin-left: 8px;" @click.stop="switchState">入园</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" type="selection" />
          <el-table-column v-if="activeName === 'IN'" slot="left" :label="$t('memberManage.tableTitleName')">
            <template slot-scope="scoped">
              <!-- <a @click.stop="handleDetail(scoped)">{{ scoped.row.name }}</a> -->
              <span>{{ scoped.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column slot="right" :label="$t('memberManage.tableTitleHandle')">
            <template slot-scope="scoped">
              <!-- <etm-text v-show="activeName === 'OUT'" type="primary" @click.stop="handleDetail(scoped)">{{ $t('memberManage.detailBtnText') }}</etm-text> -->
              <etm-text type="primary" @click.stop="handleModify(scoped)">{{ $t('memberManage.modifyBtnText') }}</etm-text>
              <etm-text v-show="activeName === 'IN'" type="primary" @click.stop="handleArrangeClass(scoped)">分班</etm-text>
              <etm-text v-show="activeName === 'IN'" type="primary" @click.stop="handleSign(scoped)">续签</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <Etm-pop
      :visible="pop"
      pop="complex"
      :title="activeName === 'IN' ? $t('memberManage.popTitleLeave') : $t('memberManage.popTitleArrive')"
      :confirm-btn="$t('memberManage.popConfirmBtnText')"
      :cancel-btn="$t('memberManage.popCancelBtnText')"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div>
        <el-form v-if="activeName === 'IN'">
          <el-form-item :label="$t('memberManage.leaveReason')">
            <el-select v-model="reason" :placeholder="$t('memberManage.leaveReasonPlaceHolderText')">
              <el-option :label="$t('memberManage.leaveReasonGraduate')" value="GRADUATION" />
              <el-option :label="$t('memberManage.leaveReasonRefund')" value="REFUND" />
              <el-option :label="$t('memberManage.leaveReasonElse')" value="OTHER" />
            </el-select>
          </el-form-item>
        </el-form>
        <etm-table
          :data="popTableData"
          :columns="popColumnSettings"
        />
      </div>
    </Etm-pop>
    <Etm-pop
      :visible="classPop"
      :pop="classPopType"
      :title="classPopTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handleClassPopOpen"
      @close="handleClassPopClose"
      @confirm="handleClassPopConfirm"
      @cancel="handleClassPopCancel"
    >
      <div>
        <el-form>
          <el-form-item label="选择班级:">
            <el-select v-model="targetClass" placeholder="请选择班级">
              <el-option v-for="(clazz, index) in classListData" :key="index" :label="clazz.clazzName" :value="clazz.clazzId" />
            </el-select>
          </el-form-item>
          <el-form-item label="已选会员:">
            {{ classPopTitle === '分班' ? selectMemberData.name : `${classPopData.length}人` }}
          </el-form-item>
        </el-form>

        <etm-table
          v-show="classPopTitle === '批量分班'"
          :data="classPopData"
        >
          <el-table-column label="班级" prop="className" />
          <el-table-column label="会员姓名" prop="name" />
          <el-table-column label="性别" prop="sex" />
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="handleDeleteMember(scoped)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table>
      </div>
    </Etm-pop>
    <etm-side
      :visible="side"
      title="会员详情"
      @close="handleSideClose"
      @open="handleSideOpen"
    >
      <info :content="memberData" />
    </etm-side>
  </div>
</template>

<script>
import EtmPop from '@/layout/main/EtmPop'
import etmSide from '@/layout/main/EtmSide'
import { getGardenXq } from '@/api/sacc'
import { queryMemberInfo, putInGarden, getOutGarden, getClassList, arrangeClass } from '@/api/memberManageV2'
import info from './info'
import transferDate from '@/utils/date'
import getexcel from '@/utils/xlsx'
import fil from './filter'
export default {
  components: {
    EtmPop,
    fil,
    etmSide,
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
      pop: false,
      classPop: false,
      classPopType: '',
      classPopTitle: '',
      classPopData: [],
      reason: '',
      canExport: true,
      loading: false,
      disabled: true,
      side: false,
      memberData: {},
      targetClass: '',
      selectMemberData: {},
      classListData: []
    }
  },
  computed: {
    activeName() {
      return this.$store.state.memberManageV2.gardenState
    },
    columns() {
      if (this.activeName === 'IN') {
        return [
          {
            label: this.$t('memberManage.tableTitleSex'),
            prop: 'sex'
          },
          {
            label: this.$t('memberManage.tableTitleParentName'),
            prop: 'parentName'
          },
          {
            label: this.$t('memberManage.tableTitlePhone'),
            prop: 'phone'
          },
          {
            label: '班级',
            prop: 'className'
          },
          {
            label: this.$t('memberManage.tableTitleDate'),
            prop: 'date'
          }
        ]
      } else if (this.activeName === 'OUT') {
        return [
          {
            label: '会员姓名',
            prop: 'name'
          },
          {
            label: this.$t('memberManage.tableTitleSex'),
            prop: 'sex'
          },
          {
            label: this.$t('memberManage.tableTitleParentName'),
            prop: 'parentName'
          },
          {
            label: this.$t('memberManage.tableTitlePhone'),
            prop: 'phone'
          },
          {
            label: this.$t('memberManage.tableTitleDate'),
            prop: 'date'
          },
          {
            label: this.$t('memberManage.tableTitleLeave'),
            prop: 'leave'
          },
          {
            label: this.$t('memberManage.tableTitleReason'),
            prop: 'reason'
          }
        ]
      } else {
        return []
      }
    },
    filter() {
      return this.$store.state.memberManageV2.filter
    }
  },
  watch: {
    activeName: {
      handler(v) {
        this.$store.commit('memberManageV2/SET_FILTER', null)
        this.refreshTableData()
      },
      immediate: true
    },
    filter(v) {
      this.refreshTableData()
    },
    selection(v) {
      this.disabled = !v.length
    }
  },
  created() {

  },
  methods: {
    query() {
      this.pageInfo.pageNum = 1
    },
    toSetting() {
      this.$emit('switch', { target: 'setting', index: 4 })
    },
    toAdd() {
      this.$emit('switch', { target: 'add', index: 0 })
      this.$store.commit('memberManageV2/SET_METHOD', 'add')
    },
    toDetail() {
      this.$emit('switch', { target: 'detail', index: 1 })
    },
    toModify() {
      this.$emit('switch', { target: 'modify', index: 3 })
      this.$store.commit('memberManageV2/SET_METHOD', 'modify')
    },
    toSign() {
      this.$emit('switch', { target: 'sign', index: 2 })
    },
    handleSign(scoped) {
      this.$store.commit('memberManageV2/SET_MEMBERNAME', {
        cn: scoped.row.name || '',
        en: scoped.row.englishName || ''
      })
      localStorage.setItem('memberManageV2_currentId', scoped.row.id)
      this.toSign()
    },
    refreshTableData() {
      const options = {
        state: this.activeName,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.filter) { // 如果有筛选条件
        Object.assign(options, this.filter)
      }
      this.loading = true
      queryMemberInfo(options).then(res => {
        const { data } = res
        const { content } = data
        content.forEach(v => {
          // 转换数据格式
          if (v.gender === 'MALE') {
            v.sex = '男'
          } else if (v.gender === 'FEMALE') {
            v.sex = '女'
          } else {
            v.sex = '-'
          }
          v.parentName = v.contact ? v.contact.name : '-'
          v.phone = v.contact ? v.contact.telephone : '-'
          const dateObj = transferDate(v.admissionTime)
          v.date = `${dateObj.year}-${dateObj.month}-${dateObj.date}`
          if (this.activeName === 'OUT') {
            if (v.departureInfo && v.departureInfo.time) {
              const leaveObj = transferDate(v.departureInfo.time)
              v.leave = `${leaveObj.year}-${leaveObj.month}-${leaveObj.date}`
            } else {
              v.leave = '-'
            }
            if (v.departureInfo && v.departureInfo.reason) {
              v.reason = v.departureInfo.reason
            } else {
              v.reason = '-'
            }
          }
          if (this.activeName === 'IN') {
            if (v.clazz) {
              v.className = v.clazz.name
            } else {
              v.className = '-'
            }
          }
        })
        this.tableData = data
        this.loading = false
      }).catch(err => {
        this.$message.error(this.$t('memberManage.getTableContentFailTip'))
        console.log(err)
        this.tableData = { content: [] }
        this.loading = false
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    switchState() {
      if (this.selection.length) {
        if (this.activeName === 'IN') {
          // 在园状态处理离园
          this.reason = ''
          this.popColumnSettings = [
            {
              label: this.$t('memberManage.tableTitleName'),
              prop: 'name'
            },
            {
              label: this.$t('memberManage.tableTitleSex'),
              prop: 'sex'
            },
            {
              label: this.$t('memberManage.tableTitleParentName'),
              prop: 'parentName'
            },
            {
              label: this.$t('memberManage.tableTitlePhone'),
              prop: 'phone'
            },
            {
              label: this.$t('memberManage.tableTitleDate'),
              prop: 'date'
            }
          ]
        }
        if (this.activeName === 'OUT') {
          // 离园状态处理入园
          this.popColumnSettings = [
            {
              label: this.$t('memberManage.tableTitleName'),
              prop: 'name'
            },
            {
              label: this.$t('memberManage.tableTitleSex'),
              prop: 'sex'
            },
            {
              label: this.$t('memberManage.tableTitleParentName'),
              prop: 'parentName'
            },
            {
              label: this.$t('memberManage.tableTitlePhone'),
              prop: 'phone'
            },
            {
              label: this.$t('memberManage.tableTitleDate'),
              prop: 'date'
            },
            {
              label: this.$t('memberManage.tableTitleLeave'),
              prop: 'leave'
            },
            {
              label: this.$t('memberManage.tableTitleReason'),
              prop: 'reason'
            }
          ]
        }
        this.popTableData = this.selection
        this.handlePopOpen()
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('memberManage.selectMemberTip')
        })
      }
    },
    showMember(scoped) {
      getGardenXq(scoped.row.id).then(res => {
        const { data } = res
        this.memberData = data
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.loading = false
      })
      this.handleSideOpen()
    },
    handleDeleteMember(scoped) {
      this.classPopData.splice(scoped.$index, 1)
    },
    handleBatchArrange() {
      if (this.selection.length) {
        this.classPopTitle = '批量分班'
        this.classPopType = 'complex'
        this.classPopData = this.selection
        this.handleClassPopOpen()
      } else {
        this.$message({
          type: 'warning',
          message: '请勾选需分班的会员'
        })
      }
    },
    handleArrangeClass(scoped) {
      this.selectMemberData = scoped.row
      this.classPopTitle = '分班'
      this.classPopType = 'simple'
      this.handleClassPopOpen()
    },
    handleClassPopOpen() {
      getClassList().then(res => {
        this.classListData = res.data
        this.classPop = true
      }).catch(err => {
        console.log(err)
      })
    },
    handleClassPopClose() {
      this.classPop = false
      this.targetClass = ''
    },
    handleClassPopConfirm() {
      if (!this.targetClass) {
        return this.$message({
          type: 'warning',
          message: '请选择班级'
        })
      }
      let customerIds = []
      const clazzId = this.targetClass
      if (this.classPopTitle === '分班') {
        customerIds = [this.selectMemberData.id]
      }
      if (this.classPopTitle === '批量分班') {
        this.selection.forEach(v => {
          customerIds.push(v.id)
        })
      }
      arrangeClass({ customerIds, clazzId }).then(res => {
        this.handleClassPopClose()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.refreshTableData()
      }).catch(err => {
        console.log(err)
        this.handleClassPopClose()
      })
    },
    handleClassPopCancel() {
      this.handleClassPopClose()
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    handlePopConfirm() {
      const ids = []
      let p
      this.selection.forEach(v => {
        ids.push(v.id)
      })
      if (this.activeName === 'IN') {
        // 在园状态处理离园
        if (this.reason) {
          p = getOutGarden({ ids, reason: this.reason })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('memberManage.selectLeaveReasonTip')
          })
          return false
        }
      }
      if (this.activeName === 'OUT') {
        // 离园状态处理入园
        p = putInGarden({ ids })
      }
      p.then(res => {
        this.$message({
          type: 'success',
          message: this.$t('memberManage.handleSuccessTip')
        })
        this.handlePopClose()
        this.refreshTableData()
        // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('memberManage.handleFailTip'))
        this.handlePopClose()
      })
    },
    exportToExcel() {
      if (!this.selection.length) {
        return this.$message({
          type: 'warning',
          message: '请选择会员'
        })
      }
      if (this.activeName === 'IN') {
        getexcel({ data: this.selection, columns: [{ label: '会员姓名', prop: 'name' }, ...this.columns], fileName: '在园会员列表' })
      }
      if (this.activeName === 'OUT') {
        getexcel({ component: this.$refs.table, fileName: '离园会员列表' })
      }
    },
    handleDetail(scoped) {
      localStorage.setItem('memberManageV2_currentId', scoped.row.id)
      this.toDetail()
    },
    handleModify(scoped) {
      localStorage.setItem('memberManageV2_currentId', scoped.row.id)
      this.toModify()
    },
    selectionChange(val) {
      this.selection = val
    },
    handleSideClose() {
      this.side = false
    },
    handleSideOpen() {
      this.side = true
    }
  }
}
</script>

<style scoped lang="scss">
.memberManage_manage {
  @include bgc_bg_color();
}
</style>
