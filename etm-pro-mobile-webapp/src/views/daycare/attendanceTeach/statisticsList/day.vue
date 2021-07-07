<template>
  <div class="statistics">
    <div class="header">
      <div class="topFixed">
        <div class="selectBox van-hairline--bottom">
          <van-row>
            <van-col :span="12" class="textCenter">
              <popup
                :title="currentDate"
                type="date"
                size="normal"
                @select="confirmDate"
              />
            </van-col>
            <van-col :span="12" class="textCenter">
              <dropdown
                :date="currentDate"
                :val="courseManagementId"
                size="normal"
                @select="confirmGrade"
              />
            </van-col>
          </van-row>
        </div>
        <div class="tabBox">
          <div class="textLeft van-hairline--bottom">
            <tabs
              :tab-list="tabList"
              :tab-active="tabActive"
              @change="tabChange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <template v-for="(item, index) in list">
        <universal-card
          :key="index"
          :index="item.childId"
          :icon="item.avatar"
          :name="item.childName"
          @click.native="toDetail(item.childId)"
        >
          <div class="rightContent">
            <div>
              <p class="label">{{ statusList[item.status] }}</p>
            </div>
          </div>
        </universal-card>
      </template>
    </div>
  </div>
</template>

<script>
import tabs from '../../../../components/common/tabs'
import popup from '../../components/popup'
import dropdown from '../../components/dropdown'
import { DateFormat } from '../../../../js/rules'
import { queryDayCountDetail } from '@/service/daycare/attendanceTeach'
import UniversalCard from '@/components/common/universalCard'

export default {
  name: 'Day',
  components: {
    UniversalCard,
    tabs,
    popup,
    dropdown
    // noContent
  },
  data() {
    return {
      tabActive: 0,
      tabList: ['已考勤', '未考勤', '已请假'],
      tabTypeList: ['ATTENDANCE', 'NOT_ATTENDANCE', 'ASK_FOR_LEAVE'],
      statusList: {
        NOT_ATTENDANCE: '未考勤',
        SIGN_IN: '签到',
        ABSENT_FROM_WORK: '缺勤',
        ASK_FOR_LEAVE: '请假',
        EFFECTIVE_ASK_FOR_LEAVE: '已请假'
      },
      courseManagementId: null,
      clazzId: null,
      list: [],
      enterList: [],
      notEnterList: [],
      leaveList: [],
      currentDate: '',
      date: new Date(),
      maxDate: new Date(),
      showDatePicker: false
    }
  },
  created() {
    const type = this.$route.query.type
    if (type === 'leave') {
      this.tabActive = 2
    } else if (type === 'notArrive') {
      this.tabActive = 1
    } else {
      this.tabActive = 0
    }
    if (this.$route.query.date) {
      this.currentDate = this.$route.query.date
    } else {
      this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    }
    if (this.$route.query.courseManagementId) {
      this.courseManagementId = parseInt(this.$route.query.courseManagementId)
    }
    // if (this.$route.query.clazz) {
    //   this.clazzId = parseInt(this.$route.query.clazz)
    // }
  },
  methods: {
    getData() {
      this.getArrivalData()
      this.getNotArrivalData()
      this.getLeaveData()
    },
    getTime(time) {
      if (!time) return '--'
      return DateFormat(time, 'hh:mm')
    },
    queryData() {
      this.list = []
      const date = this.currentDate.replace(/\./g, '-')
      queryDayCountDetail({
        date,
        type: this.tabTypeList[this.tabActive],
        courseManagementId: this.courseManagementId
      }).then(res => {
        // console.log(res.data)
        this.list = res.data.data
      })
    },
    tabChange(index) {
      this.tabActive = index
      this.queryData()
    },
    // 园区切换
    confirmGrade(val, type) {
      this.courseManagementId = val.value
      if (type === 'load') return
      this.queryData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy-MM-dd')) return
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      this.queryData()
    },
    // 前往详情页
    toDetail(id) {
      this.$router.push({
        path: '/daycare_teach_attendanceDetail',
        query: {
          childId: id,
          date: this.currentDate.replace('.', '-').substr(0, 7)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  .header {
    height: 95px;

    .topFixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      width: 100%;
      height: 95px;
      background-color: $white;

      .selectBox {
        padding: 0 16px;
      }

      .tabBox {
        padding: 0 12px;
      }
    }
  }

  .container {
    .rightContent {
      display: flex;

      div {
        text-align: center;
      }

      p {
        line-height: 19px;

        &.time {
          font-size: 15px;
          color: $text-2;
        }

        &.label {
          font-size: 12px;
          color: $text-9;
          line-height: 38px;
          margin-right: 15px;
        }
      }
    }

    .noData {
      padding-top: 100px;
      height: calc(100vh - 145px);
      background-color: $white;
    }
  }
}
</style>
