<template>
  <div class="childLogs-wrap">
    <etm-tabs
      v-model="activeTab"
      :show-toggle="false"
    >
      <!--      <el-tab-pane-->
      <!--        label="跟进记录"-->
      <!--        name="follow"-->
      <!--      >-->
      <!--        <div-->
      <!--          v-if="childDetail.followLogList.length"-->
      <!--          class="timeline"-->
      <!--        >-->
      <!--          <el-timeline>-->
      <!--            <el-timeline-item-->
      <!--              v-for="(item, index) of childDetail.followLogList"-->
      <!--              :key="index"-->
      <!--              icon="iconfont iconxiegenjin"-->
      <!--            >-->
      <!--              <template v-if="item.type === '跟进'">-->
      <!--                <div class="title-box">-->
      <!--                  <span class="title">写跟进</span>-->
      <!--                  <span class="time">{{ item.createTime | parseTime }}</span>-->
      <!--                </div>-->
      <!--                <etm-field-label-->
      <!--                  label="跟进内容"-->
      <!--                  type="left"-->
      <!--                >-->
      <!--                  {{ item.content }}-->
      <!--                </etm-field-label>-->
      <!--                <etm-field-label-->
      <!--                  label="跟进时间"-->
      <!--                  type="left"-->
      <!--                >-->
      <!--                  {{ item.followTime | parseTime }}-->
      <!--                </etm-field-label>-->
      <!--                <etm-field-label-->
      <!--                  label="下次跟进时间"-->
      <!--                  type="left"-->
      <!--                >-->
      <!--                  {{ item.nextFollowTime | parseTime }}-->
      <!--                </etm-field-label>-->
      <!--                <etm-field-label-->
      <!--                  label="跟进方式"-->
      <!--                  type="left"-->
      <!--                >-->
      <!--                  {{ item.meansName }}-->
      <!--                </etm-field-label>-->
      <!--                &lt;!&ndash;<etm-field-label label="学员状态">{{ item.childStatus }}</etm-field-label>&ndash;&gt;-->
      <!--                &lt;!&ndash;<etm-field-label label="重要程度">{{ item.childImportance }}</etm-field-label>&ndash;&gt;-->

      <!--                <etm-field-label-->
      <!--                  type="left"-->
      <!--                  label="操作人"-->
      <!--                >-->
      <!--                  {{ item.followerName }}-->
      <!--                </etm-field-label>-->
      <!--                <div-->
      <!--                  v-if="item.imageList && item.imageList.length"-->
      <!--                  class="imgs-box"-->
      <!--                >-->
      <!--                  &lt;!&ndash;<img v-for="(img) of item.imageList" :key="img.url" :src="img.url" :alt="img.name">&ndash;&gt;-->
      <!--                  &lt;!&ndash;                  <el-image&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    v-for="(img) of item.imageList"&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    :key="img.url"&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    style="width: 100px;"&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    :src="img.url"&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    :preview-src-list="[img.url]"&ndash;&gt;-->
      <!--                  &lt;!&ndash;                  />&ndash;&gt;-->
      <!--                  <div-->
      <!--                    v-for="(img) of item.imageList"-->
      <!--                    :key="img.url"-->
      <!--                    style=" margin-bottom: 8px;-->
      <!--  margin-right: 8px;"-->
      <!--                  >-->
      <!--                    <el-image-->
      <!--                      style=" height: 100px;-->
      <!--  width: 100px;"-->
      <!--                      :src="img.url"-->
      <!--                      :preview-src-list="[img.url]"-->
      <!--                      fit="cover"-->
      <!--                    />-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </template>-->
      <!--              <template v-if="item.type === '打电话'">-->
      <!--                <div class="title-box">-->
      <!--                  <span class="title">打电话</span>-->
      <!--                  <span class="time">{{ item.createTime | parseTime }}</span>-->
      <!--                </div>-->
      <!--                <etm-field-label label="播放" />-->
      <!--                <etm-field-label label="操作人">-->
      <!--                  {{ item.followerName }}-->
      <!--                </etm-field-label>-->
      <!--              </template>-->
      <!--              <template v-if="item.type === '发短信'">-->
      <!--                <div class="title-box">-->
      <!--                  <span class="title">发短信</span>-->
      <!--                  <span class="time">{{ item.createTime | parseTime }}</span>-->
      <!--                </div>-->
      <!--                <etm-field-label label="短信内容">-->
      <!--                  {{ item.content }}-->
      <!--                </etm-field-label>-->
      <!--                <etm-field-label label="操作人">-->
      <!--                  {{ item.followerName }}-->
      <!--                </etm-field-label>-->
      <!--              </template>-->
      <!--              <template v-if="item.type === '任务'">-->
      <!--                <div class="title-box">-->
      <!--                  <span class="title">任务</span>-->
      <!--                  <span class="time">{{ item.createTime | parseTime }}</span>-->
      <!--                </div>-->
      <!--                <etm-field-label label="下次跟进时间">-->
      <!--                  {{ item.nextFollowTime | parseTime }}-->
      <!--                </etm-field-label>-->
      <!--                <etm-field-label label="操作人">-->
      <!--                  {{ item.followerName }}-->
      <!--                </etm-field-label>-->
      <!--              </template>-->
      <!--            </el-timeline-item>-->
      <!--          </el-timeline>-->
      <!--        </div>-->
      <!--        <etm-empty v-else />-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane-->
      <!--        label="分配记录"-->
      <!--        name="assign"-->
      <!--      >-->
      <!--        <div-->
      <!--          v-if="childDetail.assignLogList.length"-->
      <!--          class="timeline"-->
      <!--        >-->
      <!--          <el-timeline>-->
      <!--            <el-timeline-item-->
      <!--              v-for="(item,index) of childDetail.assignLogList"-->
      <!--              :key="index"-->
      <!--              icon="iconfont iconfenpei"-->
      <!--            >-->
      <!--              <div class="title-box">-->
      <!--                <span class="title">分配记录</span>-->
      <!--                <span class="time">{{ item.operatorTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
      <!--              </div>-->
      <!--              <etm-field-label-->
      <!--                type="left"-->
      <!--                label="分配前跟进人员"-->
      <!--              >-->
      <!--                {{ item.beforeFollowerName }}-->
      <!--              </etm-field-label>-->
      <!--              <etm-field-label-->
      <!--                type="left"-->
      <!--                label="分配后跟进人员"-->
      <!--              >-->
      <!--                {{ item.afterFollowerName }}-->
      <!--              </etm-field-label>-->
      <!--              <etm-field-label-->
      <!--                type="left"-->
      <!--                label="操作人"-->
      <!--              >-->
      <!--                {{ item.operatorName }}-->
      <!--              </etm-field-label>-->
      <!--            </el-timeline-item>-->
      <!--          </el-timeline>-->
      <!--        </div>-->
      <!--        <etm-empty v-else />-->
      <!--      </el-tab-pane>-->
      <el-tab-pane
        label="订单记录"
        name="order"
      >
        <div
          v-if="childDetail.orderLogList.length"
          class="timeline"
        >
          <el-timeline>
            <el-timeline-item
              v-for="(item,index) of childDetail.orderLogList"
              :key="index"
              :icon="item.type === 'CONTRACT' ?'iconfont iconqianyue': 'iconfont iconyushoudingjin'"
            >
              <div class="title-box">
                <span class="title">{{ item.type === 'CONTRACT' ? '签约' : '预收订金' }}</span>
                <span class="time">{{ item.createDateTime }}</span>
              </div>
              <template v-if="item.type === 'CONTRACT'">
                <etm-field-label
                  type="left"
                  label="合同单号"
                >
                  {{ item.contractNo }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="业务类型"
                >
                  {{
                    item.teachOrCareEnum === 'TEACH' ? '早教' : '托育'
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="合同类型"
                >
                  {{ item.contractType }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="购买项目"
                >
                  {{ item.purchaseItemsName }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="签约日期"
                >
                  {{ item.date }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="有效期"
                >
                  {{ item.validBeginTime }} - {{
                    item.validEndTime
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="经办人"
                >
                  {{ item.createName }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="备注"
                >
                  {{ item.remake }}
                </etm-field-label>
              </template>
              <template v-else>
                <etm-field-label
                  type="left"
                  label="订金单号"
                >
                  {{ item.orderNo }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="订金金额"
                >
                  {{ item.money }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="支付方式"
                >
                  {{ item.paymentName }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="收费日期"
                >
                  {{ item.dateCharge }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="经办人"
                >
                  {{ item.createName }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="备注"
                >
                  {{ item.remake }}
                </etm-field-label>
              </template>
            </el-timeline-item>
          </el-timeline>
        </div>
        <etm-empty v-else />
      </el-tab-pane>
      <!--      <el-tab-pane-->
      <!--        label="上课记录"-->
      <!--        name="classes"-->
      <!--      >-->
      <!--        &lt;!&ndash;        <div style="padding-bottom: 16px;display: flex;align-items: center;justify-content:center;">&ndash;&gt;-->
      <!--        &lt;!&ndash;          <el-radio-group v-model="courseRecordType" size="mini" @change="courseRecord">&ndash;&gt;-->
      <!--        &lt;!&ndash;            <el-radio-button label="TEACH">早教课程</el-radio-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;            <el-radio-button label="CARE">托育课程</el-radio-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;          </el-radio-group>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
      <!--        <div-->
      <!--          v-if="courseRecordLists.length"-->
      <!--          class="timeline"-->
      <!--        >-->
      <!--          <el-timeline>-->
      <!--            <el-timeline-item-->
      <!--              v-for="(item, index) in courseRecordLists"-->
      <!--              :key="index"-->
      <!--              icon="iconfont iconrenwu"-->
      <!--            >-->
      <!--              <div class="title-box">-->
      <!--                <div class="title">-->
      <!--                  {{ item.courseName }}-->
      <!--                  <span :class="[courseType[item.status]]">{{ item.status }}</span>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <etm-field-label-->
      <!--                type="left"-->
      <!--                label="上课时间"-->
      <!--              >-->
      <!--                {{ item.dateStr || item.dateTimeStr }}-->
      <!--              </etm-field-label>-->
      <!--              <etm-field-label-->
      <!--                v-if="courseRecordType === 'CARE'"-->
      <!--                type="left"-->
      <!--                label="班级"-->
      <!--              >-->
      <!--                {{ item.clazzName }}-->
      <!--              </etm-field-label>-->
      <!--              <etm-field-label-->
      <!--                type="left"-->
      <!--                label="班主任"-->
      <!--              >-->
      <!--                {{-->
      <!--                  item.headTeacherName-->
      <!--                }}-->
      <!--              </etm-field-label>-->
      <!--            </el-timeline-item>-->
      <!--          </el-timeline>-->
      <!--        </div>-->
      <!--        <etm-empty v-else />-->
      <!--      </el-tab-pane>-->
      <el-tab-pane
        label="考勤记录"
        name="attendance"
      >
        <div class="attendance">
          <!--          <div-->
          <!--            style="align-items: center;-->
          <!--        display: flex;-->
          <!--        justify-content: center;-->
          <!--        padding-bottom: 16px;"-->
          <!--          >-->
          <!--            <el-radio-group-->
          <!--              v-model="attendanceType"-->
          <!--              size="mini"-->
          <!--            >-->
          <!--              <el-radio-button label="first">-->
          <!--                早教考勤-->
          <!--              </el-radio-button>-->
          <!--              <el-radio-button label="second">-->
          <!--                托育考勤-->
          <!--              </el-radio-button>-->
          <!--            </el-radio-group>-->
          <!--          </div>-->
          <!--          <div-->
          <!--            v-if="attendanceType === 'first'"-->
          <!--            class="timeline"-->
          <!--          >-->
          <!--            <div class="counts">-->
          <!--              <etm-field-label label="出勤天数">-->
          <!--                <span class="yellow fz18">{{ childDetail.attendanceLogTeach.onNum }}</span>-->
          <!--              </etm-field-label>-->
          <!--              <etm-field-label label="缺勤天数">-->
          <!--                <span class="red fz18">{{ childDetail.attendanceLogTeach.absentNum }}</span>-->
          <!--              </etm-field-label>-->
          <!--              <etm-field-label label="请假天数">-->
          <!--                <span class="blue fz18">{{ childDetail.attendanceLogTeach.askNum }}</span>-->
          <!--              </etm-field-label>-->
          <!--              <el-date-picker-->
          <!--                v-model="childDetail.attendanceTeachDate"-->
          <!--                value-format="yyyy-MM-dd"-->
          <!--                type="month"-->
          <!--                :clearable="false"-->
          <!--                @change="handleDateChange('first')"-->
          <!--              />-->
          <!--            </div>-->
          <!--            <el-timeline v-if="childDetail.attendanceLogTeach.getTaattendanceDateList.length">-->
          <!--              <el-timeline-item-->
          <!--                v-for="(item,index) of childDetail.attendanceLogTeach.getTaattendanceDateList"-->
          <!--                :key="index"-->
          <!--                icon="iconfont iconrenwu"-->
          <!--              >-->
          <!--                <div class="title-box">-->
          <!--                  <span class="title">{{ item.date | parseTime('{m}-{d}') }} {{ dateToWeek(item.date) }}</span>-->
          <!--                </div>-->

          <!--                <template v-if="item.getTaattendanceDateItemList">-->
          <!--                  <div-->
          <!--                    v-for="(course, i) of item.getTaattendanceDateItemList"-->
          <!--                    :key="i"-->
          <!--                    class="course-box"-->
          <!--                  >-->
          <!--                    <etm-field-label-->
          <!--                      type="left"-->
          <!--                      label="课程名称"-->
          <!--                    >-->
          <!--                      <div class="course-name-box">-->
          <!--                        <div class="course-name">-->
          <!--                          {{ course.courseName }}-->
          <!--                        </div>-->
          <!--                        <div :class="['tag', translateStatus(course.status).className]">-->
          <!--                          {{ translateStatus(course.status).label }}-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                    </etm-field-label>-->
          <!--                    <etm-field-label-->
          <!--                      v-if="course.startTime && course.endTime "-->
          <!--                      type="left"-->
          <!--                      label="上课时间"-->
          <!--                    >-->
          <!--                      {{ course.startTime }} - {{-->
          <!--                        course.endTime-->
          <!--                      }}-->
          <!--                    </etm-field-label>-->
          <!--                    <etm-field-label-->
          <!--                      v-if="course.clazzName"-->
          <!--                      type="left"-->
          <!--                      label="班级"-->
          <!--                    >-->
          <!--                      {{-->
          <!--                        course.clazzName-->
          <!--                      }}-->
          <!--                    </etm-field-label>-->
          <!--                    <etm-field-label-->
          <!--                      v-if="course.headTeacherName"-->
          <!--                      type="left"-->
          <!--                      label="班主任"-->
          <!--                    >-->
          <!--                      {{-->
          <!--                        course.headTeacherName-->
          <!--                      }}-->
          <!--                    </etm-field-label>-->
          <!--                    <etm-field-label-->
          <!--                      v-if="course.reason"-->
          <!--                      type="left"-->
          <!--                      label="请假类型"-->
          <!--                    >-->
          <!--                      {{ course.reason }}-->
          <!--                    </etm-field-label>-->
          <!--                  </div>-->
          <!--                </template>-->
          <!--                <template v-else>-->
          <!--                  <etm-field-label-->
          <!--                    type="left"-->
          <!--                    label="无排课"-->
          <!--                  />-->
          <!--                </template>-->
          <!--              </el-timeline-item>-->
          <!--            </el-timeline>-->
          <!--            <etm-empty v-else />-->
          <!--          </div>-->
          <!--          v-if="attendanceType === 'second'"-->
          <div
            class="timeline"
          >
            <div class="counts">
              <etm-field-label label="出勤天数">
                <span class="yellow fz18">{{ childDetail.attendanceLogCare.onNum }}</span>
              </etm-field-label>
              <etm-field-label label="缺勤天数">
                <span class="red fz18">{{ childDetail.attendanceLogCare.absentNum }}</span>
              </etm-field-label>
              <etm-field-label label="请假天数">
                <span class="blue fz18">{{ childDetail.attendanceLogCare.askNum }}</span>
              </etm-field-label>
              <el-date-picker
                v-model="childDetail.attendanceCareDate"
                value-format="yyyy-MM-dd"
                :clearable="false"
                type="month"
                @change="handleDateChange('second')"
              />
            </div>
            <el-timeline v-if="childDetail.attendanceLogCare.getTaattendanceDateList.length">
              <el-timeline-item
                v-for="(item,index) of childDetail.attendanceLogCare.getTaattendanceDateList"
                :key="index"
                icon="iconfont iconrenwu"
              >
                <div class="title-box">
                  <div class="title">
                    {{ item.date | parseTime('{m}-{d}') }} {{ dateToWeek(item.date) }}

                    <div
                      v-if="item.status !== 'IN_SCHOOL' && item.status !== 'OUT_SCHOOL'"
                      :class="['tag', translateStatus(item.status).className]"
                    >
                      {{ translateStatus(item.status).label }}
                    </div>
                  </div>
                </div>

                <div class="course-box">
                  <etm-field-label
                    v-if="item.enterTime"
                    type="left"
                    label="到园"
                  >
                    {{ item.enterTime | parseTime('{h}:{i}') }}
                  </etm-field-label>
                  <etm-field-label
                    v-if="item.leaveTime"
                    type="left"
                    label="离园"
                  >
                    {{ item.leaveTime | parseTime('{h}:{i}') }} <span>接送人：{{ item.parentName }}({{ item.relationshipName }})</span>
                  </etm-field-label>
                  <etm-field-label
                    v-if="!item.leaveTime && !item.enterTime"
                    type="left"
                    label="今天无打卡记录"
                  />
                </div>
              </el-timeline-item>
            </el-timeline>
            <etm-empty v-else />
          </div>
        </div>
      </el-tab-pane>
    </etm-tabs>
  </div>
</template>

<script>
/**
 * childLogs create by haijinsha
 * createTime 2020/8/29 15:24
 */

import {
  queryCareCourseRecord,
  queryChildAssignLogList,
  queryChildAttendanceLogListByCare,
  // queryChildAttendanceLogListByTeach,
  queryChildLogsByPanelType,
  queryChildOrderLog,
  queryTeachCourseRecord
} from '@/api/newDaycare/childManage'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
// import { getStartDateAndEndDateByMonth } from '@/utils/date'
import dayjs from 'dayjs'

export default {
  name: 'ChildLogs',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: '',
      required: true
    },
    logType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeTab: 'order',
      attendanceType: 'first',
      classesType: 'first',
      courseRecordType: 'TEACH',
      courseType: {
        已预约: 'BOOKED',
        已签到: 'ATTEND',
        请假: 'LEAVE',
        缺勤: 'ABSENT'
      },
      courseRecordLists: [],
      childDetail: {
        followLogList: [],
        assignLogList: [],
        orderLogList: [],
        attendanceTeachDate: parseTime(new Date(), '{y}-{m}-{d}'),
        attendanceCareDate: parseTime(new Date(), '{y}-{m}-{d}'),
        attendanceLogTeach: {
          getTaattendanceDateList: []
        },
        attendanceLogCare: {
          getTaattendanceDateList: []
        }
      },
      attendance: {
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        startDate: '',
        endDate: ''
      },
      attendanceTeach: {
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        startDate: '',
        endDate: ''
      }
    }
  },
  computed: {},
  watch: {
    childId: {
      handler () {
        this.init()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.handleDateChange(parseTime(new Date(), '{y}-{m}-{d}'))
    this.init()
  },
  methods: {
    init () {
      if (!this.childId) {
        console.log('没有学员ID')
        return false
      }
      queryChildLogsByPanelType({ childId: this.childId, type: 'FOLLOW_UP' }).then(res => {
        this.childDetail.followLogList = res.data
      })
      queryChildAssignLogList({ childId: this.childId }).then(res => {
        this.childDetail.assignLogList = res.data
      })
      queryChildOrderLog({ childId: this.childId }).then(res => {
        console.log('res: ', res)

        const logList = []
        res.data.forEach(item => {
          switch (item.contractType) {
            case 'NEW_SIGNING':
              item.contractType = '新签约'
              break
            case 'TRANSFER_COURSE':
              item.contractType = '转课'
              break
            case 'RENEWAL':
              item.contractType = '续约'
              break
          }

          item.date = item.date && parseTime(item.date, '{y}-{m}-{d}')
          item.validBeginTime = item.validBeginTime && parseTime(item.validBeginTime, '{y}-{m}-{d}')
          item.validEndTime = item.validEndTime && parseTime(item.validEndTime, '{y}-{m}-{d}')
          item.dateCharge = item.dateCharge && parseTime(item.dateCharge, '{y}-{m}-{d}')
          item.createDateTime = item.createDateTime && parseTime(item.createDateTime, '{y}-{m}-{d} {h}:{i}')

          // const includes = ['EARNEST_MONEY', 'CONTRACT']
          if (item.teachOrCareEnum === this.logType) {
            logList.push({ ...item })
          }
        })

        this.childDetail.orderLogList = logList
      })

      this.courseRecord('TEACH')
      this.handleDateChange('first')
      this.handleDateChange('second')
    },
    courseRecord (e) {
      const require = e === 'TEACH' ? queryTeachCourseRecord : queryCareCourseRecord
      // this.courseRecordType = e
      require(this.childId).then(res => {
        this.courseRecordLists = res.data
      })
    },
    translateStatus (status) {
      const statusMap = {
        NOT_ATTENDANCE: {
          label: '未考勤',
          className: 'red'
        },
        SIGN_IN: {
          label: '已签到',
          className: 'yellow'
        },
        ABSENT_FROM_WORK: {
          label: '缺勤',
          className: 'red'
        },
        OUT_SCHOOL: {
          label: '已离园',
          className: 'red'
        },
        IN_SCHOOL: {
          label: '已到园',
          className: 'blue'
        },
        /**
         * 请假不区分请假状态(有效/无效)
         */
        ASK_FOR_LEAVE: {
          label: '请假',
          className: 'blue'
        },
        EFFECTIVE_ASK_FOR_LEAVE: {
          label: '请假',
          className: 'blue'
        }
      }
      return statusMap[status] || { label: '', className: '' }
    },
    handleDateChange (type) {
      // if (type === 'first') {
      //   // 早教
      //   const time = this.childDetail.attendanceTeachDate || new Date()
      //   const startDate = dayjs(time).startOf('month').format('YYYY-MM-DD')
      //   const endDate = dayjs(time).endOf('month').format('YYYY-MM-DD')
      //   this.attendanceTeach.startDate = startDate
      //   this.attendanceTeach.endDate = endDate
      //   queryChildAttendanceLogListByTeach({ childId: this.childId, startDate, endDate }).then(res => {
      //     this.childDetail.attendanceLogTeach = res.data
      //   })
      // } else {
      // 托育
      const time = this.childDetail.attendanceTeachDate || new Date()
      const startDate = dayjs(time).startOf('month').format('YYYY-MM-DD')
      const endDate = dayjs(time).endOf('month').format('YYYY-MM-DD')

      this.attendance.startDate = startDate
      this.attendance.endDate = endDate
      queryChildAttendanceLogListByCare({ childId: this.childId, startDate, endDate }).then(res => {
        this.childDetail.attendanceLogCare = res.data
      })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.childLogs-wrap {
  ::v-deep {
    .EtmTabs-wrap {
      .el-tabs__item {
        .el-tabs__item {
          box-shadow: none;
          outline: none;

          &:focus,
          &:active {
            box-shadow: none;
            outline: none;
          }
        }
      }
    }
  }

  %red {
    color: $color-error;
  }

  %blue {
    color: $color-tip;
  }

  %yellow {
    color: $color-warn;
  }

  .fz18 {
    font-size: 18px;
  }

  .attendance {
    .counts {
      align-content: center;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;

      ::v-deep {
        .EtmFieldLabel-wrap {
          align-items: center;
          padding-bottom: 0;
        }
      }
    }

    .course-box {
      &:not(:last-child) {
        border-bottom: 1px dashed #eee;
        margin-bottom: 16px;
      }

      .course-name-box {
        align-items: center;
        display: flex;

        .tag {
          border-radius: 4px;
          display: inline-flex;
          font-size: 12px;
          margin-left: 8px;
          padding: 0 5px;

          &.red {
            @extend %red;
            border: 1px solid $color-error;
          }

          &.yellow {
            @extend %yellow;
            border: 1px solid $color-warn;
          }

          &.blue {
            @extend %blue;
            border: 1px solid $color-tip;
          }
        }
      }
    }
  }

  .timeline {
    ::v-deep {
      .el-timeline-item {
        padding-bottom: 1px;

        .el-timeline-item__node--normal {
          height: 30px;
          left: 0;
          width: 30px;
        }

        .el-timeline-item__tail {
          border-left: 2px solid #e4e7ed;
          height: 100%;
          left: 14px;
          position: absolute;

        }

        .el-timeline-item__node {
          background-color: $white;

          .iconxiegenjin,
          .iconfenpei,
          .icondadianhua,
          .iconfaduanxin,
          .iconrenwu,
          .iconyushoudingjin,
          .iconqianyue {
            font-size: 26px;
          }

          .iconxiegenjin {
            color: $yellow;
          }

          .iconfenpei {
            color: $blue;
          }

          .icondadianhua {
            color: $blue;
          }

          .iconfaduanxin {
            color: #5dd980;
          }

          .iconrenwu {
            color: #fd6a70;
          }

          .iconqianyue {
            color: #5dd980;
          }

          .iconyushoudingjin {
            color: $yellow;
          }

        }

        .el-timeline-item__wrapper {
          padding-top: 8px;

          .el-timeline-item__content {
            padding-left: 16px;
          }
        }
      }

      .EtmFieldLabel-wrap {
        &:not(:last-child) {
          margin-bottom: 0;
        }
      }
    }

    .title-box {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;

      .title {
        color: $color-title;
        font-size: 16px;

        .tag {
          border-radius: 4px;
          display: inline-flex;
          font-size: 12px;
          margin-left: 8px;
          padding: 0 5px;

          &.red {
            @extend %red;
            border: 1px solid $color-error;
          }

          &.yellow {
            @extend %yellow;
            border: 1px solid $color-warn;
          }

          &.blue {
            @extend %blue;
            border: 1px solid $color-tip;
          }
        }

        span {
          border: 1px solid #ccc;
          border-radius: 4px;
          color: #ccc;
          display: inline-block;
          font-size: 12px;
          margin-left: 8px;
          padding: 0 6px;
        }

        .ATTEND {
          border: 1px solid #ffac4e;
          color: #ffac4e;
        }

        .ABSENT {
          border: 1px solid #f52e2e;
          color: #f52e2e;
        }

        .LEAVE {
          border: 1px solid #1990ff;
          color: #1990ff;
        }
      }

      .time {
        color: $color-info;
      }
    }

    .imgs-box {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 16px;

      img {
        width: 48px;
      }
    }
  }
}
</style>
