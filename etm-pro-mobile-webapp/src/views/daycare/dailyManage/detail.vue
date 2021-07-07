<template>
  <div class="index-wrap">
    <setting-title>
      <div class="canlendarChangeTools">
        <div class="prev" @click="changeWeekly(-1)">
          <van-icon name="arrow-left" />
          上一{{ weekMonth ? '周' : '月' }}
        </div>
        <div v-if="weekMonth" class="current" @click="changeWeekly(0)">本周</div>
        <div v-else class="current">{{ Mon }}</div>
        <div class="next" @click="changeWeekly(1)">下一{{ weekMonth ? '周' : '月' }}
          <van-icon name="arrow" />
        </div>
      </div>
    </setting-title>
    <div class="top" />
    <div :class="['calendar', weekMonth ? 'minHeight' : '']">
      <template v-if="weekMonth">
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          week-start="monday"
          :is-show-week-view="true"
          :disabled-week-view="false"
          :default-datetime="defaultDate"
          :mark-date="markDate"
          :disabled-scroll="true"
          @change="changeDate"
          @click="calendarClick"
        >
          <template v-slot:day="row">
            <div v-if="row.extendAttr.isToday">今</div>
            <div v-else>{{ row.date.day }}</div>
          </template>
        </vue-hash-calendar>
      </template>

      <template v-else>
        <vue-hash-calendar
          ref="calendar"
          :visible.sync="isShowCalendar"
          :is-show-week-view="false"
          week-start="monday"
          :default-datetime="defaultDate"
          :mark-date="markDate"
          :disabled-scroll="true"
          @change="changeDate"
          @click="calendarClick"
        >
          <template v-slot:day="row">
            <div v-if="row.extendAttr.isToday">今</div>
            <div v-else>{{ row.date.day }}</div>
          </template>
        </vue-hash-calendar>
      </template>

      <div class="calendar-btn" @click="weekMonth = !weekMonth">
        <van-icon name="arrow-down" />
      </div>
    </div>
    <no-content v-if="!dateList.length" message="今天没在园日记内容哦~" type="none" />
    <div v-else class="dilList">
      <div v-for="(item, index) in dateList" :key="index" class="contList">
        <div class="cont">
          <div class="heard">
            <div class="left">
              <img :src="heardIcon[item.type]">
              <span>{{ item.diarySettingName }}</span>
            </div>
            <div class="right" @click.stop="toDetail(item)">
              <span>{{ item.showTime }}</span>
              <i class="iconfont iconright1" />
            </div>
          </div>
          <div class="unDo">
            <div v-if="item.type==='EMOTIONS'&&item.contentObject.emotion" class="EMOTIONS">
              <img :src="contEmotion.src[item.contentObject.emotion]"><span>{{
                contEmotion.emotion[item.contentObject.emotion]
              }}</span>
            </div>
            <div v-if="item.type==='CHANGE_DIAPER'" class="CHANGE_DIAPER">
              <div v-for="(v, i) in item.contentObject.list" :key="i">
                <span>
                  {{ diaper.changeDiaperType[v] }}
                </span>
                <span v-if="item.contentObject.poopShape&&v==='POOP'">
                  {{ diaper.poopShape[item.contentObject.poopShape] }}
                </span>
                <span v-if="item.contentObject.peeColor&&v==='PEE'">
                  {{ diaper.peeColor[item.contentObject.peeColor] }}
                </span>
                <div
                  v-if="item.contentObject.peeColor&&v==='PEE'"
                  class="divRa"
                  :class="item.contentObject.peeColor==='MILKY_WHITE'?'divBorder':''"
                  :style="{backgroundColor:diaper.peeDiv[item.contentObject.peeColor]}"
                />
                <span v-if="item.contentObject.poopColorEnum&&v==='POOP'">
                  {{ diaper.peeColor[item.contentObject.poopColorEnum] }}
                </span>
                <div
                  v-if="item.contentObject.poopColorEnum&&v==='POOP'"
                  class="divRa"
                  :style="{backgroundColor:diaper.peeDiv[item.contentObject.poopColorEnum]}"
                />
              </div>
            </div>
            <div v-if="item.type==='FEED_MILK'||item.type==='DRINK_WATER'">
              <span>{{ item.contentObject.capacity }}ml</span>
            </div>
            <div v-if="item.type==='EAT'" class="eat">
              <span v-if="item.contentObject.timeQuantumName">{{
                item.contentObject.timeQuantumName + ' (' + item.contentObject.foodName + ')'
              }}</span>
              <div>
                <img :src="eat.src[item.contentObject.feel]"><span>{{
                  eat.feel[item.contentObject.feel]
                }}</span></div>
            </div>
            <div v-if="item.type==='SLEEP'" class="SLEEP">
              <div><span>开始睡眠 {{ item.showTime }}</span></div>
              <div v-if="item.endTime"><span>结束睡眠 {{ item.showEndTime }}</span></div>
              <div v-if="item.endTime"><span>总计用时 {{ item.sleepTime }} </span><span>{{
                sleep[item.contentObject.sleepType]
              }}</span></div>
            </div>
            <div v-if="item.description" class="description">{{ item.description }}</div>
            <div v-if="item.imageList.length" class="imageList">
              <van-uploader
                v-model="item.imageList"
                :show-upload="false"
                :deletable="false"
                multiple
                upload-icon="plus"
              />
            </div>
          </div>
        </div>
        <div class="line" />
      </div>
    </div>
    <div v-if="showAdd" class="footBtn" @click.stop="submitComment">
      <div>新增记录</div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
      <van-picker
        title="请选择要新增的记录"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="show=false"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/10/19 18:18
 */
import settingTitle from '@/views/daycare/courseTimeManage/components/settingTitle'
import noContent from '@/components/common/noContent'
import { differ } from '@/views/daycare/courseTimeManage/utils'
import { DateFormat } from '@/js/rules'
import { queryOverview, queryDiary, querySetting } from '@/service/daycare/dailyManage'
import transferDate from '@/js/date'

export default {
  name: 'Index',
  components: {
    settingTitle,
    noContent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      // currMonthDate : [],
      columns: [],
      show: false,
      dateList: [],
      // 一周选择
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 日历
      isShowCalendar: true,
      weekMonth: false,
      showAdd: true,
      markDate: [
        {
          color: '#10C2C4',
          date: []
        },
        {
          color: '#999999',
          date: []
        }
      ],
      defaultDate: new Date(),
      Mon: '本月',
      childId: this.$route.query.childId,
      heardIcon: {
        'ATTEND': require('../../../assets/images/daycare/dailyInschool.png'),
        'FEED_MILK': require('../../../assets/images/daycare/dailyMike.png'),
        'DRINK_WATER': require('../../../assets/images/daycare/dailyDrink.png'),
        'EAT': require('../../../assets/images/daycare/dailyEat.png'),
        'CHANGE_DIAPER': require('../../../assets/images/daycare/dailyCHANGE_DIAPER.png'),
        'EMOTIONS': require('../../../assets/images/daycare/dailyEMOTIONS.png'),
        'CUSTOMIZE': require('../../../assets/images/daycare/dailyCUSTOMIZE.png'),
        'SLEEP': require('../../../assets/images/daycare/dailySleep.png')
      },
      contEmotion: {
        emotion: {
          'SAD': '难过',
          'ANGRY': '生气',
          'NORMAL': '一般',
          'HAPPY': '开心',
          'EXCITED': '兴奋'
        },
        src: {
          'SAD': require('../../../assets/images/daycare/dailySad.png'),
          'ANGRY': require('../../../assets/images/daycare/dailyAngry.png'),
          'NORMAL': require('../../../assets/images/daycare/dailyE_Normal.png'),
          'HAPPY': require('../../../assets/images/daycare/dailyHappy.png'),
          'EXCITED': require('../../../assets/images/daycare/dailyExcited.png')
        }
      },
      diaper: {
        changeDiaperType: {
          'PEE': '嘘嘘',
          'POOP': '便便',
          'PEE_AND_POOP': '嘘嘘+便便',
          'DRY': '干爽'
        },
        peeColor: {
          'MILKY_WHITE': '乳白色',
          'RED': '红色',
          'NORMAL': '正常',
          'YELLOW': '黄色',
          'BROWN': '褐色',
          'OFF_WHITE': '灰白色',
          'GREEN': '绿色',
          'BLACK': '黑色'
        },
        poopShape: {
          'GRANULAR': '颗粒状',
          'DRY_HARD': '干硬',
          'NORMAL': '正常',
          'MUSHY': '糊状',
          'WATERY': '水状'
        },
        peeDiv: {
          'MILKY_WHITE': '#FFFFFF',
          'RED': '#EE8285',
          'NORMA': '#FCEEBE',
          'YELLOW': '#F4BA49',
          'BROWN': '#906845',
          'OFF_WHITE': '#D5D5D5',
          'GREEN': '#4E7323',
          'BLACK': '#474747',
          'NORMAL': '#FCEEBE'
        }
      },
      eat: {
        feel: {
          'HATE': '讨厌',
          'DONT_LIKE': '不太喜欢',
          'GENERAL': '一般',
          'LIKE': '喜欢',
          'LIKE_MUCH': '很喜欢'
        },
        src: {
          'HATE': require('../../../assets/images/daycare/dailyHate.png'),
          'DONT_LIKE': require('../../../assets/images/daycare/dailyDont_like.png'),
          'GENERAL': require('../../../assets/images/daycare/dailyGeneral.png'),
          'LIKE': require('../../../assets/images/daycare/dailyLike.png'),
          'LIKE_MUCH': require('../../../assets/images/daycare/dailylikemuch.png')
        }
      },
      sleep: {
        'NORMAL': '普通',
        'SMOOTH': '安稳 ',
        'NOT_SMOOTH': '不安稳',
        'NOT_SLEEP': '没睡'
      },
      settingList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDate(differ(0, new Date()).dateFormat)
    // console.log(differ(0, new Date()))
    queryOverview({ date: DateFormat(this.defaultDate, 'yyyy-MM-dd'), childId: this.childId }).then(res => {
      // console.log(res.data)
      this.markDate[0]['date'] = res.data.data.NORMAL || []
      this.markDate[1]['date'] = res.data.data.ABSENT_FROM_WORK || []
    })
  },
  mounted() {
    this.getSetting()
  },
  methods: {
    getDate(date) {
      this.showAdd = date === DateFormat(new Date(), 'yyyy-MM-dd')
      queryDiary({ date: date, childId: this.childId }).then(res => {
        this.dateList = res.data.data
        this.dateList.forEach(v => {
          v.showTime = DateFormat(v.startTime, 'hh:mm')
          v.showEndTime = DateFormat(v.endTime, 'hh:mm')
          // console.log(v.endTime)
          if (v.endTime) {
            const time = transferDate().gap(v.endTime - v.startTime)
            v.sleepTime = `${time.hours}:${time.miniutes}`
          }
        })
        // console.log(this.dateList)
      })
    },
    goTo(id, type) {
      this.$router.push({ path: '/daycare_courseTimeManage_detail', query: { id, type }})
    },
    changeDate() {
    },
    calendarClick(event) {
      const date = differ(0, event)
      // console.log(event.dateFormat)
      this.getDate(date.dateFormat)
    },

    // parseTime(date) {
    //   return `${date.getFullYear()}年${date.getMonth() + 1}月`
    // },
    changeWeekly(step) {
      let _date = null
      if (this.weekMonth) {
        // 周
        const currentDay = this.defaultDate.getTime()
        const aWeeklay = 24 * 3600 * 1000 * 7
        if (step) {
          _date = new Date(currentDay + step * aWeeklay)
        } else {
          _date = new Date()
        }
      } else {
        // 月
        const defaultDate = new Date(this.defaultDate.getTime())
        defaultDate.setDate(1)

        if (step) {
          const _resuslt = differ(step < 0 ? -1 : 32 * step, defaultDate)
          const _r = new Date(_resuslt.dateFormat)
          _r.setDate(1)
          _date = _r
          if (DateFormat(new Date(), 'yyyy-MM') === DateFormat(_date, 'yyyy-MM')) {
            this.Mon = '本月'
            _date = new Date()
          } else {
            this.Mon = DateFormat(_date, 'yyyy-MM')
          }
        } else {
          _date = new Date()
        }
      }

      // console.log(_date.getMonth(), this.defaultDate.getMonth())

      if (_date.getMonth() !== this.defaultDate.getMonth()) {
        queryOverview({ date: DateFormat(_date, 'yyyy-MM-dd'), childId: this.childId }).then(res => {
          // console.log(res.data)
          this.markDate[0]['date'] = res.data.data.NORMAL || []
          this.markDate[1]['date'] = res.data.data.ABSENT_FROM_WORK || []
        })
      }

      this.defaultDate = _date

      this.$nextTick(() => {
        this.getDate(DateFormat(this.defaultDate, 'yyyy-MM-dd'))
      })
    },
    submitComment() {
      this.show = true
    },
    getSetting() {
      querySetting().then(res => {
        // console.log(res.data.data)
        this.settingList = res.data.data
        res.data.data.forEach(v => {
          this.columns.push(v.diarySettingName)
        })
      })
    },
    onConfirm(value, index) {
      this.$router.push(`/daycare_dailyManageProject?name=${this.$route.query.name}&type=${this.settingList[index].type}&diarySettingId=${this.settingList[index].diarySettingId}&way=along&typeName=${value}&childId=${this.$route.query.childId}`)
      // console.log(this.settingList[index])
      this.show = false
    },
    toDetail(item) {
      if (item.type !== 'ATTEND') {
        this.$router.push(`/daycare_dailyManageProject?name=${this.$route.query.name}&type=${item.type}&diarySettingId=${item.caDiarySettingId}&way=update&typeName=${item.diarySettingName}&childId=${this.$route.query.childId}&diaryId=${item.diaryId}`)
      }
      // console.log(item)
      // const data = JSON.stringify(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

  .canlendarChangeTools {
    font-size: 12px;
    color: #999;
    align-items: center;
    display: flex;

    i {
      display: inline-block;
      vertical-align: middle;
      color: #999999;
    }

    .current {
      font-size: 16px;
      margin: 0 16px;
      color: #222;
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

  .top {
    height: 14px;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #EEEEEE;
  }

  .calendar {
    margin-bottom: 12px;
    border-radius: 6px;
    padding-bottom: 10px;
    overflow: hidden;
    position: relative;

    .calendar-btn {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 14px;
      background: #F5F5F5;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%, 22px) rotate(45deg);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 12px;
        transform: rotate(-45deg) translate(0, -2px);
        vertical-align: middle;

      }
    }

    &.minHeight {
      /deep/ .calendar_inline {
        height: 80px !important;

        .calendar_content {
          height: 80px !important;
        }
      }
    }

    ///deep/ .calendar_week{
    //  margin-top: 4px;
    //}
    /deep/ .calendar_inline {
      //height: 100px !important;

      .calendar_content {
        padding-bottom: 15px;
        //height: 100px !important;

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

  .dilList {
    width: 100%;
    background-color: #fff;
    margin-bottom: 55px;

    .line {
      width: 292px;
      height: 1px;
      background-color: #EEEEEE;
      margin-left: 68px;
    }

    .contList {

      .cont {
        padding: 15px;

        .heard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;

          .left {
            display: flex;
            align-items: center;

            img {
              width: 38px;
              height: 38px;
              display: inline-block;
              margin-right: 14px;
            }

            span {
              font-size: 15px;
              font-weight: 500;
              color: #222222;
            }
          }

          .right {
            span {
              font-size: 13px;
              font-weight: 400;
              color: #999999;
              display: inline-block;
              margin-left: 5px;
            }

            i {
              font-size: 13px;
              color: #999999;
            }
          }
        }

        .unDo {
          padding-left: 53px;
          text-align: left;

          div {
            margin-bottom: 15px;

            span {
              font-size: 14px;
              color: #222222;
            }
          }

          .description {
            font-size: 14px;
            color: #999999;
            margin-bottom: 15px;
          }

          .EMOTIONS {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            img {
              width: 20px;
              height: 18px;
              display: inline-block;
              margin-right: 6px;
            }

            span {
              font-size: 14px;
              color: #222222;
            }
          }

          .CHANGE_DIAPER {
            div {
              display: flex;
              align-items: center;
            }

            span {
              font-size: 14px;
              color: #222222;
              display: inline-block;
              margin-right: 5px;
            }

            .divRa {
              width: 15px;
              height: 15px;
              border-radius: 50%;
              margin: 0;
            }
          }

          .eat {
            img {
              width: 20px;
              height: 18px;
              display: inline-block;
              margin-right: 6px;
            }

            div {
              display: flex;
              align-items: center;
              margin-top: 12px;
            }
          }

          .imageList {
            ::v-deep .van-uploader {
              margin: 0;
            }
          }
        }
      }

    }
  }

  .footBtn {
    position: fixed;
    bottom: 0;
    left: 12px;
    width: 100%;
    padding-bottom: 5px;
    background-color: #fff;

    div {
      width: calc(100vw - 24px);
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 4px;
      color: $white;
      font-size: 16px;
      background-color: $theme;
    }
  }

  .divBorder {
    border: 1px #999999 solid;
  }
}
</style>
