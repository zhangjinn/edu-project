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
                :val="ids"
                :date="currentMonth"
                type="MONTH"
                size="normal"
                @select="confirmGrade"
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
import dropdown from '../../components/dropdownClazz'
import { DateFormat } from '../../../../js/rules'
import { queryMonthCountDetail } from '@/service/daycare/attendanceCare'
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
      ids: null,
      currentMonth: '',
      monthList: []
    }
  },
  created() {
    if (this.$route.query.month) {
      this.currentMonth = this.$route.query.month
    } else {
      this.currentMonth = DateFormat(new Date(), 'yyyy-MM')
    }
    // console.log('fsdfsdf', this.$route.query)
    if (this.$route.query.ids) {
      this.ids = this.$route.query.ids
    }
  },
  methods: {
    // 获取月考勤数据
    queryData() {
      this.monthList = []
      const { startDate, endDate } = getStartDateAndEndDateByMonth(
        new Date(this.currentMonth).getMonth() + 1
      )
      const ids = this.ids.split('-')
      console.log(ids[1], ids[0])
      const courseId = ids[0] || null
      const clazzId = ids[1] || null
      queryMonthCountDetail({
        startDate,
        endDate,
        courseId,
        clazzId
      }).then(res => {
        // console.log(res.data)
        this.monthList = res.data.data
      })
    },
    // 园区切换
    confirmGrade(val, type) {
      this.ids = val.value
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
        path: '/daycare_care_attendanceDetail',
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
