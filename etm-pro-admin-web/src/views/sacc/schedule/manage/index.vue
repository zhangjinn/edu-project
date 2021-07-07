<template>
  <div class="manage">
    <etm-layout-split>
      <div slot="header">
        <fil @setting="toSetting" @query="query" />
      </div>
      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          index-type="index"
          border
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button type="primary" @click.stop="handlePopOpen"><i class="el-icon-plus" />&nbsp;&nbsp;{{ $t('schedule.addScheduleBtnText') }}</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="right" :label="$t('schedule.tableLabelHandle')">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="handleDetail(scoped)">{{ $t('schedule.detailBtnText') }}</etm-text>
              <etm-text type="primary" @click.stop="handleModify(scoped)">{{ $t('schedule.modifyBtnText') }}</etm-text>
              <etm-text type="danger" @click.stop="handleDelete(scoped)">{{ $t('schedule.deleteBtnText') }}</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <etm-pop
      :visible="pop"
      pop="simple"
      :title="$t('schedule.addScheduleBtnText')"
      :confirm-btn="$t('schedule.confirmBtnText')"
      :cancel-btn="$t('schedule.cancelBtnText')"
      class="scheduleManageContentPop"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="form" :rules="rules" type="dialog">
        <el-form-item :label="$t('schedule.popLabelBelongClass')" prop="classId">
          <el-select v-model="form.classId" :placeholder="$t('schedule.classSelectPlaceHolderText')" @change="clearTime">
            <el-option v-for="(option, index) in classList" :key="index" :label="option.clazzName" :value="option.clazzId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schedule.popLabelDate')" prop="date">
          <el-date-picker
            ref="date"
            v-model="form.date"
            type="week"
            :format="$t('schedule.popFormatDate')"
            :placeholder="$t('schedule.weekSelectPlaceHolderText')"
            :picker-options="{firstDayOfWeek: 1}"
            @change="queryTimeChange"
          />
        </el-form-item>
      </etm-form>
      <div v-show="showTip" class="tip">{{ $t('schedule.popTipRepeatSchedule') }}</div>
    </etm-pop>
  </div>
</template>
<script>
import fil from './filter'
import etmPop from '@/layout/main/EtmPop'
import { queryScheduleList, deleteScheduleById, getClassList, addSchedule, getScheduleState } from '@/api/schedule'
import { getDateObj, insertString } from '../util'
export default {
  components: {
    fil,
    etmPop
  },
  data() {
    const _this = this
    return {
      columns: [
        {
          label: _this.$t('schedule.tableLabelClass'),
          prop: 'clazzName'
        },
        {
          label: _this.$t('schedule.tableLabelDate'),
          prop: 'time'
        },
        {
          label: _this.$t('schedule.tableLabelUpdateTime'),
          prop: 'update'
        }
      ],
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      pop: false,
      form: {
        date: '',
        className: '',
        classId: undefined,
        startDate: null,
        weekNumber: ''
      },
      rules: {
        classId: [{
          required: true,
          trigger: 'change',
          message: _this.$t('schedule.classSelectPlaceHolderText')
        }],
        date: [{
          required: true,
          trigger: 'blur',
          message: _this.$t('schedule.weekSelectPlaceHolderText')
        }]
      },
      showTip: false,
      classList: []
    }
  },
  computed: {
    queryClass() {
      return this.$store.state.schedule.queryClass
    },
    queryWeek() {
      return this.$store.state.schedule.queryWeek
    }
  },
  watch: {
    queryClass() {
      this.refreshTableData()
    },
    queryWeek() {
      this.refreshTableData()
    }
  },
  created() {
    this.refreshTableData()
    getClassList().then(res => {
      const { data } = res
      this.classList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getClassListFailTip'))
    })
  },
  mounted() {
    this.$etmTip.init({
      type: 'error',
      title: '确定删除该日程？',
      content: '删除后将无法撤销，是否继续操作？',
      confirmBtn: '删除',
      cancelBtn: '取消',
      confirm: this.handleDeleteConfirm,
      cancel: this.handleDeleteCancel
    })
  },
  methods: {
    query() {
      this.pageInfo.pageNum = 1
    },
    toDetail() {
      this.$emit('switch', { target: 'detail', index: 0 })
    },
    toAdd() {
      this.$emit('switch', { target: 'add', index: 1 })
    },
    toModify() {
      this.$emit('switch', { target: 'modify', index: 2 })
    },
    toSetting() {
      this.$emit('switch', { target: 'setting', index: 3 })
    },
    refreshTableData() {
      const pageNum = this.pageInfo.pageNum
      const pageSize = this.pageInfo.pageSize
      const clazzName = this.queryClass || undefined
      const weekNumber = this.queryWeek || undefined
      queryScheduleList({ pageNum, pageSize, clazzName, weekNumber }).then(res => {
        const { data } = res
        const { content } = data
        content.forEach(v => {
          const updateDateObj = getDateObj(v.updateTime)
          const startDateObj = getDateObj(v.startDate)
          const endDateObj = getDateObj(v.startDate + 6 * 24 * 60 * 60 * 1000)
          v.update = `${updateDateObj.year}-${updateDateObj.month}-${updateDateObj.day} ${updateDateObj.hour}:${updateDateObj.minute}:${updateDateObj.second}`
          v.time = `${insertString(this.$t('schedule.weekCountQuantityText'), v.weekNumber, 4)} ${startDateObj.month}-${startDateObj.day}~${endDateObj.month}-${endDateObj.day}`
        })
        this.tableData = data
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.queryScheduleListFailTip'))
      })
    },
    queryTimeChange() {
      this.$nextTick(() => {
        if (this.$refs.date.displayValue) {
          this.form.weekNumber = this.$refs.date.displayValue.match(/第(\w+)周/)[1]
        } else {
          this.form.weekNumber = ''
        }
        if (this.form.classId) {
          const thursdayDateObj = getDateObj(this.form.date + 2 * 24 * 60 * 60 * 1000)
          getScheduleState({
            clazzId: this.form.classId,
            weekNumber: thursdayDateObj.year + this.form.weekNumber + this.$t('schedule.weekText')
          }).then(res => {
            const { data: { exists }} = res
            this.showTip = exists
            // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.$message.error(this.$t('schedule.getScheduleStateFailTip'))
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('schedule.classSelectPlaceHolderText')
          })
          this.form.date = ''
        }
      })
    },
    clearTime() {
      this.form.date = ''
    },
    handleTipOpen() {
      this.$etmTip.open()
    },
    handleTipClose() {
      this.$etmTip.close()
    },
    handleDeleteConfirm() {
      const weekScheduleId = this.$store.state.schedule.handleScheduleId
      deleteScheduleById({ weekScheduleId }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('schedule.deleteSuccessTip')
        })
        this.refreshTableData()
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.deleteFailTip'))
        this.refreshTableData()
      })
      this.handleTipClose()
    },
    handleDeleteCancel() {
      this.handleTipClose()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    handleDetail(scoped) {
      this.$store.commit('schedule/SET_HANDLESCHEDULEID', scoped.row.weekScheduleId)
      this.toDetail()
    },
    handleModify(scoped) {
      this.$store.commit('schedule/SET_HANDLESCHEDULEID', scoped.row.weekScheduleId)
      this.toModify()
    },
    handleDelete(scoped) {
      this.$store.commit('schedule/SET_HANDLESCHEDULEID', scoped.row.weekScheduleId)
      this.handleTipOpen()
    },
    handlePopOpen() {
      this.form = {
        date: '',
        className: '',
        classId: undefined,
        startDate: null,
        weekNumber: ''
      }
      this.showTip = false
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          for (const k in this.classList) {
            if (this.classList[k].clazzId === this.form.classId) {
              this.form.className = this.classList[k].clazzName
            }
          }
          this.form.startDate = new Date(this.form.date).getTime() - 24 * 60 * 60 * 1000
          const startDateObj = getDateObj(this.form.startDate)
          const thursdayDateObj = getDateObj(this.form.startDate + 3 * 24 * 60 * 60 * 1000)
          addSchedule({
            clazzId: this.form.classId,
            startDate: `${startDateObj.year}-${startDateObj.month}-${startDateObj.day}`,
            weekNumber: `${thursdayDateObj.year}${this.form.weekNumber}${this.$t('schedule.weekText')}`
          }).then(res => {
            const { data } = res
            this.$store.commit('schedule/SET_HANDLESCHEDULEID', data.weekScheduleId)
            this.toAdd()
          // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.$message.error(this.$t('schedule.addScheduleFailTip'))
          })
          this.handlePopClose()
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.handlePopClose()
    }
  }
}
</script>

<style scoped lang="scss">
.manage {
  @include bgc_bg_color();
}
.scheduleManageContentPop {
  & >>> .el-select {
    width: 220px;
  }
  .tip {
    margin-left: 80px;
    font-size: 12px;
    @include c_error_color();
  }
}
</style>
