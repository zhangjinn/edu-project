<template>
  <div class="filter">
    <div class="selectBox">
      <van-row>
        <van-col :span="8" class="textLeft">
          <dropdown
            ref="grade"
            type="grade"
            @open="openGrade"
            @select="confirmGrade"
          />
        </van-col>
        <van-col :span="8" class="textCenter">
          <dropdown
            ref="clazz"
            :grade-id="gradeId"
            type="clazz"
            @open="openClazz"
            @select="confirmClazz"
          />
        </van-col>
        <van-col :span="8" class="textRight">
          <template>
            <popup :title="currentDate" type="date" @select="confirmDate" />
          </template>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import { DateFormat } from '../../../../js/rules'
import { getAttendanceDay, getAttendanceMonth } from '../../../../service/guardcare/attendance'
import dropdown from '../../components/dropdown'
import popup from '../../components/popup'
export default {
  components: {
    dropdown,
    popup
  },
  data() {
    return {
      gradeId: null,
      clazzId: null,
      currentDate: '',
      currentMonth: '',
      attendanceData: {
        rate: 0
      },
      onlyOne: false,
      monthData: []
    }
  },
  created() {
    this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    this.currentMonth = DateFormat(new Date(), 'yyyy.MM')
  },
  methods: {
    // 园区切换
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      this.clazzId = 0
      this.getData()
    },
    // 班级切换
    confirmClazz(val) {
      this.clazzId = val.value
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy.MM.dd')) return
      this.currentDate = DateFormat(date, 'yyyy.MM.dd')
      this.getDayData()
    },
    // 月份切换
    confirmMonth(date) {
      if (this.currentMonth === DateFormat(date, 'yyyy.MM')) return
      this.currentMonth = DateFormat(date, 'yyyy.MM')
      this.getMonthData()
    },
    getData() {
      this.getDayData()
      this.getMonthData()
    },
    // 获取日统计数据
    getDayData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        date: date
      }
      if (this.gradeId) {
        param.gradeId = this.gradeId
      } else {
        param.gradeId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.attendanceData = {
        rate: 0
      }
      getAttendanceDay(param).then(res => {
        if (res.data.data) {
          this.attendanceData = res.data.data
          if (this.attendanceData.shouldArriveNumber) {
            this.attendanceData.rate = this.attendanceData.arrivedNumber / this.attendanceData.shouldArriveNumber * 100
          } else {
            this.attendanceData.rate = 0
          }
        }
        this.$emit('change')
      })
    },
    // 获取月统计数据
    getMonthData() {
      const date = this.currentMonth.replace(/\./g, '-') + '-01'
      const param = {
        date: date
      }
      if (this.gradeId) {
        param.gradeId = this.gradeId
      } else {
        param.gradeId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      this.monthData = []
      getAttendanceMonth(param).then(res => {
        const data = res.data.data ? res.data.data.gradeList : []
        this.monthData = []
        data.forEach(item => {
          if (item.clazzList.length) {
            this.monthData.push(item)
          }
        })
        if (this.monthData.length === 1 && this.monthData[0].clazzList.length === 1) {
          this.onlyOne = true
        } else {
          this.onlyOne = false
        }
      })
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  .selectBox {
    background-color: $white;
  }
  .scrollBox {
    max-height: calc(100vh - 160px);
    overflow-y: auto;
  }
  .textLeft, .textCenter, .textRight {
    text-align: center;
  }
}
</style>
