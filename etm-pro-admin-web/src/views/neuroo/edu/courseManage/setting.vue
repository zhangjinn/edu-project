<template>
  <div class="setting-wrap">
    <etm-layout-split :left-styles="{minWidth:'250px'}">
      <div slot="left">
        <div class="menu">
          <etm-title :border="false">自动排课设置</etm-title>
          <ul class="list-box">
            <li class="list-item" :class="{active: index === 1}" @click="changeMenu('holiday', 1)">节假日设置</li>
            <li class="list-item" :class="{active: index === 2}" @click="changeMenu('course', 2)">课程设置</li>
          </ul>

          <etm-title :border="false">考勤规则设置</etm-title>
          <ul class="list-box">
            <li class="list-item" :class="{active: index === 3}" @click="changeMenu('leave', 3)">请假阈值设置</li>
          </ul>
        </div>
      </div>
      <div slot="right">
        <div class="content">
          <!--节假日设置-->
          <template v-if="index === 1">
            <etm-title :show-line="false" size="14" :border="false">节假日设置</etm-title>
            <div>
              批量设置:
              <el-select v-model="holidaySetting" @change="changeHoliday">
                <el-option v-for="(item, idx) of holidayOptions" :key="idx" :label="item.label" :value="item.value" />
              </el-select>
            </div>

            <etm-calendar v-model="currentDate">
              <template
                slot="dateCell"
                slot-scope="{date, data}"
              >
                <div
                  :class="[
                    'calendar-box',
                  ]"
                  @click="changeDay(data)"
                >
                  <div class="calendar-day">{{ day(data) }}</div>
                  <template v-for="(item, index) of calendarData">
                    <template v-if="item.date.split('-')[0] === month(data)">
                      <div v-if="item.date.split('-')[1] === day(data)" :key="index" class="current-day">
                        <div v-if="item.remarks || item.holiday" class="remarks">{{ item.remarks || '园区休息' }}</div>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </etm-calendar>
          </template>

          <!--课程设置-->
          <template v-if="index === 2">
            <etm-title size="14" :show-line="false" :border="false">
              <div style="width: 100%;display: flex;align-items: center;justify-content:flex-start;position:relative;">
                <span>课程设置</span>
                <span style="position:absolute;right: 0px;"><el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="displayLesson"
                >新增课程</el-button></span>
              </div>
            </etm-title>
            <etm-table :columns="columns" border :data="tableData">
              <!--<el-table-column align="center" label="序号" prop="index" width="80" type="index" />-->
              <!--<el-table-column align="center" label="排课课程" prop="courseName" />-->
              <!--<el-table-column align="center" label="时间" prop="time">-->
              <!--  <template v-slot="{row}">-->
              <!--    <span>{{ row.startTime }}-{{ row.endTime }}</span>-->
              <!--  </template>-->
              <!--</el-table-column>-->
              <el-table-column align="center" label="自动排课" prop="automatic">
                <template v-slot="{row}">
                  <etm-status v-if="row.automatic" type="primary">是</etm-status>
                  <etm-status v-else type="inactive">否</etm-status>
                </template>
              </el-table-column>
              <!--<el-table-column align="center" label="对应课时" prop="lesson" />-->
              <el-table-column align="center" label="状态" prop="enable">
                <template v-slot="{row}">
                  <etm-status v-if="row.enable" type="primary">启用</etm-status>
                  <etm-status v-else type="inactive">禁用</etm-status>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" prop="">
                <template v-slot="{row}">
                  <etm-text v-if="!row.automatic" type="primary" @click="edit(row)">编辑</etm-text>
                  <etm-text v-if="!row.automatic" type="primary" @click="del(row)">删除</etm-text>
                </template>
              </el-table-column>
            </etm-table>

            <etm-pop
              cancel-btn="取消"
              pop="simple"
              :title="status === 'create' ? '新增课程' : '编辑课程'"
              :visible="visible"
              @close="visible = false"
              @cancel="visible = false"
              @confirm="confirm"
            >
              <etm-form ref="etmForm" type="dialog" :model="lessonModel" :rules="lessonRule">
                <el-form-item label="课程名称:" prop="courseName">
                  <el-input v-model="lessonModel.courseName" />
                </el-form-item>
                <el-form-item label="课程时间:" prop="time">
                  <el-time-picker
                    v-model="lessonModel.time"
                    value-format="HH:mm:ss"
                    is-range
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                  />
                </el-form-item>
                <el-form-item label="对应课时:" prop="lesson">
                  <el-input v-model="lessonModel.lesson" />
                </el-form-item>
                <el-form-item label="是否启用:" prop="enable">
                  <el-select v-model="lessonModel.enable">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </el-form-item>

              </etm-form>
            </etm-pop>
          </template>

          <!--请假阈值设置-->
          <template v-if="index === 3">

            <etm-title :show-line="false" :border="false" size="14">请假阈值设置</etm-title>
            <etm-form type="small">
              <el-form-item label="设置阈值">
                <el-select v-model="threshold" @change="setThreshold">
                  <el-option
                    v-for="(item,idx) of thresholdOptions"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </etm-form>
          </template>
        </div>
      </div>
    </etm-layout-split>

  </div>

</template>

<script>
import EtmCalendar from '@/views/neuroo/edu/courseManage/components/EtmCalendar'
import {
  delLessonCourse,
  postLesson,
  queryCalendar,
  queryCalendarHolidayOption,
  queryCanDeleteCourseByCourseId,
  queryLeaveThreshold,
  queryLessonByCourseId,
  queryLessonList,
  updateCalendarHoliday,
  updateLeaveThreshold,
  updateLesson
} from '@/api/neuroo/edu/setting'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import { getStartDateAndEndDateByMonth } from '@/utils/date'
import { updateLearnCalendar } from '@/api/neuroo/edu/courseManage'
import { getNeurooEnumByName } from '@/api/neuroo/neuroo'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

/**
 * setting create by haijinsha
 * createTime 2020/6/19 18:05
 */
export default {
  name: 'Setting',
  components: { EtmPop, EtmCalendar },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      currentDate: new Date(),
      index: 1,
      educationalSettingId: '',
      holidaySetting: '',
      holidayOptions: [
        {
          label: '排除周六日',
          value: 'WEEKEND'
        },
        {
          label: '排除周六',
          value: 'SATURDAY'
        },
        {
          label: '排除周日',
          value: 'SUNDAY'
        },
        {
          label: '不排除',
          value: 'NOTEXCLUDED'
        }
      ],
      calendarData: [],
      tableData: [],
      visible: false,
      lessonModel: {
        courseName: '',
        time: [],
        startTime: '',
        endTime: '',
        lesson: '',
        enable: true
      },
      lessonRule: {
        courseName: { required: true, message: '请输入课程名称', trigger: 'blur' },
        time: { required: true, message: '请选择时间', trigger: 'blur' },
        enable: { required: true, message: '请选择状态', trigger: 'change' },
        lesson: { required: true, message: '请输入课时', trigger: 'blur' }
      },
      thresholdOptions: [],
      threshold: '',
      status: 'create',
      courseId: '',
      columns: [
        { label: '序号', prop: 'index', type: 'index', width: '80px' },
        { label: '排课课程', prop: 'courseName' },
        { label: '时间', prop: 'time' },
        { label: '对应课时', prop: 'lesson' }
      ]
    }
  },
  computed: {},
  watch: {
    currentDate(value) {
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(value).getMonth() + 1)
      queryCalendar({ startDate, endDate }).then(res => {
        this.calendarData = res.data
      })
    }
  },
  created() {
  },
  mounted() {
    /**
     * 节假日选项
     */
    getNeurooEnumByName({ name: 'Educational' }).then(res => {
      this.holidayOptions = this.convertDataToOptions(res.data, 'name')
      queryCalendarHolidayOption().then(res => {
        // 教务ID
        this.educationalSettingId = res.data.id
        this.holidaySetting = res.data.holidaySetting
      })
    })

    /**
     * 请假阈值选项
     */
    getNeurooEnumByName({ name: 'LeaveThresholdType' }).then(res => {
      this.thresholdOptions = this.convertDataToOptions(res.data, 'name')
      queryLeaveThreshold().then(res => {
        this.threshold = res.data.thresholdType
      })
    })

    this.init()
  },
  methods: {
    init() {
      queryLessonList().then(res => {
        this.tableData = res.data
        this.tableData.forEach(item => {
          item.time = item.startTime + '-' + item.endTime
        })
      })
      const { startDate, endDate } = getStartDateAndEndDateByMonth(new Date(this.currentDate).getMonth() + 1)
      queryCalendar({ startDate, endDate }).then(res => {
        this.calendarData = res.data
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
    changeDay(data) {
      console.log(data)
      const date = data.day.split('-')[1] + '-' + data.day.split('-')[2]
      const result = this.calendarData.find(item => {
        return item.date === date
      })
      console.log(result)
      updateLearnCalendar({ holiday: !result.holiday, date: data.day, remarks: '' }).then(res => {
        this.$message.success('操作成功')
        this.init()
      })
    },
    changeHoliday() {
      updateCalendarHoliday({
        educationalSettingId: this.educationalSettingId,
        holidaySetting: this.holidaySetting
      }).then(res => {
        console.log(res)
        this.$message.success('操作成功')
        this.init()
      })
    },
    setThreshold() {
      updateLeaveThreshold({ thresholdType: this.threshold }).then(res => {
        this.$message.success('操作成功')
      })
    },
    changeMenu(name, index) {
      this.index = index
    },
    edit(row) {
      this.status = 'edit'
      this.courseId = row.courseId
      queryLessonByCourseId(this.courseId).then(res => {
        this.lessonModel = res.data
        this.$set(this.lessonModel, 'time', [this.lessonModel.startTime, this.lessonModel.endTime])
        this.visible = true
      })
    },
    del(row) {
      queryCanDeleteCourseByCourseId({ courseId: row.courseId }).then(res => {
        if (Array.isArray(res.data) && res.data.length) {
          // 已有排课，不能自动排课
          let li = ''
          res.data.forEach(v => {
            li += `<li>${v.clazzName} ${v.courseName} ${parseTime(v.date, '{y}-{m}-{d}')}</li>`
          })
          const html = `<ul>${li}</ul><div>有预约学员不能删除</div>`
          this.$etmTip.init({
            type: 'warn',
            title: '排课冲突',
            html,
            confirmBtn: '确定',
            confirm: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          this.$confirm(`确定要删除该数据吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delLessonCourse({ courseId: row.courseId }).then(res => {
              console.log(res)
              this.$message.success('操作成功')
              this.tableData.splice(this.tableData.findIndex(item => item.courseId === row.courseId), 1)
            })
          })
        }
      })
    },
    displayLesson() {
      this.visible = true
      this.lessonModel = {}
      this.status = 'create'
    },
    /**
     * 新增/修改课程
     */
    confirm() {
      this.$refs['etmForm'].$children[0].validate(valid => {
        if (valid) {
          const { courseName, time, lesson, enable } = this.lessonModel
          if (this.status === 'create') {
            postLesson({
              courseName, lesson, enable,
              startTime: time[0],
              endTime: time[1]
            }).then(res => {
              this.visible = false
              this.$message.success('操作成功')
              this.init()
            })
          } else if (this.status === 'edit') {
            updateLesson({
              courseId: this.courseId,
              courseName,
              startTime: time[0],
              endTime: time[1],
              enable,
              lesson
            }).then(res => {
              console.log(res)
              this.visible = false
              this.$message.success('操作成功')
              this.init()
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .setting-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    /*height: 100%;*/
    /*overflow: hidden;*/

    .menu {
      /*min-width: 250px;*/
      /*height: 100%;*/
      /*background-color: #fff;*/

      /*& /deep/ .EtmTitle-wrap {*/
      /*  margin-bottom: 0;*/
      /*}*/

      .list-box {
        .list-item {
          padding: 0 24px;
          cursor: pointer;
          margin-bottom: 16px;
        }
      }
    }

    .content {
      /*height: 100%;*/
      flex: 1;
      display: flex;
      flex-direction: column;
      /*margin-left: 24px;*/
      /*background-color: #fff;*/
      /*padding: 16px 24px;*/

      /*& /deep/ .EtmTable-wrap {*/
      /*  padding: 0;*/
      /*}*/

      & /deep/ .etm-calendar-wrap {
        flex: 1;
        /*overflow: auto;*/

        .el-calendar__header, .el-calendar__body {
          padding-left: 0;
          padding-right: 0;
        }

        .el-calendar-day {
          min-height: 150px;
        }

        .calendar-box {
          padding: 10px;

          .current-day {
            min-height: 100px;
            display: flex;
            flex-direction: column;

            .remarks {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          &:hover {
            @include c_main_color();
          }
        }
      }
    }

    .active {
      @include c_main_color();
    }
  }
</style>
