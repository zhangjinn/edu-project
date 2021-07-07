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
              <el-button type="primary" @click.stop="toAdd"><i class="el-icon-plus" />&nbsp;&nbsp;{{ $t('memberManage.addMemberBtnText') }}</el-button>
              <!-- <el-button plain :disabled="disabled" @click.stop="exportToExcel">导出表格</el-button> -->
              <el-button plain :disabled="disabled" style="margin-left: 8px;" @click.stop="switchState">{{ $t('memberManage.memberLeaveBtnText') }}</el-button>
            </div>
          </etm-table-tool-bar>
          <etm-table-tool-bar v-show="activeName === 'OUT'" slot="tool">
            <div slot="right">
              <!-- <el-button plain :disabled="disabled" @click.stop="exportToExcel">导出表格</el-button> -->
              <el-button plain :disabled="disabled" style="margin-left: 8px;" @click.stop="switchState">{{ $t('memberManage.memberArriveBtnText') }}</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" type="selection" />
          <el-table-column slot="left" :label="$t('memberManage.tableTitleName')">
            <template slot-scope="scoped">
              <a @click.stop="showMember(scoped)">{{ scoped.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column slot="right" :label="$t('memberManage.tableTitleHandle')">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="handleDetail(scoped)">{{ $t('memberManage.detailBtnText') }}</etm-text>
              <etm-text type="primary" @click.stop="handleModify(scoped)">{{ $t('memberManage.modifyBtnText') }}</etm-text>
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
        <Etm-table
          :element-table-attributes="popTableAttributes"
          :column="popColumnSettings"
        />
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
import EtmTable from '@/layout/main/EtmTable'
import etmSide from '@/layout/main/EtmSide'
import { getGardenList, putInGarden, getOutGarden, getGardenXq } from '@/api/sacc'
import info from './info'
import transferDate from '@/utils/date'
// import axios from 'axios'
import getexcel from '@/utils/xlsx'
// const Url = process.env.VUE_APP_BASE_API
import fil from './filter'
export default {
  components: {
    EtmTable,
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
      popTableAttributes: {
        data: []
      },
      popColumnSettings: [],
      selection: [],
      pop: false,
      reason: '',
      canExport: true,
      loading: false,
      disabled: true,
      side: false,
      memberData: {}
    }
  },
  computed: {
    activeName() {
      return this.$store.state.memberManage.gardenState
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
      return this.$store.state.memberManage.filter
    },
    token() {
      return document.cookie.match(/user_login_token=(\w+);/)[1]
    }
  },
  watch: {
    activeName: {
      handler(v) {
        this.$store.commit('memberManage/SET_FILTER', null)
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
  methods: {
    query() {
      this.pageInfo.pageNum = 1
    },
    toSetting() {
      this.$emit('switch', { target: 'setting', index: 4 })
    },
    toAdd() {
      this.$emit('switch', { target: 'add', index: 0 })
      this.$store.commit('memberManage/SET_METHOD', 'add')
    },
    toDetail() {
      this.$emit('switch', { target: 'detail', index: 1 })
    },
    toModify() {
      this.$emit('switch', { target: 'modify', index: 3 })
      this.$store.commit('memberManage/SET_METHOD', 'modify')
    },
    toSign() {
      this.$emit('switch', { target: 'sign', index: 2 })
    },
    handleSign() {
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
      getGardenList(options).then(res => {
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
          v.parentName = v.contacts ? v.contacts[0].name : '-'
          v.phone = v.contacts ? v.contacts[0].telephone : '-'
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
        })
        this.tableData = data
        this.loading = false
      // eslint-disable-next-line handle-callback-err
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
        this.popTableAttributes.data = this.selection
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
      getexcel({ component: this.$refs.table, fileName: '会员管理' })

      // if (!this.canExport) { // 避免在导出期间误按按钮导致多次导出
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t('memberManage.retryTip')
      //   })
      //   return false
      // }
      // this.canExport = false
      // const customerIdList = []
      // this.selection.forEach(v => {
      //   customerIdList.push(v.id)
      // })
      // // 存在筛选条件
      // const options = {
      //   exportState: 'SELECTED',
      //   customerState: this.activeName,
      //   customerIdList
      // }
      // axios({
      //   headers: { 'Authorization': this.token },
      //   method: 'post',
      //   url: Url + '/sacc/customer/excel',
      //   responseType: 'arraybuffer',
      //   data: options
      // }).then(res => {
      //   const str = res.headers['content-disposition']
      //   const fileName = decodeURI(str.substr(str.indexOf('%')))
      //   const blob = new Blob([res.data], {
      //     type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      //   })
      //   if (window.navigator.msSaveOrOpenBlob) {
      //     navigator.msSaveBlob(blob)
      //   } else {
      //     const elink = document.createElement('a')
      //     elink.download = fileName
      //     elink.style.display = 'none'
      //     elink.href = URL.createObjectURL(blob)
      //     document.body.appendChild(elink)
      //     elink.click()
      //     document.body.removeChild(elink)
      //   }
      //   this.$message({
      //     message: this.$t('memberManage.exportSuccessTip'),
      //     type: 'success'
      //   })
      //   setTimeout(() => {
      //     this.canExport = true
      //   }, 1000)
      // // eslint-disable-next-line handle-callback-err
      // }).catch(err => {
      //   this.$message.error(this.$t('memberManage.exportFailTip'))
      //   console.log(err)
      //   this.canExport = true
      // })
    },
    handleDetail(scoped) {
      localStorage.setItem('memberManage_currentId', scoped.row.id)
      this.toDetail()
    },
    handleModify(scoped) {
      localStorage.setItem('memberManage_currentId', scoped.row.id)
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
