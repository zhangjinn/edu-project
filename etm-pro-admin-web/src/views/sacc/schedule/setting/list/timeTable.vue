<template>
  <div>
    <etm-table
      ref="timeTable"
      class="timeTable"
      :data="tableData"
      row-key="index"
      border
    >
      <el-table-column
        type="index"
        :label="$t('schedule.tableLabelIndex')"
        width="65"
      />
      <el-table-column
        :label="$t('schedule.tableLabelTime')"
        prop="time"
        align="center"
        header-align="center"
      />
      <el-table-column :label="$t('schedule.tableLabelStatus')" prop="enable" align="center" header-align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.enable" @change="changeState(scope.row)">{{ $t('schedule.enableBtnText') }}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column :label="$t('schedule.tableLabelHandle')" prop="handle" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.enable" type="text" @click.stop="editTime(scope.row)">{{ $t('schedule.editBtnText') }}</el-button>
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      :visible="pop"
      pop="simple"
      :title="$t('schedule.popTitleEditScheduleTime')"
      :confirm-btn="$t('schedule.confirmBtnText')"
      :cancel-btn="$t('schedule.cancelBtnText')"
      class="timeTablePop"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :rules="rules" :model="timeForm" type="dialog">
        <el-form-item :label="$t('schedule.tableLabelTime') + ':'" prop="time">
          <el-time-picker
            v-model="timeForm.time"
            is-range
            :range-separator="$t('schedule.timeRangeSeparator')"
            :start-placeholder="$t('schedule.timeStartPlaceHolder')"
            :end-placeholder="$t('schedule.timeEndPlaceHolder')"
            :placeholder="$t('schedule.timePlaceHolderText')"
            value-format="HH:mm"
            format="HH:mm"
            :picker-options="{format: 'HH:mm'}"
          />
        </el-form-item>
        <el-form-item :label="$t('schedule.enableBtnText') + ':'">
          <el-checkbox v-model="timeForm.enable" />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>

</template>
<script>
import { getTimeSetting, modifyTimeSetting } from '@/api/schedule'
import etmPop from '@/layout/main/EtmPop'
export default {
  components: {
    etmPop
  },
  data() {
    const _this = this
    return {
      tableData: [],
      pop: false,
      timeForm: {
        enable: false,
        time: ''
      },
      targetScheduleTimeId: undefined,
      rules: {
        time: [
          { required: true, message: _this.$t('schedule.selectTimeMessage'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.refreshTableData()
  },
  methods: {
    refreshTableData() {
      getTimeSetting().then(res => {
        const { data } = res
        data.forEach(v => {
          v.time = `${v.startTime}-${v.endTime}`
        })
        this.tableData = data
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.getTimeSettingFailTip'))
      })
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const { enable } = this.timeForm
          const startTime = this.timeForm.time[0]
          const endTime = this.timeForm.time[1]
          const scheduleTimeId = this.targetScheduleTimeId
          this.modify({ scheduleTimeId, enable, startTime, endTime })
          this.handlePopClose()
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    changeState(row) {
      const { scheduleTimeId, enable, startTime, endTime } = row
      this.modify({ scheduleTimeId, enable, startTime, endTime })
    },
    editTime(row) {
      this.targetScheduleTimeId = row.scheduleTimeId
      this.timeForm = {
        enable: false,
        time: ''
      }
      this.handlePopOpen()
    },
    modify({ scheduleTimeId, enable, startTime, endTime }) {
      modifyTimeSetting({ scheduleTimeId, enable, startTime, endTime }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('schedule.modifySuccessTip')
        })
        this.refreshTableData()
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.modifyFailTip'))
        this.refreshTableData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.timeTable {
  & >>> .el-button.is-disabled {
    @include c_disabled_color();
  }
}
.timeTablePop {
  & >>> .el-form {
    .el-date-editor.el-input__inner {
      width: 370px;
    }
  }
}
</style>
