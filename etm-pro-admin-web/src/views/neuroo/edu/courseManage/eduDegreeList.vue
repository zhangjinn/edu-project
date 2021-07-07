<template>
  <div class="eduDegreeList-wrap">
    <etm-calendar v-model="currentDate">
      <div slot="header">{{ query.schoolName }} {{ query.clazzName }}</div>
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <div
          :class="[
            'calendar-box',
            'holiday' ? isHoliday(date, data) : ''
          ]"
        >
          <div class="calendar-day">{{ day(data) }}</div>
          <template v-for="(item, index) of dateData">
            <template v-if="item.date.split('-')[0] === month(data)">
              <div
                v-if="item.date.split('-')[1] === day(data)"
                :key="index"
                class="current-day"
              >
                <div v-if="item.remarks || item.holiday" class="remarks">{{ item.remarks || '园区休息' }}</div>
                <template v-for="(course, idx) of item.scheduleList">
                  <div :key="idx" class="course-item" @click="courseDetail(course)">
                    <span class="course-name">{{ course.courseName }}</span>
                    <span class="current-number">{{ course.currentNumber }}</span>/<span class="full-number">{{ course.fullNumber }}</span>
                  </div>
                </template>
              </div>
            </template>
          </template>

        </div>

      </template>
    </etm-calendar>

    <etm-side :visible.sync="visible" title="新增排课" class="eduDegreeList-wrap-side" @close="close">
      <course-detail :school-id="query.schoolId" :schedule-id="currentScheduleId" :prop-data="propData" :prop-detail="propDetail" @update="update" />
    </etm-side>
  </div>

</template>

<script>/**
 * eduDegreeList create by haijinsha
 * createTime 2020/6/19 10:33
 */

import { queryLearnCalendar, queryLearnCalendarDetailByScheduleId } from '@/api/neuroo/edu/courseManage'
import { getStartDateAndEndDateByDate } from '@/utils/date'
import EtmCalendar from '@/views/neuroo/edu/courseManage/components/EtmCalendar'
import { parseTime } from '@/utils'
import EtmSide from '@/layout/main/EtmSide/src/EtmSide'
import CourseDetail from '@/views/neuroo/edu/courseManage/courseDetail'

export default {
  name: 'EduDegreeList',
  components: { CourseDetail, EtmSide, EtmCalendar },
  filters: {},
  mixins: [],
  props: {
    query: {
      type: Object,
      default() {
        return { name: '123' }
      }
    }
  },
  data() {
    return {
      currentDate: new Date(),
      dateData: [],
      value: new Date(),
      visible: false,
      propDetail: {},
      propData: [
        {
          title: '所属园区',
          prop: 'schoolName'
        },
        {
          title: '上课班级',
          prop: 'clazzName'
        },
        {
          title: '班主任',
          prop: 'headTeacherName'
        },
        {
          title: '老师',
          prop: 'teacherName'
        }
      ],
      currentScheduleId: '',
      activeCourse: {}
    }
  },
  computed: {},
  watch: {
    'query': {
      handler(value) {
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(value.date))
        this.currentDate = new Date(value.date)
        this.init(startDate, endDate)
      },
      deep: true
    },
    currentDate(value, old) {
      if (parseTime(value, '{m}') !== parseTime(old, '{m}')) {
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(value))
        this.$emit('change', parseTime(value, '{y}-{m}-{d}'))
        this.init(startDate, endDate)
      }
    }
  },
  created() {
  },
  mounted() {
    // this.init()
  },
  methods: {
    init(startDate, endDate) {
      if (!this.query.clazzId) {
        return
      }
      queryLearnCalendar({ clazzId: this.query.clazzId, startDate, endDate }).then(res => {
        this.dateData = res.data
      })
    },
    isHoliday(date, data) {
      // console.log(date, data)
      const holidays = this.dateData.filter(item => item.holiday)
      const day = data.day.split('-')[1] + '-' + data.day.split('-')[2]
      return holidays.find(item => {
        return item.date === day || item.remarks
      })
    },
    isWeekEnd(date) {
      const weekDay = new Date(date).getDay()
      // return weekDay === 0 || weekDay === 6 || false
      return [0, 6].includes(weekDay)
    },
    isPreMonth(date, data) {
      return data.type === 'prev-month'
    },
    isCurrentMonth(date, data) {
      return data.type === 'current-month'
    },
    isNextMonth(date, data) {
      return data.type === 'next-month'
    },
    month(data) {
      try {
        return data.day.split('-')[1]
      } catch (e) {
        return '-'
      }
    },
    day(data) {
      try {
        return data.day.split('-')[2]
      } catch (e) {
        return '-'
      }
    },
    courseDetail(course) {
      this.activeCourse = course
      this.visible = true
      this.currentScheduleId = course.scheduleId
      queryLearnCalendarDetailByScheduleId(course.scheduleId).then(res => {
        this.propDetail = res.data
        this.propDetail.date = parseTime(this.propDetail.date, '{y}-{m}-{d}')
      })
    },
    close() {
      this.visible = false
    },
    update() {
      this.courseDetail(this.activeCourse)
      const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(this.currentDate))
      this.init(startDate, endDate)
    }
  }
}
</script>
<style lang="scss" scoped>
  .eduDegreeList-wrap {
    height: 100%;
    overflow: auto;
    background-color: #fff;

    & /deep/ {
      .el-calendar {
        .el-calendar__body {
          .el-calendar-table__row {
            .current {
              height: 100px;

              .el-calendar-day {
                height: 100%;

                .calendar-box {
                  padding-bottom: 30px;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }

    & /deep/ {
      .el-calendar-day {
        height: auto;
        display: flex;
        flex-direction: column;

        /*.holiday {*/
        /*  background-color: #fdfdfd;*/
        /*  display: flex;*/
        /*  flex-direction: column;*/

        /*  .remarks {*/
        /*    position: absolute;*/
        /*    flex: 1;*/
        /*    display: flex;*/
        /*    align-items: center;*/
        /*    justify-content: center;*/
        /*    color: #ddd;*/
        /*  }*/
        /*}*/

        .calendar-box {
          min-height: 150px;
          height: 100%;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          &:hover {
            .calendar-day {
              @include c_main_color();
            }
          }

          .calendar-day {
            width: 100%;
            text-align: left;
            font-size: 16px;

          }

          .current-day {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .remarks {
              /*position: absolute;*/
              /*flex: 1;*/
              /*display: flex;*/
              /*align-items: center;*/
              /*justify-content: center;*/
              color: #ddd;
            }

            .course-item {
              width: inherit;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;

              .course-name {
                flex: 1;

                &:hover {
                  @include c_main_color();
                }
              }

              .current-number {
                color: $title-color;
                font-size: 18px;
                position: relative;
                top: -1px;
              }

              .full-number {
                color: $secondary-color;
              }
            }
          }
        }

      }
    }
  }
</style>

