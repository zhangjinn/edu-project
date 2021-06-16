<template>
  <div class="courseTimeManage-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
            :setting="hasAuthOfBool('daycare.scheduleCourseTeach.setting')"
            @setting="setting"
            @tab-click="handleChangeTab"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.scheduleCourseTeachWeek.queryBatch', 'tabs', 'activeName')"
              label="早教排课表(周)"
              name="weekView"
            >
              <etm-tool-bar
                v-model="weekFormData"
                @reset="reset"
                @search="handleSearch($event,'weekView')"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.scheduleCourseTeachDay.queryBatch', 'tabs', 'activeName')"
              label="早教排课表(日)"
              name="dayView"
            >
              <etm-tool-bar
                v-model="dayFormData"
                @reset="reset"
                @search="handleSearch($event,'dayView')"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <!--日-->
          <template v-if="activeName === 'dayView'">
            <div style="padding-bottom: 16px;">
              <div class="tool-bar">
                <div class="right">
                  <!--日-->
                  <template>
                    <el-date-picker
                      v-model="currentDayDate"
                      placeholder="请选择日期"
                      value-format="yyyy-MM-dd"
                      @change="handleDayChange"
                    />
                    <etm-day-change-tag
                      v-model="currentDayDate"
                      @change="handleDayChange"
                    />
                    <div class="btn">
                      <el-button
                        v-has="{authId: 'daycare.scheduleCourseTeach.createBatch'}"
                        type="primary"
                        @click="batchScheduling"
                      >
                        批量排课
                      </el-button>
                      <el-button
                        v-has="{authId: 'daycare.scheduleCourseTeachDay.copy'}"
                        type="primary"
                        @click="handleCopyDayCourse"
                      >
                        复制日课表
                      </el-button>
                    </div>
                  </template>
                </div>
              </div>
              <el-table
                :data="tableData3"
                border
              >
                <el-table-column
                  v-for="(col, index) of columns3"
                  :key="index"
                  :label="col.label"
                  v-bind="{...col}"
                >
                  <template
                    v-if="index === 0"
                    v-slot="{row}"
                  >
                    <span>{{ row.classroom.roomName }}</span>
                  </template>
                  <template
                    v-else
                    v-slot="{row}"
                  >
                    <template v-for="(item,idx) of row.data">
                      <div
                        v-if="item.timePeriodName === col.label "
                        :key="idx"
                        class="course-item"
                      >
                        <div
                          v-for="(course, i) of item.listCourseManagementVOList"
                          :key="i"
                          :style="{backgroundColor: course.colorCode.replace(')', ', .1)')}"
                          class="item"
                        >
                          <el-popover
                            placement="right"
                            trigger="hover"
                            class="course-item-right"
                          >
                            <div>
                              <div
                                style="margin-bottom: 8px;"
                                :style="{color: course.colorCode}"
                              >
                                {{
                                  course.courseName
                                }}
                              </div>
                              <div
                                style="margin-bottom: 8px;"
                                class="course-item"
                              >
                                已排课/请假/学位
                              </div>
                              <div
                                style="margin-bottom: 8px;"
                                class="course-item"
                              >
                                {{ course.currentFormalChildNum + course.currentExpChildNum }} /
                                {{ course.askForLeaveNum }} /
                                {{ course.totalFormalChildNum + course.totalExpChildNum }}
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="课程类型"
                                >
                                  {{ course.courseTypeName }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="班级"
                                >
                                  {{ course.clazzName }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="试听学员"
                                >
                                  {{ course.currentExpChildNum }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="正式学员"
                                >
                                  {{ course.currentFormalChildNum }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="教室"
                                >
                                  {{ course.classsroomName }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="班主任"
                                >
                                  {{ course.headTeacherName }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="上课老师"
                                >
                                  {{ course.teacherName }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="助教老师"
                                >
                                  {{ course.helperTeacherList.join() }}
                                </etm-field-label>
                              </div>
                              <div class="course-item">
                                <etm-field-label
                                  type="left"
                                  label="上课时段"
                                >
                                  {{ course.courseTimePeriod }}
                                </etm-field-label>
                              </div>
                            </div>
                            <div slot="reference">
                              <div :style="{color: course.colorCode}">
                                {{ course.courseName }}
                              </div>
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
                            <span
                              v-has="{authId: 'daycare.scheduleCourseTeach.query'}"
                              type="primary"
                              @click="doDetail(course)"
                            >详情</span>
                            <span
                              v-has="{authId: 'daycare.scheduleCourseTeach.copy'}"
                              type="primary"
                              @click="doCopy(course)"
                            >复制</span>
                            <span
                              v-has="{authId: 'daycare.scheduleCourseTeach.remove'}"
                              type="primary"
                              @click="doRemove(course)"
                            >删除</span>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      class="btn"
                      style="margin-top: 8px;"
                    >
                      <etm-text
                        v-has="{authId:'daycare.scheduleCourseTeach.create'}"
                        @click="handleAddCourse(row)"
                      >
                        <i class="el-icon-plus" />
                      </etm-text>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>

          <!--周-->
          <template v-if="activeName === 'weekView'">
            <EtmWeeklyCalendar
              v-if="activeName === 'weekView'"
              ref="EtmWeeklyCalendar"
              :table-data="tableData1"
              :add="hasAuthOfBool('daycare.scheduleCourseTeach.create')"
              @handleUpDate="handleWeekChange"
              @handleAdd="handleAddWeekCourse"
            >
              <div
                slot="toolLeft"
                class="toolLeft"
                style="align-items: center;
  display: flex;"
              >
                <etm-screen-tab
                  v-if="activeName === 'weekView'"
                  v-model="currentViewType"
                  :options="weeksSelectList"
                  title="视图"
                  @change="handleWeekViewTypeChange"
                />
              </div>
              <template slot="toolRight">
                <div class="btn">
                  <el-button
                    v-has="{authId: 'daycare.scheduleCourseTeach.createBatch'}"
                    type="primary"
                    @click="batchScheduling"
                  >
                    批量排课
                  </el-button>
                  <el-button
                    v-has="{authId: 'daycare.scheduleCourseTeachWeek.copy'}"
                    type="primary"
                    @click="copyDayCourse"
                  >
                    复制周课表
                  </el-button>
                </div>
              </template>
              <template v-slot:cell="data">
                <div
                  v-for="(course,index) in data.cellList"
                  :key="index"
                  :style="{backgroundColor: course.colorCode.replace(')', ', .1)')}"
                  class="item"
                >
                  <el-popover
                    placement="right"
                    trigger="hover"
                    class="course-item-right"
                  >
                    <div>
                      <div
                        style="margin-bottom: 8px;"
                        :style="{color: course.colorCode}"
                      >
                        {{ course.courseName }}
                      </div>
                      <div
                        style="margin-bottom: 8px;"
                        class="course-item"
                      >
                        已排课/请假/学位
                      </div>
                      <div
                        style="margin-bottom: 8px;"
                        class="course-item"
                      >
                        {{ course.currentFormalChildNum + course.currentExpChildNum }} /
                        {{ course.askForLeaveNum }} /
                        {{ course.totalFormalChildNum + course.totalExpChildNum }}
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="课程类型"
                        >
                          {{ course.courseTypeName }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="班级"
                        >
                          {{ course.clazzName }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="试听学员"
                        >
                          {{ course.currentExpChildNum }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="正式学员"
                        >
                          {{ course.currentFormalChildNum }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="教室"
                        >
                          {{ course.classsroomName }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="班主任"
                        >
                          {{ course.headTeacherName }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="上课老师"
                        >
                          {{ course.teacherName }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="助教老师"
                        >
                          {{ course.helperTeacherList.join() }}
                        </etm-field-label>
                      </div>
                      <div class="course-item">
                        <etm-field-label
                          type="left"
                          label="上课时段"
                        >
                          {{ course.courseTimePeriod }}
                        </etm-field-label>
                      </div>
                    </div>
                    <div slot="reference">
                      <div :style="{color: course.colorCode}">
                        {{ course.courseName }}
                      </div>
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
                    <span
                      v-has="{authId: 'daycare.scheduleCourseTeach.query'}"
                      type="primary"
                      @click="doDetail(course)"
                    >详情</span>
                    <span
                      v-has="{authId: 'daycare.scheduleCourseTeach.copy'}"
                      type="primary"
                      @click="doCopy(course)"
                    >复制</span>
                    <span
                      v-has="{authId: 'daycare.scheduleCourseTeach.remove'}"
                      type="primary"
                      @click="doRemove(course)"
                    >删除</span>
                  </div>
                </div>
              </template>
            </EtmWeeklyCalendar>
          </template>
        </div>
      </etm-layout-split>
    </etm-main-body>

    <!--添加排课-->
    <etm-pop
      pop="complex"
      :visible.sync="courseFormVisible"
      :title="currentCourse.isBatch ? '批量排课': '添加排课'"
      cancel-btn="取消"
      @cancel="addCourseCancel"
      @close="addCourseCancel"
      @confirm="handleCourse"
    >
      <add-course
        v-if="courseFormVisible"
        ref="addCourse"
        :course-management-id="currentCourse.courseManagementId"
        :date="currentCourse.courseDate"
        :class-room-id="classRoomId"
        :is-batch="currentCourse.isBatch"
      />
    </etm-pop>

    <!--排课详情-->
    <etm-drawer
      :visible.sync="showCourseDetail"
      type="small"
    >
      <etm-layout-split v-if="showCourseDetail">
        <etm-title
          border
          title="排课详情"
          size="big"
        >
          <div
            slot="tool"
            style="display: flex;"
          >
            <el-button
              v-show="!editable"
              plain
              size="mini"
              style="margin-left: 8px;"
              @click="editable = true"
            >
              编辑
            </el-button>
            <el-button
              v-show="editable"
              plain
              size="mini"
              style="margin-left: 8px;"
              @click="editable = false"
            >
              取消
            </el-button>
            <el-button
              v-show="editable"
              type="primary"
              size="mini"
              style="margin-left: 8px;"
              @click="handleUpdateCourse"
            >
              保存
            </el-button>
          </div>
        </etm-title>
        <add-course
          v-if="editable"
          ref="addCourse"
          :date="currentCourse.courseDate"
          :course-management-id="currentCourse.courseManagementId"
        />
        <course-detail
          v-else
          :course-management-id="currentCourse.courseManagementId"
        />
      </etm-layout-split>
    </etm-drawer>

    <!--复制日课表-->
    <etm-pop
      :visible.sync="copyCourse.visible"
      pop="complex"
      title="复制课表"
      cancel-btn="取消"
      @cancel="copyCourse.visible = false"
      @close="copyCourse.visible = false"
      @confirm="handleCopyCourse"
    >
      <etm-form
        v-if="copyCourse.visible"
        ref="copyCourseForm"
        :model="copyCourse"
        :rules="copyCourseRules"
        type="dialog"
      >
        <el-form-item
          label="复制到"
          prop="targetDate"
        >
          <el-date-picker
            v-model="copyCourse.targetDate"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item
          v-if="copyCourse.title === '复制单节课程'"
          label="上课时段"
          prop="courseTimePeriodId"
        >
          <el-select
            v-model="copyCourse.courseTimePeriodId"
            placeholder="请选择时段"
          >
            <el-option
              v-for="(item,index) of courseTimeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="正式学员排课">
          <el-radio
            v-model="copyCourse.copyFormalChild"
            :label="true"
          >
            复制排课学员
          </el-radio>
          <el-radio
            v-model="copyCourse.copyFormalChild"
            :label="false"
          >
            不复制排课学员
          </el-radio>
        </el-form-item>
        <el-form-item
          v-if="copyCourse.title === '复制单节课程'"
          label="试听学员排课"
        >
          <el-radio
            v-model="copyCourse.copyExpChild"
            :label="true"
          >
            复制排课学员
          </el-radio>
          <el-radio
            v-model="copyCourse.copyExpChild"
            :label="false"
          >
            不复制排课学员
          </el-radio>
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
        <el-form-item
          label="复制到"
          prop="targetSDate"
        >
          <el-date-picker
            v-model="copyWeekCourse.date"
            type="daterange"
            start-placeholder="请选择日期"
            end-placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="正式学员排课">
          <el-radio
            v-model="copyWeekCourse.copyFormalChild"
            :label="true"
          >
            复制排课学员
          </el-radio>
          <el-radio
            v-model="copyWeekCourse.copyFormalChild"
            :label="false"
          >
            不复制排课学员
          </el-radio>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import {
  createBatchScheduleOfCourse,
  createCheckCourseOverrideForBatch,
  createCopyCourse,
  createCopyCourseForDay,
  createCopyWeekCourse,
  createScheduleOfCourse,
  queryScheduleCourseTime,
  queryScheduleTimeForDay,
  queryScheduleTimeForWeek,
  removeCourseById,
  updateScheduleOfCourse
} from '@/api/newDaycare/scheduleManage'
import EtmDayChangeTag from '@/views/newDaycare/courseTimeManageTeach/components/EtmDayChangeTag'
import EtmWeeklyCalendar from '@/views/newDaycare/courseTimeManageTeach/components/EtmWeeklyCalendar/index'
import AddCourse from '@/views/newDaycare/courseTimeManageTeach/components/addCourse.vue'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import CourseDetail from '@/views/newDaycare/courseTimeManageTeach/components/courseDetail'
import { unique } from '@/utils/arrUtils'

export default {
  name: 'CourseTimeManage',
  components: { CourseDetail, AddCourse, EtmDayChangeTag, EtmWeeklyCalendar },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      classRoomId: 0,
      tableData1: {
        title: '课程类型',
        time: '',
        content: []
      },
      tableData3: [],
      columns3: [],
      activeName: 'weekView',
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
          name: '时段',
          value: 'TIME_SPLIT'
        },
        {
          name: '班级',
          value: 'CLAZZ'
        },
        {
          name: '教室',
          value: 'ROOM'
        },
        {
          name: '老师',
          value: 'TEACHER'
        }
      ],
      currentViewType: null,
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
    showCourseDetail (isVisible) {
      if (isVisible) {
        this.editable = false
      }
    }
  },

  created () {

  },
  mounted () {
    // 时段
    queryScheduleCourseTime().then(res => {
      const data = res.data.map(item => {
        item.time = item.startTime + '-' + item.endTime
        return { ...item }
      })
      this.courseTimeList = this.convertDataToOptions(data, 'time', 'courseTimePeriodId')
    })
    this.currentViewType = this.weeksSelectList[0].value
    this.init()
  },
  methods: {
    addCourseCancel () {
      this.courseFormVisible = false
      this.classRoomId = 0
    },
    init () {
      // 默认选中第一个
      // this.searchChange(this.weeksSelectList[0].value)
      // this.handleDayOrWeekViewChange('week')
      this.handleChangeTab()
    },
    handleChangeTab (e) {
      if (this.activeName === 'weekView') {
        this.queryWeekData()
      } else {
        this.queryDayData()
      }
    },
    handleSearch () {
      console.log('搜索了')
      this.init()
    },
    reset () {
      console.log('重置了')
    },
    setting () {
      console.log('设置了')
      this.$router.push('/newdaycare_courseTimeManageSetting')
    },
    change () {
    },
    searchChange (value) {

    },
    queryWeekData () {
      queryScheduleTimeForWeek({
        date: this.currentWeekDate,
        viewEnum: this.currentViewType,
        courseName: this.getValueByProp('courseName', this.weekFormData),
        roomName: this.getValueByProp('roomName', this.weekFormData),
        teacherName: this.getValueByProp('teacherName', this.weekFormData)
      }).then(res => {
        this.tableData1.content = res.data
      })
    },
    queryDayData () {
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
    handleDayChange (date) {
      this.currentDayDate = date
      this.handleChangeTab()
    },

    // 周视图类型切换
    handleWeekViewTypeChange (value) {
      this.currentViewType = value
      this.tableData1.title = this.weeksSelectList.find(item => item.value === value).name
      this.$refs.EtmWeeklyCalendar.changeColumnTitle()
      this.handleChangeTab()
    },
    // 取周开始日期
    handleWeekChange (week) {
      this.currentWeekDate = week.weekStartDay
      this.handleChangeTab()
    },
    handleAddWeekCourse (labelId, data, weekEnum) {
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
      this.currentCourse.courseDate = parseTime(new Date(new Date(this.currentWeekDate).getTime() + ONE_DAY * result).getTime(), '{y}-{m}-{d}')
      this.currentCourse.courseManagementId = null
      this.courseFormVisible = true
    },
    weekClick (value) {
      console.log(value)
    },
    convertData (row, col, index) {
      // console.log('row: ', row)
      // console.log('col: ', col)
      // console.log('row[col.prop]: ', row[col.prop])
      return row[col.prop]
    },
    handleAddCourse (cell) {
      console.log(cell)
      this.currentCourse.isBatch = false
      this.courseFormVisible = true
      this.classRoomId = cell.classroom.roomId
      this.currentCourse.courseDate = this.currentDayDate
    },
    // 添加课程
    handleCourse () {
      const submit = this.$refs.addCourse.submit()
      if (submit) {
        const { courseId, clazzId, classsroomId, teacherId, courseDate, helperTeacherIds, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList, date, courseTimePeriodIdList, weekdayList } = submit
        if (this.currentCourse.isBatch) {
          createBatchScheduleOfCourse({
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
            this.classRoomId = 0
            this.init()
          })
        } else {
          createScheduleOfCourse({
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
            this.classRoomId = 0
            this.init()
          })
        }
      }
    },
    // 更新课程
    handleUpdateCourse () {
      const submit = this.$refs.addCourse.submit()
      if (submit) {
        const { courseManagementId, courseDate, courseId, clazzId, classsroomId, teacherId, helperTeacherIds, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList } = submit
        updateScheduleOfCourse({
          courseManagementId,
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
          this.currentCourse.courseManagementId = res.data.courseManagementId
          this.$message.success('操作成功')
          this.editable = false
          this.init()
        })
      }
    },
    doDetail (course) {
      this.currentCourse = course
      this.showCourseDetail = true
    },
    // 复制课程
    doCopy (course) {
      this.currentCourse = course
      this.copyCourse.visible = true
      this.copyCourse.title = '复制单节课程'
    },
    doRemove (course) {
      console.log('course.courseManagementId: ', course.courseManagementId)
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该课程吗？',
        content: '删除后无法恢复，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeCourseById({ courseManagementId: course.courseManagementId }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    handleCopyCourse () {
      this.$refs.copyCourseForm.$children[0].validate(valid => {
        const { targetDate, copyFormalChild, copyExpChild, courseTimePeriodId } = this.copyCourse
        console.log('valid: ', valid)
        if (valid) {
          if (this.currentCourse.courseManagementId) {
            // 有id复制单节课程
            createCopyCourse({
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
              this.copyCourse.targetDate = ''
              this.copyCourse.courseTimePeriodId = ''
              this.$refs.copyCourseForm.$children[0].resetFields()
            })
          } else {
            // 否则复制单日课程
            createCopyCourseForDay({ copyFormalChild, targetDate, sourceDate: this.currentDayDate }).then(res => {
              this.copyCourse.visible = false
              this.$message.success('操作成功')
              this.init()
              this.copyCourse.targetDate = ''
              this.copyCourse.courseTimePeriodId = ''
              this.$refs.copyCourseForm.$children[0].resetFields()
            })
          }
        }
      })
    },
    copyDayCourse () {
      this.copyWeekCourse = this.$options.data().copyWeekCourse
      this.copyWeekCourse.visible = true
    },
    handleCopyWeekCourse () {
      const { date, copyFormalChild } = this.copyWeekCourse
      if (!date.length) {
        return
      }
      createCheckCourseOverrideForBatch({
        copyFormalChild,
        targetStartDate: parseTime(date[0], '{y}-{m}-{d}'),
        targetEndDate: parseTime(date[1], '{y}-{m}-{d}'),
        sourceStartDate: this.currentWeekDate
      }).then(res => {
        if (res.data) {
          this.$etmTip.init({
            type: 'error',
            title: '该日期已有排课, 是否覆盖？',
            content: '覆盖后将无法撤销，是否继续操作？',
            confirmBtn: '确定',
            cancelBtn: '取消',
            cancel: () => {
              this.$etmTip.close()
            },
            confirm: () => {
              this.$etmTip.close()
              createCopyWeekCourse({
                sourceStartDate: this.currentWeekDate,
                targetStartDate: date[0],
                targetEndDate: date[1],
                copyFormalChild
              }).then(res => {
                this.$message.success('操作成功')
                this.copyWeekCourse.visible = false
                this.init()
              })
            }
          })
          this.$etmTip.open()
        } else {
          createCopyWeekCourse({
            sourceStartDate: this.currentWeekDate,
            targetStartDate: date[0],
            targetEndDate: date[1],
            copyFormalChild
          }).then(res => {
            this.$message.success('操作成功')
            this.copyWeekCourse.visible = false
            this.init()
          })
        }
      })
    },
    // 批量排课
    batchScheduling () {
      this.currentCourse.courseManagementId = null
      this.currentCourse.isBatch = true
      this.courseFormVisible = true
    },
    handleCopyDayCourse () {
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
    margin-left: 0;

    ::v-deep .el-button--small {
      display: block;
      margin-left: 8px;
    }

    .el-icon-plus {
      font-weight: bold;
    }
  }

  ::v-deep {
    .layout-body {
      .el-table thead {
        color: #222;

        .cell {
          font-weight: 400;
        }
      }

      .el-table__header-wrapper {
        th {
          border-left: 0;
          border-right: 0;
        }
      }

      .el-table--border {
        border-left: 0;
      }

      .el-table__row {
        td:first-child {
          border-left: 1px solid #ebeef5;
        }

        .cell {
          padding-left: 8px;
          padding-right: 8px;

          .course-item {
            .item {
              margin-bottom: 8px;
              padding: 8px;
            }

            .EtmFieldLabel-wrap {
              padding-bottom: 0;
            }

          }
        }
      }

      .el-table--border::after,
      .el-table--group::after {
        width: 0;
      }

      .toolLeft {
        .EtmScreenTab-wrap {
          margin-bottom: 0;
        }
      }

      .EtmFieldLabel-wrap {
        padding-bottom: 0;
      }

      .item {
        margin-bottom: 8px;
        padding: 8px;
        position: relative;

        .popTip {
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          bottom: 0;
          color: $white;
          cursor: pointer;
          display: none;
          height: 24px;
          justify-content: space-around;
          left: 0;
          position: absolute;
          right: 0;

        }

        &:hover {
          .popTip {
            display: flex;
          }
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

  .tool-bar {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;

    .right {
      align-items: center;
      display: flex;

      ::v-deep {
        .EtmDayChangeTag-wrap {
          margin: 0 0 0 8px;
        }
      }
    }

    ::v-deep .EtmScreenTab-wrap {
      margin-bottom: 0;

      &:first-child {
        margin-right: 16px;
      }
    }
  }
}
</style>
