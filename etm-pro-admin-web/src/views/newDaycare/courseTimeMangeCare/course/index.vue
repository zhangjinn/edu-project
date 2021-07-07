<template>
  <div class="courseTimeManage-wrap">
    <!--周-->
    <template>
      <EtmWeeklyCalendar
        ref="EtmWeeklyCalendar"
        :table-data="tableData1"
        :add="hasAuthOfBool('daycare.scheduleCourseCare.create')"
        @handleUpDate="handleWeekChange"
        @handleAdd="handleAddWeekCourse"
      >
        <div slot="toolLeft" class="toolLeft" style="display: flex;align-items: center">
          <etm-screen-tab
            v-model="currentViewType"
            :options="weeksSelectList"
            title="视图"
            @change="handleWeekViewTypeChange"
          />
        </div>

        <template slot="toolRight">
          <div class="btn">
            <el-button v-has="{authId: 'daycare.scheduleCourseCare.createBatch'}" type="primary" @click="batchScheduling">批量排课</el-button>
            <el-button v-has="{authId: 'daycare.scheduleCourseCareWeek.copy'}" type="primary" @click="copyDayCourse">复制周课表</el-button>
          </div>
        </template>
        <template v-slot:cell="data">
          <div
            v-for="(course,index) in data.cellList"
            :key="index"
            :style="{backgroundColor: course.colorCode ? course.colorCode.replace(')', ', .1)') : 'rgba(255,255,255,.1)'}"
            class="item"
          >
            <div v-if="course.courseManagementId">
              <el-popover
                placement="right"
                trigger="hover"
                class="course-item-right"
              >
                <div>
                  <div style="margin-bottom: 8px;" :style="{color: course.colorCode}">{{ course.courseName }}</div>
                  <div style="margin-bottom: 8px;" class="course-item">已排课/请假/学位</div>
                  <div style="margin-bottom: 8px;" class="course-item">
                    {{ course.currentFormalChildNum + course.currentExpChildNum }} /
                    {{ course.askForLeaveNum }} /
                    {{ course.totalFormalChildNum + course.totalExpChildNum }}
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="课程类型"> {{ course.courseTypeName }}</etm-field-label>
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="班级">{{ course.clazzName }}</etm-field-label>
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="试听学员"> {{ course.currentExpChildNum }}</etm-field-label>
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="正式学员"> {{ course.currentFormalChildNum }}</etm-field-label>
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="教室"> {{ course.classsroomName }}</etm-field-label>
                  </div>
                  <div class="course-item">
                    <etm-field-label type="left" label="班主任"> {{ course.headTeacherName }}</etm-field-label>
                  </div>
                  <!--                  <div class="course-item">-->
                  <!--                    <etm-field-label type="left" label="授课老师"> {{ course.teacherName }}</etm-field-label>-->
                  <!--                  </div>-->
                  <!--                  <div class="course-item">-->
                  <!--                    <etm-field-label type="left" label="助教老师"> {{ (course.helperTeacherList || []).join() }}</etm-field-label>-->
                  <!--                  </div>-->
                  <!--                  <div class="course-item">-->
                  <!--                    <etm-field-label type="left" label="上课时段"> {{ course.courseTimePeriod }}</etm-field-label>-->
                  <!--                  </div>-->
                </div>
                <div slot="reference">
                  <div :style="{color: course.colorCode}">{{ course.courseName }}</div>
                  <div>{{ course.teacherName }}</div>
                  <div>已排课/请假/学位</div>
                  <div>
                    {{ course.currentFormalChildNum + course.currentExpChildNum }} /
                    {{ course.askForLeaveNum }} /
                    {{ course.totalFormalChildNum + course.totalExpChildNum }}
                  </div>
                </div>
              </el-popover>
              <div class="popTip">
                <span v-has="{authId: 'daycare.scheduleCourseCare.query'}" type="primary" @click="doDetail(course)">详情</span>
                <span v-has="{authId: 'daycare.scheduleCourseCare.copy'}" type="primary" @click="doCopy(course)">复制</span>
                <span v-has="{authId: 'daycare.scheduleCourseCare.remove'}" type="primary" @click="doRemove(course)">删除</span>
              </div>
            </div>
            <div v-else>
              园区休息日
            </div>
          </div>
        </template>
      </EtmWeeklyCalendar>
    </template>

    <!--添加排课-->
    <etm-pop
      pop="complex"
      :visible.sync="courseFormVisible"
      :title="currentCourse.isBatch ? '批量排课': '添加排课'"
      cancel-btn="取消"
      @cancel="courseFormVisible = false"
      @close="courseFormVisible = false"
      @confirm="handleCourse"
    >
      <add-course
        v-if="courseFormVisible"
        ref="addCourse"
        :course-management-id="currentCourse.courseManagementId"
        :date="currentCourse.courseDate"
        :is-batch="currentCourse.isBatch"
      />
    </etm-pop>

    <!--排课详情-->
    <etm-drawer :visible.sync="showCourseDetail" type="small">
      <etm-layout-split v-if="showCourseDetail">
        <etm-title border title="排课详情" size="big">
          <div slot="tool" style="display: flex">
            <el-button v-show="!editable" plain size="mini" style="margin-left: 8px;" @click="editable = true">编辑
            </el-button>
            <el-button v-show="editable" plain size="mini" style="margin-left: 8px;" @click="editable = false">取消
            </el-button>
            <el-button
              v-show="editable"
              type="primary"
              size="mini"
              style="margin-left: 8px;"
              @click="handleUpdateCourse"
            >保存
            </el-button>
          </div>
        </etm-title>
        <add-course
          v-if="editable"
          ref="addCourse"
          :course-date="currentCourse.courseDate"
          :course-management-id="currentCourse.courseManagementId"
        />
        <course-detail v-else :course-management-id="currentCourse.courseManagementId" />
      </etm-layout-split>
    </etm-drawer>

    <!--复制日课表-->
    <etm-pop
      :visible.sync="copyCourse.visible"
      pop="complex"
      title="复制课表"
      cancel-btn="取消"
      @cancel="copyCancel"
      @close="copyCancel"
      @confirm="handleCopyCourse"
    >
      <etm-form
        v-if="copyCourse.visible"
        ref="copyCourseForm"
        :model="copyCourse"
        :rules="copyCourseRules"
        type="dialog"
      >
        <el-form-item label="复制到" prop="targetDate">
          <el-date-picker v-model="copyCourse.targetDate" placeholder="请选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <!--        <el-form-item v-if="copyCourse.title === '复制单节课程'" label="上课时段" prop="courseTimePeriodId">-->
        <!--          <el-select v-model="copyCourse.courseTimePeriodId" placeholder="请选择时段">-->
        <!--            <el-option v-for="(item,index) of courseTimeList" :key="index" :label="item.label" :value="item.value" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="正式学员排课">
          <el-radio v-model="copyCourse.copyFormalChild" :label="true">复制排课学员</el-radio>
          <el-radio v-model="copyCourse.copyFormalChild" :label="false">不复制排课学员</el-radio>
        </el-form-item>
        <el-form-item v-if="copyCourse.title === '复制单节课程'" label="试听学员排课">
          <el-radio v-model="copyCourse.copyExpChild" :label="true">复制排课学员</el-radio>
          <el-radio v-model="copyCourse.copyExpChild" :label="false">不复制排课学员</el-radio>
        </el-form-item>
      </etm-form>
    </etm-pop>

    <!--复制周课表-->
    <etm-pop
      :visible.sync="copyWeekCourse.visible"
      pop="complex"
      title="复制周课表"
      cancel-btn="取消"
      @cancel="copyWeekCourse.visible = false"
      @close="copyWeekCourse.visible = false"
      @confirm="handleCopyWeekCourse"
    >
      <etm-form
        v-if="copyWeekCourse.visible"
        ref="copyWeekCourseForm"
        :model="copyWeekCourse"
        :rules="copyWeekCourseRules"
        type="dialog"
      >
        <el-form-item label="复制到" prop="targetSDate">
          <el-date-picker
            v-model="copyWeekCourse.date"
            type="daterange"
            start-placeholder="请选择日期"
            end-placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="正式学员排课">
          <el-radio v-model="copyWeekCourse.copyFormalChild" :label="true">复制排课学员</el-radio>
          <el-radio v-model="copyWeekCourse.copyFormalChild" :label="false">不复制排课学员</el-radio>
        </el-form-item>
      </etm-form>
    </etm-pop>

  </div>
</template>

<script>
import {
  createCaBatchScheduleOfCourse,
  createCaCopyCourse,
  createCaCopyCourseForDay,
  createCaCopyWeekCourse,
  createCaScheduleOfCourse,
  queryCaScheduleCourseTime,
  queryCaScheduleTimeForWeek,
  queryCheckCopy,
  queryScheduleTimeForDay,
  removeCaCourseById,
  updateCaScheduleOfCourse
} from '@/api/newDaycare/nurseSchedule'
// import EtmDayChangeTag from '@/views/daycare/courseTimeMange2/course/components/EtmDayChangeTag'
import EtmWeeklyCalendar from '@/views/guardcare/edu/scheduleManage/components/EtmWeeklyCalendar/index.vue'
import AddCourse from '@/views/newDaycare/courseTimeMangeCare/course/components/addCourse.vue'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import CourseDetail from '@/views/newDaycare/courseTimeMangeCare/course/components/courseDetail'
import { unique } from '@/utils/arrUtils'

export default {
  name: 'CourseTimeManage',
  components: { CourseDetail, AddCourse, EtmWeeklyCalendar },
  filters: {},
  mixins: [baseMixin],
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentViewType: null,
      tableData1: {
        title: '课程类型',
        time: '',
        content: []
      },
      tableData3: [],
      searchKey: {},
      columns3: [],
      activeTab: 'weekName',
      weekFormData: [
        {
          label: '课程',
          type: 'input',
          prop: 'courseName',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          }
        },
        {
          label: '教室',
          type: 'input',
          prop: 'roomName',
          value: '',
          props: {
            placeholder: '请输入教室名称'
          }
        },
        {
          label: '老师',
          type: 'input',
          prop: 'teacherName',
          value: '',
          props: {
            placeholder: '请输入老师名称'
          }
        }
      ],
      dayFormData: [
        {
          label: '课程',
          type: 'input',
          prop: 'courseName',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          }
        },
        {
          label: '教室',
          type: 'input',
          prop: 'roomName',
          value: '',
          props: {
            placeholder: '请输入教室名称'
          }
        },
        {
          label: '老师',
          type: 'input',
          prop: 'teacherName',
          value: '',
          props: {
            placeholder: '请输入老师名称'
          }
        }
      ],
      isWeekView: true,
      dayOrWeek: [
        {
          name: '周',
          value: 'week'
        },
        {
          name: '日',
          value: 'day'
        }
      ],
      weeksSelectList: [
        {
          name: '课程类型',
          value: 'COURSE_TYPE'
        },
        {
          name: '班主任',
          value: 'TEACHER'
        },
        // {
        //   name: '时段',
        //   value: 'TIME_SPLIT'
        // },
        {
          name: '班级',
          value: 'CLAZZ'
        },
        {
          name: '教室',
          value: 'ROOM'
        }
      ],
      columns: [],
      currentWeekDate: null,
      currentDayDate: parseTime(new Date(), '{y}-{m}-{d}'),
      currentCourse: {
        courseDate: Date.now(),
        isBatch: false
      },
      courseFormVisible: false,
      courseTimeList: [],
      copyCourse: {
        targetDate: '',
        courseTimePeriodId: '',
        visible: false,
        date: '',
        copyFormalChild: true,
        copyExpChild: true,
        title: '复制日课表'
      },
      copyCourseRules: {
        targetDate: { message: '请选择日期', required: true, trigger: 'change' },
        courseTimePeriodId: { required: true, message: '请选择上课时段', trigger: 'change' }
      },
      copyWeekCourse: {
        visible: false,
        sourceStartDate: '',
        targetStartDate: '',
        targetEndDate: '',
        copyFormalChild: true
      },
      copyWeekCourseRules: {},
      showCourseDetail: false,
      editable: false
    }
  },
  watch: {
    showCourseDetail(isVisible) {
      if (isVisible) {
        this.editable = false
      }
    },
    props: {
      deep: true,
      handler(n) {
        this.searchKey = n

        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created() {

  },
  mounted() {
    // 时段
    queryCaScheduleCourseTime().then(res => {
      const data = res.data.map(item => {
        item.time = item.startTime + '-' + item.endTime
        return { ...item }
      })
      this.courseTimeList = this.convertDataToOptions(data, 'time', 'caScourseTimePeriodId')
    })
    this.currentViewType = this.weeksSelectList[0].value
    this.init()
  },
  methods: {
    copyCancel() {
      this.copyCourse.visible = false
      this.$refs['copyCourseForm'].$children[0].resetFields()
    },
    init() {
      // 默认选中第一个
      // this.searchChange(this.weeksSelectList[0].value)
      // this.handleDayOrWeekViewChange('week')
      this.handleChangeTab()
    },
    handleChangeTab(e) {
      this.queryWeekData()
    },
    handleSearch() {
      console.log('搜索了')
      this.init()
    },
    reset() {
      console.log('重置了')
    },
    setting() {
      console.log('设置了')
      this.$router.push('/newdaycare_courseTimeManageSetting')
    },
    change() {
    },
    searchChange(value) {

    },
    queryWeekData() {
      const prop = Object.assign({
        date: this.currentWeekDate,
        viewEnum: this.currentViewType,
        courseName: '',
        roomName: '',
        teacherName: ''
      }, this.searchKey)

      // {
      //   date: this.currentWeekDate,
      //     viewEnum: this.currentViewType,
      //   courseName: this.getValueByProp('courseName', this.weekFormData),
      //   roomName: this.getValueByProp('roomName', this.weekFormData),
      //   teacherName: this.getValueByProp('teacherName', this.weekFormData)
      // }

      queryCaScheduleTimeForWeek(prop).then(res => {
        this.tableData1.content = res.data
      })
    },
    queryDayData() {
      this.columns3 = []
      this.tableData3 = []
      queryScheduleTimeForDay({
        date: this.currentDayDate,
        courseName: this.getValueByProp('courseName', this.dayFormData),
        roomName: this.getValueByProp('roomName', this.dayFormData),
        teacherName: this.getValueByProp('teacherName', this.dayFormData)
      }).then(res => {
        // this.tableData2.title = '教室'
        this.columns3 = [{ label: '教室', prop: 'label' }]
        res.data.forEach(item => {
          item.data.forEach(item2 => {
            this.columns3.push({ label: item2.timePeriodName, prop: item.timePeriodId })
          })
        })
        this.columns3 = unique(this.columns3, 'label')
        this.tableData3 = res.data
      })
    },
    // 日期切换
    handleDayChange(date) {
      this.currentDayDate = date
      this.handleChangeTab()
    },

    // 周视图类型切换
    handleWeekViewTypeChange(value) {
      this.currentViewType = value
      this.tableData1.title = this.weeksSelectList.find(item => item.value === value).name
      this.$refs.EtmWeeklyCalendar.changeColumnTitle()
      this.handleChangeTab()
    },
    // 取周开始日期
    handleWeekChange(week) {
      this.currentWeekDate = week.weekStartDay
      this.handleChangeTab()
    },
    handleAddWeekCourse(labelId, data, weekEnum) {
      this.currentCourse.isBatch = false
      console.log('labelId: ', labelId)
      console.log('data: ', data)
      console.log('weekEnum: ', weekEnum)
      // 获取当前点击的日期
      // 通过周开始日期来确定
      const weekMap = {
        mon: 0,
        tues: 1,
        wed: 2,
        thur: 3,
        fri: 4,
        sat: 5,
        sun: 6
      }
      let result = ''
      this.tableData1.content.forEach((item, index) => {
        if (item.label.id === labelId) {
          for (const dataKey in item.data) {
            if (dataKey === weekEnum.toLowerCase()) {
              result = weekMap[dataKey]
            }
          }
        }
      })
      const ONE_DAY = 24 * 60 * 60 * 1000
      // this.currentDayDate = parseTime(new Date(new Date(this.currentWeekDate).getTime() + ONE_DAY * result), '{y}-{m}-{d}')
      // this.currentCourse = {
      //   courseDate: new Date(new Date(this.currentWeekDate).getTime() + ONE_DAY * result).getTime(),
      //   courseManagementId: null
      // }
      this.currentCourse.courseDate = new Date(new Date(this.currentWeekDate).getTime() + ONE_DAY * result).getTime()
      this.currentCourse.courseManagementId = null
      this.courseFormVisible = true
    },
    weekClick(value) {
      console.log(value)
    },
    convertData(row, col, index) {
      console.log('row: ', row)
      console.log('col: ', col)
      console.log('row[col.prop]: ', row[col.prop])
      return row[col.prop]
    },
    handleAddCourse(cell) {
      this.courseFormVisible = true
      this.currentCourse.courseDate = cell.currentDate
    },
    // 添加课程
    handleCourse() {
      const submit = this.$refs.addCourse.submit()
      if (submit) {
        const { courseId, clazzId, classsroomId, teacherId, courseDate, helperTeacherIds, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList, date, courseTimePeriodIdList, weekdayList } = submit

        if (this.currentCourse.isBatch) {
          createCaBatchScheduleOfCourse({
            courseId,
            clazzId,
            classsroomId,
            teacherId,
            courseDate,
            helperTeacherIds: helperTeacherIds.join(','),
            colorCode,
            courseTimePeriodId,
            formalChildIdList: formalChildIdList.map(item => item.childId),
            expChildIdList: expChildIdList.map(item => item.childId),
            courseTimePeriodIdList,
            weekdayList,
            startDate: parseTime(date[0], '{y}-{m}-{d}'),
            endDate: parseTime(date[1], '{y}-{m}-{d}')
          }).then(res => {
            this.$message.success('操作成功')
            this.courseFormVisible = false
            this.init()
          })
        } else {
          createCaScheduleOfCourse({
            courseId,
            clazzId,
            classsroomId,
            teacherId,
            helperTeacherIds: helperTeacherIds.join(','),
            courseDate,
            colorCode,
            courseTimePeriodId,
            formalChildIdList: formalChildIdList.map(item => item.childId),
            expChildIdList: expChildIdList.map(item => item.childId)
          }).then(res => {
            this.$message.success('操作成功')
            this.courseFormVisible = false
            this.init()
          })
        }
      }
    },
    // 更新课程
    handleUpdateCourse() {
      const submit = this.$refs.addCourse.submit()
      if (submit) {
        const { courseManagementId, courseId, clazzId, classsroomId, teacherId, helperTeacherIds, colorCode, courseTimePeriodId, courseDate, formalChildIdList, expChildIdList } = submit
        updateCaScheduleOfCourse({
          caScourseManagementId: courseManagementId,
          courseId,
          clazzId,
          classsroomId,
          teacherId,
          helperTeacherIds: helperTeacherIds.join(','),
          courseDate,
          colorCode,
          courseTimePeriodId,
          formalChildIdList: formalChildIdList.map(item => item.childId),
          expChildIdList: expChildIdList.map(item => item.childId)
        }).then(res => {
          this.$message.success('操作成功')
          this.editable = false
          this.init()
        })
      }
    },
    doDetail(course) {
      this.currentCourse = course
      this.showCourseDetail = true
    },
    // 复制课程
    doCopy(course) {
      this.currentCourse = course
      this.copyCourse.visible = true
      this.copyCourse.title = '复制单节课程'
    },
    doRemove(course) {
      console.log('course.courseManagementId: ', course)
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该课程吗？`,
        content: `删除后无法恢复，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeCaCourseById({ caScourseManagementId: course.courseManagementId }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    handleCopyCourse() {
      this.$refs.copyCourseForm.$children[0].validate(valid => {
        const { targetDate, copyFormalChild, copyExpChild, courseTimePeriodId } = this.copyCourse
        console.log('valid: ', valid)
        if (valid) {
          if (this.currentCourse.courseManagementId) {
            // 有id复制单节课程
            createCaCopyCourse({
              courseTimePeriodId,
              sourceDate: this.currentDayDate,
              targetSDate: targetDate,
              copyFormalChild,
              copyExpChild,
              courseManagementId: this.currentCourse.courseManagementId
            }).then(res => {
              this.copyCourse.visible = false
              this.$message.success('操作成功')
              this.init()
            })
          } else {
            // 否则复制单日课程
            createCaCopyCourseForDay({ copyFormalChild, targetDate, sourceDate: this.currentDayDate }).then(res => {
              this.copyCourse.visible = false
              this.$refs['copyCourseForm'].$children[0].resetFields()
              this.$message.success('操作成功')
              this.init()
            })
          }
        }
      })
    },
    copyDayCourse() {
      this.copyWeekCourse = this.$options.data().copyWeekCourse
      this.copyWeekCourse.visible = true
    },
    handleCopyWeekCourse() {
      // console.log(this.copyWeekCourse)
      const { date, copyFormalChild } = this.copyWeekCourse
      if (!date.length) {
        return
      }

      queryCheckCopy({
        sourceStartDate: this.currentWeekDate,
        targetStartDate: date[0],
        targetEndDate: date[1],
        copyFormalChild
      }).then(res => {
        if (res.data) {
          this.$etmTip.init({
            type: 'error',
            title: '该日期已有排课, 是否覆盖？',
            content: '覆盖后将无法撤销，是否继续操作？',
            confirmBtn: '確定',
            cancelBtn: '取消',
            confirm: () => {
              this.$etmTip.close()
              const { date, copyFormalChild } = this.copyWeekCourse

              createCaCopyWeekCourse({
                sourceStartDate: this.currentWeekDate,
                targetStartDate: date[0],
                targetEndDate: date[1],
                copyFormalChild
              }).then(res => {
                this.$message.success('操作成功')
                this.copyWeekCourse.visible = false
                this.init()
              })
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          // const { date, copyFormalChild } = this.copyWeekCourse
          //
          // createCaCopyWeekCourse({
          //   sourceStartDate: this.currentWeekDate,
          //   targetStartDate: date[0],
          //   targetEndDate: date[1],
          //   copyFormalChild
          // }).then(res => {
          this.$message.success('操作成功')
          this.copyWeekCourse.visible = false
          this.init()
          // })
        }
      })
      // createCaCopyWeekCourse({
      //   sourceStartDate: this.currentWeekDate,
      //   targetStartDate: date[0],
      //   targetEndDate: date[1],
      //   copyFormalChild
      // }).then(res => {
      //   this.$message.success('操作成功')
      //   this.copyWeekCourse.visible = false
      //   this.init()
      // })
    },
    copyWc() {
      // const { date, copyFormalChild } = this.copyWeekCourse

      // createCaCopyWeekCourse({
      //   sourceStartDate: this.currentWeekDate,
      //   targetStartDate: date[0],
      //   targetEndDate: date[1],
      //   copyFormalChild
      // }).then(res => {
      this.$message.success('操作成功')
      this.copyWeekCourse.visible = false
      this.init()
      // })
    },
    // 批量排课
    batchScheduling() {
      this.currentCourse.courseManagementId = null
      this.currentCourse.isBatch = true
      this.courseFormVisible = true
    },
    handleCopyDayCourse() {
      this.copyCourse.visible = true
      this.copyCourse.title = '复制日课表'
      this.currentCourse.courseManagementId = null
    }
  }
}
</script>

<style lang="scss" scoped>
.courseTimeManage-wrap {

  .btn {
    display: flex;
    marign-left: 0;

    /deep/ .el-button--small {
      margin-left: 8px;
      display: block;
    }
  }

  .toolLeft {
    ::v-deep .EtmScreenTab-wrap {
      margin-bottom: 0;
    }
  }

  .layout-body {

    .el-table__header-wrapper {
      th {
        border-right: none;
        border-left: none;
      }
    }

    .el-table--border {
      border-left: none;
    }

    .el-table__row {
      td:first-child {
        border-left: 1px solid #ebeef5
      }

      .cell {
        padding-left: 8px;
        padding-right: 8px;

        .course-item {
          .item {
            padding: 8px;
            margin-bottom: 8px;
          }

          .EtmFieldLabel-wrap {
            padding-bottom: 0;
          }
        }
      }
    }

    .el-table--border::after, .el-table--group::after {
      width: 0;
    }

    .EtmFieldLabel-wrap {
      padding-bottom: 0;
    }

  }

  .item {
    padding: 8px;
    margin-bottom: 8px;
    position: relative;

    .popTip {
      height: 24px;
      display: none;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, .5);
      color: $white;

      .EtmText-wrap {
        margin: 0;
      }
    }

    &:hover {
      .popTip {
        display: flex;
      }
    }
  }

  .EtmLayoutSplit-wrap {
    .layout-default {
      height: 100vh;
      overflow: auto;
    }
  }

  //.btn {
  //  .el-button:last-child {
  //    margin-left: 14px;
  //  }
  //}

}
</style>
