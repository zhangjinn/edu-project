<template>
  <div class="statistics">
    <div class="header">
      <div class="topFixed">
        <div class="selectBox van-hairline--bottom">
          <van-row>
            <van-col :span="12" class="textCenter">
              <popup
                :title="currentMonth"
                type="month"
                size="normal"
                @select="confirmMonth"
              />
            </van-col>
            <van-col :span="12" class="textCenter">
              <dropdown
                :date="currentMonth"
                type="MONTH"
                size="normal"
                :val="courseId"
                @select="confirm"
              />
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div class="container">
      <template v-for="(item, index) in monthList">
        <list-card
          :key="index"
          :index="item.childId"
          :icon="item.avatar"
          :name="item.childName"
          type="month"
          @click.native="toDetail(item.childId)"
        >
          <div class="rightContent">
            <div>
              <p class="count greenColor">
                {{ item.onNum }}
              </p>
              <p class="label">出勤</p>
            </div>
            <div>
              <p class="count errorColor">
                {{ item.absentNum }}
              </p>
              <p class="label">缺勤</p>
            </div>
            <div>
              <p class="count mainColor">
                {{ item.askNum }}
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
import { queryMonthCountDetail } from '@/service/daycare/attendanceTeach'
import { getStartDateAndEndDateByMonth } from '@/utils/date'

export default {
  name: 'Month',
  components: {
    listCard,
    popup,
    dropdown
  },
  data() {
    return {
      courseId: null,
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
    if (this.$route.query.courseId) {
      this.courseId = parseInt(this.$route.query.courseId)
    }
    // if (this.$route.query.clazz) {
    //   this.clazzId = parseInt(this.$route.query.clazz)
    // }
  },
  methods: {
    // 获取月考勤数据
    queryData() {
      this.monthList = []
      const { startDate, endDate } = getStartDateAndEndDateByMonth(
        new Date(this.currentMonth).getMonth() + 1
      )
      queryMonthCountDetail({
        startDate: startDate,
        endDate: endDate,
        courseId: this.courseId
      }).then(res => {
        // console.log(res.data)
        this.monthList = res.data.data
      })
    },
    // 课程切换
    confirm(val, type) {
      this.courseId = val.value
      console.log(this.courseId)
      if (type === 'load') return
      this.queryData()
    },
    // 日期切换
    confirmMonth(date) {
      if (this.currentMonth === DateFormat(date, 'yyyy-MM')) return
      this.currentMonth = DateFormat(date, 'yyyy-MM')
      this.queryData()
    },
    toDetail(id) {
      this.$router.push({
        path: '/daycare_teach_attendanceDetail',
        query: {
          childId: id,
          date: this.currentMonth.replace('.', '-')
        }
      })
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
            content: "";
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
