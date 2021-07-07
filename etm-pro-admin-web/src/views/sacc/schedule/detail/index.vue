<template>
  <div class="detail">
    <etm-layout-split>
      <div class="header">
        <h6>
          {{ $t('schedule.scheduelTimeTitle') }}：{{ week }} {{ startDay }}~{{ endDay }}
          <i />
          {{ $t('schedule.popLabelBelongClass') }}：{{ belongClass }}
        </h6>
        <div>
          <el-button @click.stop="handlePopOpen">{{ $t('schedule.copyScheduleBtnText') }}</el-button>
          <!-- <el-button>导出表格</el-button> -->
        </div>
      </div>
      <schedule-table
        :table-data="tableData"
        :date-arr="dateArr"
        :show-handle="false"
      />
    </etm-layout-split>

    <etm-pop
      :visible="pop"
      pop="simple"
      :title="$t('schedule.copyScheduleBtnText')"
      :confirm-btn="$t('schedule.confirmBtnText')"
      :cancel-btn="$t('schedule.cancelBtnText')"
      class="scheduleDetailPop"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="form" :rules="rules" type="dialog">
        <el-form-item :label="$t('schedule.popLabelBelongClass') + '：'" prop="selectedClassIds">
          <el-select v-model="form.selectedClassIds" multiple :placeholder="$t('schedule.classSelectPlaceHolderText')">
            <el-option v-for="(option, index) in classList" :key="index" :label="option.clazzName" :value="option.clazzId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schedule.formLabelTargetTime') + '：'" prop="date">
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
      <div v-show="conflictClass.length" class="tip">
        <span v-for="(c, i) in conflictClass" :key="i">
          {{ c }}，
        </span>{{ $t('schedule.popTipRepeatSchedule') }}
      </div>
    </etm-pop>
  </div>
</template>
<script>
const dayArr = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
import scheduleTable from '../components/scheduleTable'
import etmPop from '@/layout/main/EtmPop'
import { getScheduleDetail, getClassList, getScheduleState, copySchedule } from '@/api/schedule'
import { getDateObj, insertString } from '../util'

export default {
  components: {
    scheduleTable,
    etmPop
  },
  data() {
    const _this = this
    return {
      tableData: [],
      dateArr: [],
      pop: false,
      belongClass: '',
      form: {
        selectedClassIds: [],
        date: '',
        weekNumber: ''
      },
      conflictClass: [], // 记录日程有冲突的班级
      week: '',
      startDay: '',
      endDay: '',
      classList: [],
      rules: {
        selectedClassIds: [{
          required: true,
          trigger: 'change',
          message: _this.$t('schedule.classSelectPlaceHolderText')
        }],
        date: [{
          required: true,
          trigger: 'blur',
          message: _this.$t('schedule.weekSelectPlaceHolderText')
        }]
      }
    }
  },
  created() {
    // 获取日程详情内容
    getScheduleDetail({ weekScheduleId: this.$store.state.schedule.handleScheduleId }).then(res => {
      const { data: { scheduleList, clazzName, weekNumber }} = res
      this.belongClass = clazzName
      this.week = insertString(this.$t('schedule.weekCountQuantityText'), weekNumber, 4)
      scheduleList.forEach((day, i) => {
        const dateObj = getDateObj(day.date)
        const weekday = dayArr[i]
        if (i === 0) {
          this.startDay = `${dateObj.month}-${dateObj.day}`
        }
        if (i === 6) {
          this.endDay = `${dateObj.month}-${dateObj.day}`
        }
        this.dateArr.push(`${dateObj.month}.${dateObj.day}`) // 处理表格横向的日期显示
        day.scheduleTimeList.forEach((time, index) => {
          if (i === 0) {
            this.tableData.push({ // 处理表格纵向的时间显示
              date: `${time.startTime}-${time.endTime}`
            })
          }
          this.$set(this.tableData[index], weekday, time.contentList || []) // 插入每一个时间段的项目内容
        })
      })
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getScheduleDetailFailTip'))
      // this.$emit('jump', 'manage')
    })

    // 获取弹窗中的班级列表内容
    getClassList().then(res => {
      const { data } = res
      this.classList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getClassListFailTip'))
    })
  },
  methods: {
    queryTimeChange(v) {
      this.$nextTick(() => {
        if (this.$refs.date.displayValue) {
          this.form.weekNumber = this.$refs.date.displayValue.match(/第(\w+)周/)[1]
        } else {
          this.form.weekNumber = ''
        }
        const classIdsArr = this.form.selectedClassIds
        if (classIdsArr.length) {
          const thursdayDateObj = getDateObj(this.form.date + 2 * 24 * 60 * 60 * 1000)
          const weekNumber = thursdayDateObj.year + this.form.weekNumber + this.$t('schedule.weekText')
          const promiseArr = []
          this.conflictClass = []
          classIdsArr.forEach(id => {
            promiseArr.push(getScheduleState({
              clazzId: id,
              weekNumber
            }))
          })
          Promise.all(promiseArr).then(resArr => {
            resArr.forEach((res, index) => {
              const { data: { exists }} = res
              if (exists) { // 日程有冲突
                const classId = classIdsArr[index]
                for (const v of this.classList) {
                  if (v.clazzId === classId) {
                    this.conflictClass.push(v.clazzName)
                    break
                  }
                }
              }
            })
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
    handlePopOpen() {
      this.form = {
        selectedClassIds: [],
        date: '',
        weekNumber: ''
      }
      this.conflictClass = []
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopConfirm() {
      // 复制日程
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const startDate = new Date(this.form.date).getTime() - 24 * 60 * 60 * 1000
          const startDateObj = getDateObj(startDate)
          const thursdayDateObj = getDateObj(startDate + 3 * 24 * 60 * 60 * 1000)
          copySchedule({
            weekScheduleId: this.$store.state.schedule.handleScheduleId,
            clazzIdList: this.form.selectedClassIds,
            startDate: `${startDateObj.year}-${startDateObj.month}-${startDateObj.day}`,
            weekNumber: `${thursdayDateObj.year}${this.form.weekNumber}${this.$t('schedule.weekText')}`
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('schedule.copyScheduleSuccessTip')
            })
          // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.$message.error(this.$t('schedule.copyScheduleFailTip'))
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
.detail {
  /*height: 100%;*/
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /*padding: 0 24px;*/
    height: 56px;
    i {
      margin: 0 10px;
    }
    h6 {
      font-size: 14px;
      margin: 0;
      @include c_text_color();
      font-weight: normal;
    }
  }
}
.scheduleDetailPop {
  .tip {
    margin: 0 20px 0 100px;
    font-size: 12px;
    @include c_error_color();
  }
}
</style>
