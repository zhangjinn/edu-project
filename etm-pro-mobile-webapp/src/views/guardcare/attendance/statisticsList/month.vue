<template>
  <div class="statistics">
    <div class="header">
      <div class="topFixed">
        <div class="selectBox van-hairline--bottom">
          <van-row>
            <van-col :span="8" class="textLeft">
              <dropdown
                ref="grade"
                :grade-id="gradeId"
                type="grade"
                size="normal"
                @open="openGrade"
                @select="confirmGrade"
              />
            </van-col>
            <van-col :span="8" class="textCenter">
              <dropdown
                ref="clazz"
                :grade-id="gradeId"
                :clazz-id="clazzId"
                type="clazz"
                size="normal"
                @open="openClazz"
                @select="confirmClazz"
              />
            </van-col>
            <van-col :span="8" class="textRight">
              <popup :title="currentMonth" type="month" size="normal" @select="confirmMonth" />
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div class="container">
      <template v-for="(item,index) in monthList">
        <list-card
          :key="index"
          :index="item.childId"
          :icon="item.avatar"
          :name="item.childName"
          :label="'出勤率:'"
          :number="Math.ceil(item.attendanceRate)"
          type="month"
          @click.native="toDetail(item.childId)"
        >
          <div class="rightContent">
            <div>
              <p class="count greenColor">
                {{ item.arrivedNumber }}
              </p>
              <p class="label">出勤</p>
            </div>
            <div>
              <p class="count errorColor">
                {{ item.notArrivedNumber }}
              </p>
              <p class="label">缺勤</p>
            </div>
            <div>
              <p class="count mainColor">
                {{ item.requestForLeaveNumber }}
              </p>
              <p class="label">请假</p>
            </div>
          </div>
        </list-card>
      </template>
    </div>
  </div>
</template>

<script>
import listCard from './listCard'
import popup from '../../components/popup'
import dropdown from '../../components/dropdown'
import { DateFormat } from '../../../../js/rules'
import { getMonthStatistics } from '../../../../service/guardcare/attendance'

export default {
  name: 'Month',
  components: {
    listCard,
    popup,
    dropdown
  },
  data() {
    return {
      gradeId: null,
      clazzId: null,
      currentMonth: '',
      monthList: []
    }
  },
  created() {
    if (this.$route.query.month) {
      this.currentMonth = this.$route.query.month
    } else {
      this.currentMonth = DateFormat(new Date(), 'yyyy.MM')
    }
    if (this.$route.query.grade) {
      this.gradeId = parseInt(this.$route.query.grade)
    }
    if (this.$route.query.clazz) {
      this.clazzId = parseInt(this.$route.query.clazz)
    }
  },
  methods: {
    // 获取月考勤数据
    getData() {
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
      getMonthStatistics(param).then(res => {
        this.monthList = res.data.data
      })
    },
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
    confirmMonth(date) {
      if (this.currentMonth === DateFormat(date, 'yyyy.MM')) return
      this.currentMonth = DateFormat(date, 'yyyy.MM')
      this.getData()
    },
    toDetail(id) {
      this.$router.push({
        path: '/guardcare_attendanceDetail',
        query: {
          childId: id
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

<style lang="scss" scoped>
.statistics {
  .header {
    height: 46px;

    .topFixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      width: 100%;
      height: 46px;
      background-color: $white;

      .selectBox {
        padding: 0px 16px;
      }
    }
  }

  .container {
    padding-bottom: 12px;

    .rightContent {
      display: flex;

      div {
        text-align: center;

        &:not(:last-child) {
          position: relative;
          margin-right: 40px;

          &::after {
            display: inline-block;
            position: absolute;
            top: 9px;
            right: -20px;
            content: '';
            width: 1px;
            height: 20px;
            background-color: $text-d;
          }
        }
      }

      p {
        line-height: 19px;

        &.count {
          font-size: 15px;
        }

        &.label {
          font-size: 12px;
          color: $text-9;
        }
      }
    }
  }
}
</style>
