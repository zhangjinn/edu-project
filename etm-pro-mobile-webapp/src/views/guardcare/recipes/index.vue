<template>
  <div class="recipes">
    <setting-title no-setting>
      <van-dropdown-menu>
        <van-dropdown-item v-model="semester" :options="semesterList" />
      </van-dropdown-menu>
    </setting-title>
    <fil
      ref="filter"
      :time="selectedDateObj.time"
      @change="filterChange"
      @prevWeek="() => this.$refs.calendar.prevWeek()"
      @nextWeek="() => this.$refs.calendar.nextWeek()"
    />
    <calendar
      ref="calendar"
      :list="weekList"
      :mark-date="markDate"
      week-start="monday"
      @dateChange="v => selectedDateObj = v"
    />
    <div class="timeline">
      <no-content v-show="!timeLineList.length" type="list" message="暂无数据" />
      <ul v-if="timeLineList.length">
        <li
          v-for="(item, index) in timeLineList"
          :key="index"
          :style="{
            backgroundColor: item.signatureCode === -1 ? customizeStyle.bgColor : recipeStyle[item.signatureCode].bgColor,
            borderColor: item.signatureCode === -1 ? customizeStyle.borderColor : recipeStyle[item.signatureCode].borderColor,
            backgroundImage: item.signatureCode === -1 ? 'url('+customizeStyle.bgImg+')' : 'url('+recipeStyle[item.signatureCode].bgImg+')'
          }"
        >
          <div class="recipesIcon">
            <img :src="item.signatureCode === -1 ? customizeStyle.icon : recipeStyle[item.signatureCode].icon" alt="">
          </div>
          <div class="recipesDetail">
            <div class="recipesContent">{{ item.content }}</div>
            <div
              class="recipesName"
              :style="{
                color: item.signatureCode === -1 ? customizeStyle.tagColor : recipeStyle[item.signatureCode].tagColor,
                backgroundColor: item.signatureCode === -1 ? customizeStyle.tagBgColor : recipeStyle[item.signatureCode].tagBgColor
              }"
            >
              {{ item.time }}
            </div>
          </div>
        </li>
      </ul>
      <!--      <van-steps direction="vertical" :active="-1">-->
      <!--        <van-step v-for="(item, index) in timeLineList" :key="index">-->
      <!--          <i slot="inactive-icon" class="iconfont iconyouershipu" />-->
      <!--          <h3>{{ item.time }}</h3>-->
      <!--          <p>{{ item.content }}</p>-->
      <!--        </van-step>-->
      <!--      </van-steps>-->
    </div>
  </div>
</template>
<script>
import settingTitle from '../comment/components/settingTitle'
import fil from './components/filter'
import calendar from '../plan/components/calendar'
import noContent from '../../../components/common/noContent'
import {
  querySemesterList,
  querySemesterWeekList
} from '../../../service/guardcare/comment'
import {
  queryWeekRecipes
} from '../../../service/guardcare/recipes'
import transferDate from '../../../js/date'
const weekDayArr = ['mon', 'tues', 'wed', 'thur', 'fri', 'sat', 'sun']
export default {
  components: {
    settingTitle,
    fil,
    calendar,
    noContent
  },
  data() {
    return {
      semester: undefined,
      gradeId: undefined,
      weekId: undefined,
      weekPlanList: [],
      semesterList: [],
      weekList: [],
      markDate: [
        { color: '#10C2C4', type: 'dot', date: ['2020/9/29'] }
      ],
      selectedDateObj: {},
      timeLineList: [],
      customizeStyle: {
        bgColor: '#FFF4F3',
        borderColor: '#FFDBD8',
        tagColor: '#FF7C70',
        tagBgColor: '#FFE8E6',
        icon: require('@/assets/images/guardcare/recipes/customizeIcon.png'),
        bgImg: require('@/assets/images/guardcare/recipes/customize.png')
      },
      recipeStyle: [
        {
          bgColor: '#FFF8F0',
          borderColor: '#FFECD3',
          tagColor: '#FFAA3B',
          tagBgColor: '#FFF1DF',
          icon: require('@/assets/images/guardcare/recipes/breakfastIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/breakfast.png')
        },
        {
          bgColor: '#FFF0F0',
          borderColor: '#FFE1E1',
          tagColor: '#FF8585',
          tagBgColor: '#FFE1E1',
          icon: require('@/assets/images/guardcare/recipes/earlyIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/early.png')
        },
        {
          bgColor: '#F9F3FF',
          borderColor: '#F7E1FF',
          tagColor: '#AE6CFF',
          tagBgColor: '#F3E7FF',
          icon: require('@/assets/images/guardcare/recipes/lunchIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/lunch.png')
        },
        {
          bgColor: '#F3F9FF',
          borderColor: '#E5EFFF',
          tagColor: '#5F9FFF',
          tagBgColor: '#E7F3FF',
          icon: require('@/assets/images/guardcare/recipes/noonIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/noon.png')
        },
        {
          bgColor: '#FFF3FD',
          borderColor: '#FFE7FB',
          tagColor: '#F770E1',
          tagBgColor: '#FFE7FB',
          icon: require('@/assets/images/guardcare/recipes/afternoonTeaIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/afternoonTea.png')
        },
        {
          bgColor: '#EBFDFF',
          borderColor: '#CEF0F0',
          tagColor: '#20D7D7',
          tagBgColor: '#D5F9F9',
          icon: require('@/assets/images/guardcare/recipes/foodSupplementIcon.png'),
          bgImg: require('@/assets/images/guardcare/recipes/foodSupplement.png')
        }
      ]
    }
  },
  watch: {
    semester: {
      handler(v) {
        if (v === undefined) return
        querySemesterWeekList({ courseTermId: v }).then(res => {
          this.weekList = res.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      immediate: true
    },
    selectedDateObj: {
      handler(v) {
        this.getWeekRecipes()
        this.showTodayRecipes()
      },
      deep: true
    },
    gradeId() {
      this.getWeekRecipes(true)
    }
  },
  created() {
    this.getSemesterList()
  },
  methods: {
    getWeekRecipes(force) {
      if (this.semester && this.gradeId && this.selectedDateObj.obj && this.selectedDateObj.obj.id) {
        if (this.weekId === this.selectedDateObj.obj.id && !force) {
          return false
        } else {
          queryWeekRecipes({
            courseTermId: this.semester,
            gradeId: this.gradeId,
            weekId: this.selectedDateObj.obj.id
          }).then(res => {
            this.handleWeekRecipes(res.data.data)
            this.weekId = this.selectedDateObj.obj.id
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    handleWeekRecipes(src) {
      if (Array.isArray(src) && src.length) {
        this.weekPlanList = []
        src.forEach(v => {
          weekDayArr.forEach((day, index) => {
            if (!this.weekPlanList[index]) this.weekPlanList[index] = {}
            if (Array.isArray(v.data[day]) && v.data[day].length) {
              this.weekPlanList[index].hasData = true // 标识这一天有数据
              if (!this.weekPlanList[index].data) this.weekPlanList[index].data = []
              this.weekPlanList[index].data.push({
                time: v.label.name,
                signatureCode: v.label.signatureCode,
                content: v.data[day]
              })
            }
          })
        })

        // 展示这一周哪些天有计划
        const weekStartDate = new Date(this.selectedDateObj.obj.startDate) // 这一周的第一天的日期对象
        const bias = weekStartDate.getDay() - 1 < 0 ? 6 : weekStartDate.getDay() - 1 // 这一周的第一天与这一周的周一直接相差几天
        const weekMonDateTime = new Date(weekStartDate.getTime() - bias * 24 * 60 * 60 * 1000).getTime() // 得到这一周周一的时间戳
        const date = []
        this.weekPlanList.forEach((v, i) => {
          if (v.hasData) {
            date.push(transferDate(weekMonDateTime + i * 24 * 60 * 60 * 1000).time)
          }
        })
        this.markDate = [
          { color: '#10C2C4', type: 'dot', date }
        ]
        this.showTodayRecipes()
      }
    },
    showTodayRecipes() { // 展示选中这一天的计划表
      const index = this.selectedDateObj.time.getDay() - 1 < 0 ? 6 : this.selectedDateObj.time.getDay() - 1
      this.timeLineList = []
      if (this.weekPlanList[index] && this.weekPlanList[index].hasData) {
        this.weekPlanList[index].data.forEach(v => {
          this.timeLineList.push({
            time: v.time,
            signatureCode: v.signatureCode,
            content: this.joinAttr(v.content)
          })
        })
      }
    },
    joinAttr(arr) {
      let result = ''
      arr.forEach(v => {
        result += v.foodName + (v.description ? `(${v.description})` : '') + '、'
      })
      return result.slice(0, -1)
    },
    getSemesterList() { // 获取学期列表
      querySemesterList().then(res => {
        this.semesterList = []
        Array.isArray(res.data.data) && res.data.data.forEach(v => {
          this.semesterList.push({
            text: v.name,
            value: v.id
          })
        })
        this.semester = res.data.data[0].id || 0
      }).catch(err => {
        console.log(err)
      })
    },
    filterChange() {
      this.gradeId = this.$refs.filter.gradeId
    }
  }
}
</script>

<style scoped lang="scss">
.recipes {
  ::v-deep .van-dropdown-menu {
    background-color: transparent;
    .van-ellipsis, .van-dropdown-menu__title::after {
      color: $white;
      font-size: 14px;
    }
  }
  .calendar {
    /deep/ .calendar_title {
          display: none;
      }

      /deep/ .calendar_body {
          margin-top: 0;

          .calendar_item {
              width: 14.28%;
            .calendar_dot{
              margin-top: -2px;
              margin-bottom: 8px;
            }
          }
      }

      /deep/ .calendar_first_today {
          color: $theme;
      }

      /deep/ .calendar_day_checked {
          @include linearBg();

          &.calendar_first_today {
            color: $white;
          }
      }
      /deep/ .calendar_item_disable{
        background-color: $white;
      }
      /deep/ .calendar_mark_circle{
        color: #c0c4cc;
        border:none;
      }
      /deep/ .calendar_day_checked{
        color: $white;
      }
      /deep/.calendar_group{
        top: 9vw;
      }

  }
  .timeline {
    height: calc(100vh - 188px);
    overflow-y: auto;
    //margin-top: 13px;
    padding: 12px;
    ul{
      background-color: $white;
      padding: 17px 15px;
      border-radius: 6px;
      li{
        display: flex;
        border: 1px solid #FFECD3;
        border-radius: 6px;
        padding: 20px 17px;
        background-repeat: no-repeat;
        background-size: 45px 45px;
        background-position: right bottom;
        & + li{
          margin-top: 12px;
        }
        .recipesIcon{
          width: 44px;
          height: 44px;
          margin-right: 16px;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .recipesDetail{
          flex: 1;
          text-align: left;
          .recipesContent{
            margin-bottom: 15px;
          }
          .recipesName{
            display: inline-block;
            padding: 5px 9px;
            border-radius: 12px;
            font-size: 13px;
          }
        }

      }
    }
    ::v-deep .van-steps {
      background-color: transparent;
      &.van-steps--vertical {
        padding: 0 0 0 50px;
      }
      .van-step--vertical:first-child::before {
        display: none;
      }
      .van-step--vertical:last-child .van-step__line{
        display: none;
      }
      .van-step--vertical .van-step__circle-container {
        top: 40px;
        left: -25px;
      }
      .van-step--vertical .van-step__line {
        width: 0;
        height: 90%;
        top: 40px;
        left: -25px;
        border-right: 1px dashed $theme;
      }
      .van-step {
        padding: 8px 24px 8px 0;
      }
      .van-step__title {
        // height: 67px;
        background-color: $white;
        border-radius: 4px;
        padding: 12px;
        text-align: left;
        h3 {
          color: $black;
          font-size: 16px;
          font-weight: 500;
        }
        p {
          margin-top: 8px;
          color: $text-9;
          font-size: 12px;
        }
      }
      .van-step__line {

      }
    }
    .iconfont {
      color: $theme;
    }
  }
}
</style>
