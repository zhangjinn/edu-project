<template>
  <div class="content">
    <div class="controlBtn clearfix">
      <el-button @click.stop="handlePopOpen">
        + {{ $t('schedule.addScheduleBtnText') }}
      </el-button>
    </div>
    <Etm-table
      :element-table-attributes="tableAttributes"
      :element-table-events="tableEvents"
      :column="columnSettings"
    >
      <template v-slot:handle>
        <div class="handleBtn">
          <span data-button="detail">{{ $t('schedule.detailBtnText') }}</span>
          <span data-button="modify">{{ $t('schedule.modifyBtnText') }}</span>
          <span class="delete" data-button="delete">{{ $t('schedule.deleteBtnText') }}</span>
        </div>
      </template>
    </Etm-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
      :page-sizes="[10, 20, 40, 60, 80]"
      layout="total, sizes, prev, pager, next, jumper"
      class="paginationContainer"
      @size-change="refreshTableData"
      @current-change="refreshTableData"
    />
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
import EtmTable from '@/layout/main/EtmTable'
import etmPop from '@/layout/main/EtmPop'
import { queryScheduleList, deleteScheduleById, getClassList, addSchedule, getScheduleState } from '@/api/schedule'
import { getDateObj, insertString } from '../util'

export default {
  components: {
    EtmTable,
    etmPop
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    switchFunction: {
      type: Object
    }
  },
  data() {
    const _self = this
    return {
      tableAttributes: {
        data: [],
        height: 'calc(100vh - 407px)'
      },
      tableEvents: {
        'row-click': function(row, column, event) {
          if (event.target.getAttribute('data-button') === 'detail') {
            _self.$store.commit('schedule/SET_HANDLESCHEDULEID', row.weekScheduleId)
            _self.switchFunction.toDetail()
          }
          if (event.target.getAttribute('data-button') === 'modify') {
            _self.$store.commit('schedule/SET_HANDLESCHEDULEID', row.weekScheduleId)
            _self.switchFunction.toModify()
          }
          if (event.target.getAttribute('data-button') === 'delete') {
            _self.$store.commit('schedule/SET_HANDLESCHEDULEID', row.weekScheduleId)
            _self.handleTipOpen()
          }
        }
      },
      columnSettings: [
        {
          label: _self.$t('schedule.popLabelBelongClass'),
          prop: 'clazzName'
        },
        {
          label: _self.$t('schedule.popLabelDate'),
          prop: 'time'
        },
        {
          label: _self.$t('schedule.tableLabelUpdateTime'),
          prop: 'update'
        },
        {
          label: _self.$t('schedule.tableLabelHandle'),
          prop: 'handle'
        }
      ],
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
          message: _self.$t('schedule.classSelectPlaceHolderText')
        }],
        date: [{
          required: true,
          trigger: 'blur',
          message: _self.$t('schedule.weekSelectPlaceHolderText')
        }]
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      classList: [],
      showTip: false
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
    refreshTableData() {
      const pageNum = this.currentPage
      const pageSize = this.pageSize
      const clazzName = this.queryClass || undefined
      const weekNumber = this.queryWeek || undefined
      queryScheduleList({ pageNum, pageSize, clazzName, weekNumber }).then(res => {
        const { data } = res
        const { content } = data
        this.total = data.totalElements
        content.forEach(v => {
          const updateDateObj = getDateObj(v.updateTime)
          const startDateObj = getDateObj(v.startDate)
          const endDateObj = getDateObj(v.startDate + 6 * 24 * 60 * 60 * 1000)
          v.update = `${updateDateObj.year}-${updateDateObj.month}-${updateDateObj.day} ${updateDateObj.hour}:${updateDateObj.minute}:${updateDateObj.second}`
          v.time = `${insertString(this.$t('schedule.weekCountQuantityText'), v.weekNumber, 4)} ${startDateObj.month}-${startDateObj.day}~${endDateObj.month}-${endDateObj.day}`
        })
        this.tableAttributes.data = content
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
            this.switchFunction.toAdd()
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
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
.content {
  height: calc(100vh - 364px);
  margin-top: 16px;
  @include bgc_white();
  border-radius: 2px;
  .handleBtn {
    font-size: 0;
    @include c_main_color();
    span {
      font-size: 14px;
      cursor: pointer;
      & + span {
        margin-left: 20px;
      }
      &.delete {
        @include c_error_color();
      }
    }
  }
  .controlBtn {
    font-size: 0;
    padding: 16px 24px;
    & >>> .el-button {
      float: right;
      span {
        @include c_white();
      }
      i {
        margin-right: 7px;
      }
    }
  }
  & >>> .el-pagination {
    padding: 24px 0 0 24px;
  }
}
.scheduleManageContentPop {
  .tip {
    margin-left: 80px;
    font-size: 12px;
    @include c_error_color();
  }
}
</style>
