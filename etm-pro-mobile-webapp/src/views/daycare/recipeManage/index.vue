<template>
  <div class="index-wrap">
    <setting-title>
      <van-dropdown-menu>
        <van-dropdown-item v-model="courseId" :options="options" @change="handleCourseManagementChange" />
      </van-dropdown-menu>
    </setting-title>

    <div class="canlendarTool">
      <div @click="showPicker = true">
        {{ currentDate | filter }}
        <van-icon name="arrow-down" />
      </div>
      <div class="canlendarChangeTools">
        <div class="prev" @click="changeWeekly(-1)">
          <van-icon name="arrow-left" />
          上一周
        </div>
        <div class="current" @click="changeWeekly(0)">本周</div>
        <div class="next" @click="changeWeekly(1)">下一周
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <div class="calendar">
      <vue-hash-calendar
        ref="calendar"
        :visible.sync="isShowCalendar"
        :is-show-week-view="true"
        :disabled-week-view="false"
        :default-datetime="defaultDate"
        :mark-date="markDate"
        :disabled-scroll="true"
        week-start="monday"
        @click="calendarClick"
      >
        <template v-slot:day="row">
          <div v-if="row.extendAttr.isToday">今</div>
          <div v-else>{{ row.date.day }}</div>
        </template>
      </vue-hash-calendar>
    </div>

    <no-content v-if="!list.length" message="今天没有食谱内容哦" type="none" />
    <div v-else class="content">
      <div class="schedule-item">
        <card
          v-for="(item, index) in list"
          :key="index"
          class="card"
          :style="{
            'background-image': 'url('+ getStyle(item.timeQuantumName).backgroundImage +')',
            'background-color': getStyle(item.timeQuantumName).backgroundColor,
            'border-color': getStyle(item.timeQuantumName).borderColor
          }"
        >
          <template #thumb>
            <div class="content-thumb">
              <div class="icon-bg">
                <i class="iconfont-bg" />
                <!--<i class="iconfont" :class="item.icon" :style="{ 'background-image': getStyle(item.timeQuantumName).iconfontBackgroundImage }" />-->
                <i class="iconfont" :class="item.icon" />
              </div>
            </div>
          </template>
          <template #title>
            <div class="content-title content-margin">{{ item.foodName }}</div>
          </template>
          <template #tags>
            <div class="content-margin">
              <van-tag
                class="tag"
                plain
                type="danger"
                :style="{
                  'color': getStyle(item.timeQuantumName).tagColor,
                  'background-color': getStyle(item.timeQuantumName).tagBackgroundColor
                }"
              >{{ item.timeQuantumName }}</van-tag>
            </div>
          </template>
        </card>
      </div>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title=""
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="datetimeConfirm"
        @cancel="datetimeCancel"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * index create by shanglu
 * createTime 2020/11/4 15:00
 */
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import noContent from '@/components/common/noContent'
import { queryDayRecipe, queryWeekCourseSummary, queryWeekRecipeMark } from '@/service/daycare/recipesManage'
import { DateFormat } from '@/js/rules'
import { Card } from 'vant'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
export default {
  name: 'Index',
  filters: {
    filter(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    }
  },
  components: {
    settingTitle,
    Card,
    noContent
  },
  data() {
    return {
      // currentMonthDay: new Date(),
      list: [],
      // 一周选择
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 日历
      isShowCalendar: true,
      markDate: [
        {
          color: '#10C2C4',
          date: []
        }
      ],
      defaultDate: new Date(),
      // 头部
      courseId: '',
      options: [],
      styleObject: {
        '早餐': {
          backgroundColor: '#FFF8F0',
          borderColor: '#FFECD3',
          // color: '#FFAA3B',
          tagBackgroundColor: '#FFF1DF',
          tagColor: '#FFAA3B',
          backgroundImage: require('@/assets/images/daycare/breakfast.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #FFA22A, #FFCC8A)'
        },
        '早点': {
          backgroundColor: '#FFF0F0',
          borderColor: '#FFE1E1',
          // color: '',
          tagBackgroundColor: '#FFE1E1',
          tagColor: '#FF8585',
          backgroundImage: require('@/assets/images/daycare/breakfast2.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg,  #FF8484, #FFD3D3)'
        },
        '午餐': {
          backgroundColor: '#F9F3FF',
          borderColor: '#F7E1FF',
          tagBackgroundColor: '#F3E7FF',
          tagColor: '#AE6CFF',
          backgroundImage: require('@/assets/images/daycare/lunch.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #DB7BFF, #F0C7FF)'
        },
        '午点': {
          backgroundColor: '#F3F9FF',
          borderColor: '#E5EFFF',
          tagBackgroundColor: '#E7F3FF',
          tagColor: '#5F9FFF',
          backgroundImage: require('@/assets/images/daycare/lunch2.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #5096FF, #B0D0FF)'
        },
        '下午茶': {
          backgroundColor: '#FFF3FD',
          borderColor: '#FFE7FB',
          tagBackgroundColor: '#FFE7FB',
          tagColor: '#F770E1',
          backgroundImage: require('@/assets/images/daycare/afternoonTea.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #F67BE2, #FFC2F5)'
        },
        '辅食餐': {
          backgroundColor: '#EBFDFF',
          borderColor: '#CEF0F0',
          tagBackgroundColor: '#D5F9F9',
          tagColor: '#20D7D7',
          backgroundImage: require('@/assets/images/daycare/foodSupplementMeal.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #55E3E3, #99FFFF)'
        },
        '水果餐': {
          backgroundColor: '#F3F3FF',
          borderColor: '#DCDCFC',
          tagBackgroundColor: '#E6E6FF',
          tagColor: '#9292FF',
          backgroundImage: require('@/assets/images/daycare/fruitMeal.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #9292FF, #E4E4FD)'
        },
        '自定义': {
          backgroundColor: '#FFF4F3',
          borderColor: '#FFDBD8',
          tagBackgroundColor: '#FFE8E6',
          tagColor: '#FF7C70',
          backgroundImage: require('@/assets/images/daycare/customize.png'),
          iconfontBackgroundImage: '-webkit-linear-gradient(-38deg, #FF6D60, #FFD3CF)'
        }
      }
    }
  },
  watch: {
    // currentMonthDay: {
    //   handler(n) {
    //     // this.getMonthDate()
    //     if (n) this.getCourseSummer()
    //   }
    // }
    // courseId: {
    //   immediate: true,
    //   handler(v) {
    //     if (v) this.getWeekRecipes()
    //   }
    // }
  },
  created() {
    this.getCourseSummer()
  },
  methods: {
    // changeDate(event) {
    //   console.log(event, this.defaultDate)
    //   if (event.getMonth() !== this.defaultDate.getMonth()) {
    //     this.defaultDate = event
    //     this.$nextTick(() => {
    //       this.getMonthDate()
    //     })
    //   }
    // },
    getCourseSummer() {
      const { startDate } = this.getDateWeek(this.defaultDate)
      queryWeekCourseSummary({ date: startDate }).then(res => {
        if (!res.data.data || !res.data.data.length) {
          this.options = [{
            text: '无上课班级',
            value: ''
          }]
          this.courseId = ''
        } else {
          this.options = res.data.data.map((cur, index) => {
            if (index === 0) {
              this.courseId = cur.courseId
            }
            return {
              text: cur.courseName + '/' + cur.clazzName,
              value: cur.courseId
            }
          })
        }
        this.getWeekRecipes()
        this.getWeekRecipeMark()
      })
    },
    getWeekRecipes() {
      if (!this.courseId) {
        this.list = []
        return
      }
      const { weekName, startDate, endDate } = this.getDateWeek(this.defaultDate)
      queryDayRecipe({
        date: DateFormat(this.defaultDate, 'yyyy-MM-dd'),
        courseId: this.courseId,
        weekName,
        startDate,
        endDate
      }).then(res => {
        // console.log('DayRecipe', res.data.data)
        // this.list = [{ timeQuantumName: '下午茶', foodName: '下午茶、下午茶、下午茶、下午茶、下午茶、下午茶、下午茶、下午茶、下午茶、下午茶', icon: 'iconfushican' }]
        this.list = res.data.data
      })
    },
    getWeekRecipeMark() {
      if (!this.courseId) {
        this.markDate[0]['date'] = []
        return
      }
      const { weekName, startDate, endDate } = this.getDateWeek(this.defaultDate)
      queryWeekRecipeMark({
        date: DateFormat(this.defaultDate, 'yyyy-MM-dd'),
        courseId: this.courseId,
        weekName,
        startDate,
        endDate
      }).then(res => {
        const data = []
        res.data.data.forEach(v => {
          if (v.status) data.push(v.date)
        })
        this.markDate[0]['date'] = data
      })
    },
    datetimeConfirm(event) {
      this.showPicker = false
      this.defaultDate = event
      this.getCourseSummer()
    },
    datetimeCancel() {
      this.showPicker = false
    },
    handleCourseManagementChange(v) {
      // console.log('course', v)
      this.getWeekRecipes()
    },
    // 选择日期
    calendarClick(event) {
      this.defaultDate = event

      this.$nextTick(() => {
        this.getWeekRecipes()
      })
    },
    // 更改week
    changeWeekly(step) {
      const currentDay = this.defaultDate.getTime()
      const aWeeklay = 24 * 3600 * 1000 * 7
      let newDate = 0
      if (step) {
        newDate = new Date(currentDay + step * aWeeklay)
      } else {
        newDate = new Date()
      }

      this.defaultDate = newDate
      this.currentDate = newDate

      this.$nextTick(() => {
        // this.getWeekRecipes()
        // this.getWeekRecipeMark()
        this.getCourseSummer()
      })
    },
    getDateWeek(val) {
      if (!val) return
      const date = new Date(val)
      dayjs.extend(isoWeek)
      const week = dayjs(date).isoWeek()
      const startDate = dayjs(date).isoWeekday(1).format('YYYY-MM-DD') // 周一日期
      const endDate = dayjs(date).isoWeekday(7).format('YYYY-MM-DD')
      // console.log('day', week, startDate, endDate)
      return {
        weekName: startDate + '至' + endDate + ' ' + week + '周',
        startDate,
        endDate
      }
    },
    getStyle(recipesName) {
      if (this.styleObject[recipesName]) return this.styleObject[recipesName]
      else return this.styleObject['自定义']
    }
  }
}
</script>
<style lang="scss" scoped>
$iconClass:(
    'name': 'iconzaocan',
    'backgroundImage':'linear-gradient(-38deg, #FFA22A, #FFCC8A)'
),(
    'name': 'iconzaodian',
    'backgroundImage':'linear-gradient(-38deg,  #FF8484, #FFD3D3)'
),(
    'name': 'iconwucan',
    'backgroundImage':'linear-gradient(-38deg, #DB7BFF, #F0C7FF)'
),(
    'name': 'iconwudian',
    'backgroundImage':'linear-gradient(-38deg, #5096FF, #B0D0FF)'
),(
    'name': 'iconxiawucha',
    'backgroundImage':'linear-gradient(-38deg, #F67BE2, #FFC2F5)'
),(
    'name': 'iconfushican',
    'backgroundImage':'linear-gradient(-38deg, #55E3E3, #99FFFF)'
),(
    'name': 'iconshuiguocan',
    'backgroundImage':'linear-gradient(-38deg, #9292FF, #E4E4FD)'
),(
    'name': 'iconzidingyi',
    'backgroundImage':'linear-gradient(-38deg, #FF6D60, #FFD3CF)'
);
.index-wrap {

  .schedule-item {
    margin: 10px 10px;
    background: #FFFFFF;
    padding: 10px 0;
    .card{
      //background-color: #FFECD3;
      //background-image: url("../../../assets/images/daycare/lunch.png");
      background-repeat: no-repeat;
      background-position: right bottom;
      background-size: 45px 45px;
      border: 1px transparent solid;
      padding:0;
      margin: 10px 15px;
      border-radius: 12px;
    }
    .content-margin{
      margin: 10px 0;
      text-align: left;
      .tag{
        border-radius: 23px;
        &:after{
          border-color: transparent;
        }
      }
    }
    .content-thumb{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-bg{
        //width: auto;
        //height: auto;
        //background: #fff;
        //border-radius: 50% 50%;
        position: relative;
      }
      .iconfont-bg{
        width: 80%;
        height: 80%;
        background: #fff;
        position: absolute;
        border-radius: 50% 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .iconfont{
        font-size: 50px;
        border-radius: 50% 50%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: block;
        position: relative;
      }
      @each $c in $iconClass{
        .#{map-get($c, name)} {
          background-image: '-ms-'#{map-get($c, backgroundImage)};
          background-image: '-o-'#{map-get($c, backgroundImage)};
          background-image: '-webkit-'#{map-get($c, backgroundImage)};
          background-image: '-moz-'#{map-get($c, backgroundImage)};
          background-image: #{map-get($c, backgroundImage)};
        }
      }
    }
    .content-title{
      font-size: 20px;
      font-weight: 500;
      color: #222222;
    }
    /deep/ .van-card .van-card__content {
      justify-content: center;
      align-items: start;
    }
  }

  .canlendarTool {
    height: 61px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 13px;
    border-bottom: 1px solid #eee;

    .canlendarChangeTools {
      font-size: 12px;
      color: #999;
      align-items: center;
      display: flex;

      i {
        display: inline-block;
        vertical-align: middle;
      }

      .current {
        font-size: 16px;
        margin: 0 16px;
        color: #222;
      }

    }
  }

  ::v-deep {

    .settingTitle {
      .van-dropdown-menu.van-hairline--top-bottom {
        height: 100%;
        background: transparent;

        .van-ellipsis {
          color: #fff;
        }

        .van-dropdown-menu__title {
          &:after {
            border-color: transparent transparent #fff #fff
          }
        }
      }
    }
  }

  .calendar {
    padding-bottom: 8px;

    /deep/ .calendar_inline {
      height: 80px !important;

      .calendar_content {
        padding-bottom: 15px;
        height: 80px !important;

        .calendar_title {
          display: none;
        }

        .calendar_body {
          margin-top: 0;

          .calendar_item {
            width: 14.28%;
          }
        }
      }
    }

    /deep/ .calendar_first_today {
      color: $theme;
    }

    /deep/ .calendar_day_checked {
      background-color: $theme;

      &.calendar_first_today {
        color: $white;
      }
    }

    /deep/ .calendar_day {
      margin-bottom: 2px;
    }

    /deep/ .calendar_dot {
      margin-bottom: 2px;
      @include wh(4px, 4px);
    }

    /deep/ .calendar_mark_circle {
      color: $text-9;
      border: none;

      &.calendar_day_checked {
        color: $white;
      }
    }
  }
}
</style>
