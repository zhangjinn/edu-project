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
              <popup :title="currentDate" type="date" size="normal" @select="confirmDate" />
            </van-col>
          </van-row>
        </div>
        <div class="tabBox">
          <div class="textLeft van-hairline--bottom">
            <tabs :tab-list="tabList" :tab-active="tabActive" @change="tabChange" />
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="tabActive === 0">
        <template v-for="(item,index) in enterList">
          <universal-card
            :key="index"
            :index="item.childId"
            :icon="item.avatar"
            :name="item.childName"
            @click.native="toDetail(item.childId)"
          >
            <div class="rightContent">
              <div>
                <p class="time" :class="!item.enterTime ? 'labelColor' : ''">
                  {{ getTime(item.enterTime) }}
                </p>
                <p class="label">到园时间</p>
              </div>
              <div>
                <p class="time" :class="!item.leaveTime ? 'labelColor' : ''">
                  {{ getTime(item.leaveTime) }}
                </p>
                <p class="label">离园时间</p>
              </div>
            </div>
          </universal-card>
        </template>
        <div v-if="!enterList.length" class="noData">
          <no-content message="已到园列表为空~" />
        </div>
      </div>
      <div v-if="tabActive === 1">
        <template v-for="(item,index) in notEnterList">
          <universal-card
            :key="index"
            :index="item.childId"
            :icon="item.avatar"
            :name="item.childName"
            @click.native="toDetail(item.childId)"
          />
        </template>
        <div v-if="!notEnterList.length" class="noData">
          <no-content message="未到园列表为空~" />
        </div>
      </div>
      <div v-if="tabActive === 2">
        <template v-for="(item,index) in leaveList">
          <universal-card
            :key="index"
            :index="item.childId"
            :icon="item.avatar"
            :name="item.childName"
            @click.native="toDetail(item.childId)"
          >
            <div class="rightContent">
              <span class="labelColor">{{ item.leaveType === 'LEAVE' ? '事假' : '病假' }}</span>
            </div>
          </universal-card>
        </template>
        <div v-if="!leaveList.length" class="noData">
          <no-content message="请假列表为空~" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '../../../../components/common/tabs'
import popup from '../../components/popup'
import dropdown from '../../components/dropdown'
import noContent from '../../../../components/common/noContent'
import { DateFormat } from '../../../../js/rules'
import { getDayStatistics } from '../../../../service/guardcare/attendance'
import UniversalCard from '@/components/common/universalCard'

export default {
  name: 'Day',
  components: {
    UniversalCard,
    tabs,
    popup,
    dropdown,
    noContent
  },
  data() {
    return {
      tabActive: 0,
      tabList: ['已到园', '未到园', '已请假'],
      gradeId: null,
      clazzId: null,
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
    const type = this.$store.state.guardcare.tabActiveType
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
    if (this.$route.query.grade) {
      this.gradeId = parseInt(this.$route.query.grade)
    }
    if (this.$route.query.clazz) {
      this.clazzId = parseInt(this.$route.query.clazz)
    }
  },
  methods: {
    getData() {
      this.getArrivalData()
      this.getNotArrivalData()
      this.getLeaveData()
    },
    // 获取已到园会员列表
    getArrivalData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        statisticsType: 'ARRIVED',
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
      getDayStatistics(param).then(res => {
        this.enterList = res.data.data
      })
    },
    getTime(time) {
      if (!time) return '--'
      return DateFormat(time, 'hh:mm')
    },
    // 获取未到园会员列表
    getNotArrivalData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        statisticsType: 'NOT_ARRIVED',
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
      getDayStatistics(param).then(res => {
        this.notEnterList = res.data.data
      })
    },
    // 获取已请假会员列表
    getLeaveData() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        statisticsType: 'REQUEST_FOR_LEAVE',
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
      getDayStatistics(param).then(res => {
        this.leaveList = res.data.data
      })
    },
    tabChange(index) {
      this.tabActive = index
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
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy.MM.dd')) return
      this.currentDate = DateFormat(date, 'yyyy.MM.dd')
      this.getData()
    },
    // 前往详情页
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

        &:first-child {
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

        &.time {
          font-size: 15px;
          color: $text-2;
        }

        &.label {
          font-size: 12px;
          color: $text-9;
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
