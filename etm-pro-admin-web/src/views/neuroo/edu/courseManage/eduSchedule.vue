<template>
  <div class="eduSchedule-wrap">
    <div class="tool-bar">
      <el-button type="primary" @click="autoCourse = true">批量排课</el-button>
    </div>
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
            <template v-if="item.date.split('-')[0] === month(data)" class="当前月">
              <template v-if="item.date.split('-')[1] === day(data)" class="当前天">
                <div v-if="item.holiday" :key="index + '1'" class="remarks">园区休息</div>
                <div :key="index" class="course-box">
                  <template v-for="(course, idx) of item.scheduleList">
                    <p :key="idx" class="course-item">
                      {{ course.courseName }} {{ course.startTime }} - {{ course.endTime }}
                      <span class="el-icon-close icon" @click="delCourse(course)" /></p>
                  </template>
                </div>

              </template>
            </template>
          </template>
          <div class="btn">
            <p @click="addCourse(date)">添加</p>
          </div>
        </div>
      </template>
    </etm-calendar>
    <etm-pop
      :visible="visible"
      pop="simple"
      title="添加排课"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="visible = false"
      @confirm="confirm"
      @cancel="visible = false"
    >
      <etm-form type="dialog">
        <el-form-item label="课程">
          <el-select v-model="courseId">
            <el-option
              v-for="(course, index) of courseOption"
              :key="index"
              :label="course.courseName"
              :value="course.courseId"
            />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>

    <etm-pop
      :visible="autoCourse"
      pop="simple"
      :title="`批量排课(${query.schoolName}, ${query.clazzName})`"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="autoCourse = false"
      @confirm="applyAutoCourse"
      @cancel="autoCourse = false"
    >
      <etm-form type="dialog">
        <el-form-item label="课程类型">
          <el-select v-model="courseId">
            <el-option
              v-for="(course, index) of courseOption"
              :key="index"
              :label="course.courseName"
              :value="course.courseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="selectDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>

</template>

<script>
import EtmCalendar from '@/views/neuroo/edu/courseManage/components/EtmCalendar'
import {
  createAutoCourseForClazzByDate,
  delScheduleCalendarById,
  postCourseSchedule,
  queryCanAutoCourseByDate,
  queryCourseByOption,
  queryScheduleCalendar
} from '@/api/neuroo/edu/courseManage'
import { getStartDateAndEndDateByDate } from '@/utils/date'
import { parseTime } from '@/utils'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'

/** ∂
 * eduSchedule create by haijinsha
 * createTime 2020/6/22 15:43
 */
export default {
  name: 'EduSchedule',
  components: { EtmPop, EtmCalendar },
  filters: {},
  mixins: [],
  props: {
    query: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentDate: new Date(),
      dateData: [],
      visible: false,
      currentCourseInfo: {},
      courseOption: [],
      courseId: '',
      selectDate: [],
      autoCourse: false
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
    // const { startDate, endDate } = getStartDateAndEndDateByMonth(this.currentDate.getMonth() + 1)
    // this.init(startDate, endDate)
    queryCourseByOption().then(res => {
      this.courseOption = res.data
    })
  },
  methods: {
    init(startDate, endDate) {
      if (!this.query.clazzId) {
        return
      }
      queryScheduleCalendar({ clazzId: this.query.clazzId, startDate, endDate }).then(res => {
        this.dateData = res.data
      })
    },
    isHoliday(date, data) {
      // console.log(date, data)
      const holidays = this.dateData.filter(item => item.holiday)
      const day = data.day.split('-')[1] + '-' + data.day.split('-')[2]
      return holidays.find(item => {
        return item.date === day
      })
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
    detail(item, course) {
      this.$set(item, 'active', course.courseName)
    },
    delCourse(course) {
      console.log(course)
      this.$confirm('您确定要删除该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delScheduleCalendarById({ scheduleId: course.scheduleId }).then(() => {
          this.$message.success('删除成功')
          const { startDate, endDate } = getStartDateAndEndDateByDate(this.currentDate)
          this.init(startDate, endDate)
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    addCourse(date) {
      if (!this.query.clazzId) {
        return this.$message.warning('请先选择教室')
      }
      this.currentCourseInfo = {
        date: parseTime(date, '{yyyy}-{m}-{d}')
      }
      this.visible = true
      this.courseId = ''
    },
    confirm() {
      if (!this.courseId) {
        return this.$message.error('请选择课程')
      }
      postCourseSchedule({
        clazzId: this.query.clazzId,
        courseId: this.courseId,
        date: this.currentCourseInfo.date
      }).then(res => {
        this.visible = false
        this.$message.success('新增课程成功')
        const { startDate, endDate } = getStartDateAndEndDateByDate(this.currentDate)
        this.init(startDate, endDate)
      })
    },
    async applyAutoCourse() {
      console.log(1)
      await queryCanAutoCourseByDate({
        clazzId: this.query.clazzId,
        courseId: this.courseId,
        startDate: this.selectDate[0],
        endDate: this.selectDate[1]
      }).then(async res => {
        console.log(res)
        if (Array.isArray(res.data) && res.data.length) {
          // 已有排课，不能自动排课
          let li = ''
          res.data.forEach(v => {
            li += `<li>${v.courseName} ${parseTime(v.date, '{y}-{m}-{d}')}</li>`
          })
          const html = `<div>以下日期以排课, 是否覆盖?</div><ul>${li}</ul>`
          this.$etmTip.init({
            type: 'warn',
            title: '排课冲突',
            html,
            confirmBtn: '确定',
            cancelBtn: '取消',
            cancel: () => {
              this.$etmTip.close()
            },
            confirm: () => {
              createAutoCourseForClazzByDate({
                clazzId: this.query.clazzId,
                courseId: this.courseId,
                startDate: this.selectDate[0],
                endDate: this.selectDate[1]
              }).then(res => {
                this.courseId = ''
                this.selectDate = []
                this.$message.success('操作成功')
                this.$etmTip.close()
                this.autoCourse = false
                const { startDate, endDate } = getStartDateAndEndDateByDate(this.currentDate)
                this.init(startDate, endDate)
              })
            }
          })
          this.$etmTip.open()
        } else {
          createAutoCourseForClazzByDate({
            clazzId: this.query.clazzId,
            courseId: this.courseId,
            startDate: this.selectDate[0],
            endDate: this.selectDate[1]
          }).then(res => {
            this.courseId = ''
            this.selectDate = []
            this.$message.success('操作成功')
            this.autoCourse = false
            const { startDate, endDate } = getStartDateAndEndDateByDate(this.currentDate)
            this.init(startDate, endDate)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .eduSchedule-wrap {
    height: 100%;
    overflow: auto;

    .tool-bar {
      padding: 0 0 16px 0;
      display: flex;
      justify-content: flex-end;
      background-color: #fff;
    }

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
      .btn {
        p {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          @include bgc_main_color();
          color: $white;
        }

        display: none;
      }

      .el-calendar-day {
        height: auto;
      }

      .el-calendar-day:hover {
        .calendar-day {
          @include c_main_color();
        }

        .btn {
          display: block;
        }
      }
    }

    .holiday {
      background-color: #fdfdfd;
      display: flex;
      flex-direction: column;

      .remarks {
        /*position: relative;*/
        /*flex: 1;*/
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
        text-align: center;
        color: #ddd;
      }
    }

    .calendar-box {
      min-height: 150px;
      padding: 10px;
      position: relative;
      display: flex;
      flex-direction: column;

      .calendar-day {
        font-size: 16px;
      }

      .course-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .course-item {
          display: flex;
          align-items: center;

          &:hover {
            cursor: pointer;
            @include c_main_color();
          }
          .icon {
            &:hover {
              color: $error-color;
            }
          }

          span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
          }
        }
      }

      .btn {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        cursor: pointer;
      }
    }

    .active-course {
      @include c_main_color();
    }
  }
</style>
