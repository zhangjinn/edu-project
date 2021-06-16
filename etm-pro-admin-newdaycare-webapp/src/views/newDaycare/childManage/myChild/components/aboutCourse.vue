<template>
  <div class="aboutCourse-wrap">
    <etm-pop
      :title="title"
      pop="big"
      :visible="isShow"
      cancel-btn="取消"
      @cancel="close"
      @close="close"
      @confirm="confirm"
    >
      <etm-tool-bar
        v-if="isShow"
        v-model="formData_education"
        @reset="reset"
        @search="searchHandle"
      />
      <div class="aboutBody">
        <etm-table
          :data="data"
          :columns="columns"
          @selection-change="choiceChild"
        >
          <etm-table-tool-bar slot="tool">
            <div class="aboutTools">
              <div class="toolItem">
                已选择
                <span class="theme">{{ choiceNumber }}</span>
                节
              </div>
              <div
                v-if="prop.type === 'app'"
                class="toolItem subTool"
              >
                <div>剩余约课课时：</div>
                <div class="toolNumber">
                  <div
                    v-for="(item, index) in remainingCourseLessonMap.slice(0, 3)"
                    :key="index"
                  >
                    <h3>{{ item.value }}</h3>
                    <span>{{ item.name }}</span>
                  </div>
                  <div v-if="remainingCourseLessonMap.length > 3">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="(item, index) in remainingCourseLessonMap.slice(3)"
                          :key="index"
                          class="dropdown"
                        >
                          <div class="otherClass">
                            <div class="ell">
                              {{ item.name }}
                            </div>
                            <span>{{ item.value }}</span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            type="selection"
            :selectable="selectable"
          />
        </etm-table>
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
 * aboutCourse create by Administrator
 * createTime 2020/9/28 16:05
 */
import {
  queryTeachCourse,
  queryCareCourse,
  queryTeachAppCourseLists,
  queryCaseAppCourseLists
} from '@/api/newDaycare/childManage'
import { queryScheduleCourseTime } from '@/api/newDaycare/scheduleManage'
import { queryNursePeriod } from '@/api/newDaycare/nurseSchedule'
import { parseTime } from '@/utils'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'AboutCourse',
  components: {},
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {
          // childId
          // type
          // classType
          // childName
        }
      }
    }
  },
  data () {
    return {
      title: '',
      remainingCourseLessonMap: [],
      isShow: false,
      argument: {},
      choiceIds: [],
      data: [],
      searchKey: {},
      choiceNumber: 0,
      typeApi: {
        TEACH: {
          audi: queryTeachCourse,
          app: queryTeachAppCourseLists
        },
        CARE: {
          audi: queryCareCourse,
          app: queryCaseAppCourseLists
        }
      },
      status: {
        CAN_BE_BOOKED: '可预约',
        BOOKED: '已预约',
        UNAVAILABLE: '无学位'
      },
      argu: {
        startDate: null,
        endDate: null,
        weekdayList: [1, 2, 3, 4, 5, 6, 7],
        childId: null,
        timePeriodId: null,
        courseName: '',
        status: null
      },
      columns: [],
      formData_education: []
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        if (n.childId) {
          this.argument = n
          this.init()
        }
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    init () {
      const prop = this.argument
      // classType teach 早教    care 托育
      // type audi 试听   app 约课

      this.title = (prop.classType === 'TEACH' ? '早教' : '托育') + (prop.type === 'audi' ? '试听' : '约课') + ` (${prop.childName || ''})`

      // 不同类型返回不同搜索框和字段
      this.setColumns()
      this.columns = this.setTableColumns()
      this.getLists()
    },
    setTableColumns () {
      const _result = [{
        label: '上课日期',
        prop: 'date'
      }, {
        label: '课程名称',
        prop: 'courseName',
        width: '120'
      }, {
        label: '班主任',
        prop: 'headTeacher',
        width: '120'
      }, {
        label: '上课老师',
        prop: 'classTeacher',
        width: '120'
      }, {
        label: this.argument.type === 'app' ? '剩余正式学位' : '剩余试听学位',
        prop: 'remainingChildPosition',
        width: '180'
      }, {
        label: '状态',
        prop: 'status',
        width: '120'
      }]

      if (this.argument.classType === 'TEACH') {
        _result.splice(1, 0, {
          label: '上课时段',
          prop: 'timePeriod',
          width: '120'
        })
      }

      return _result
    },
    setColumns () {
      const today = new Date()
      let monthLastDay = new Date()

      monthLastDay.setDate(1)

      monthLastDay = new Date(monthLastDay.getTime() + (24 * 3600 * 32 * 1000))
      monthLastDay.setDate(1)
      monthLastDay = new Date(monthLastDay.getTime() - (24 * 3600 * 1000))

      const columns = [
        {
          label: '上课日期',
          type: 'date',
          value: [parseTime(today, '{y}-{m}-{d}'), parseTime(monthLastDay, '{y}-{m}-{d}')],
          prop: 'time',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        },
        {
          label: '选择星期',
          type: 'select',
          value: [1, 2, 3, 4, 5, 6, 7],
          prop: 'weekdayList',
          props: {
            multiple: true,
            collapseTags: true
          },
          options: [
            {
              label: '星期一',
              value: 1
            },
            {
              label: '星期二',
              value: 2
            },
            {
              label: '星期三',
              value: 3
            },
            {
              label: '星期四',
              value: 4
            },
            {
              label: '星期五',
              value: 5
            },
            {
              label: '星期六',
              value: 6
            },
            {
              label: '星期日',
              value: 7
            }
          ]
        },
        {
          label: '课程',
          type: 'input',
          value: '',
          prop: 'courseName',
          props: {
            placeholder: '请输入课程名称'
          }
        },
        {
          label: '预约状态',
          type: 'select',
          value: '',
          prop: 'status',
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '可预约',
              value: 'CAN_BE_BOOKED'
            },
            {
              label: '已预约',
              value: 'BOOKED'
            },
            {
              label: '无学位',
              value: 'UNAVAILABLE'
            }
          ]
        }
      ]

      this.formData_education = columns

      if (this.argument.classType === 'TEACH') {
        this.$nextTick(() => {
          this.getTimeStep().then(res => {
            this.formData_education.splice(1, 0, {
              label: '上课时段',
              type: 'select',
              prop: 'timePeriodId',
              value: '',
              props: {
                placeholder: '请选择课程时段'
              },
              options: res
            })

            // this.$set(this, 'formData_education', columns)
          })
        })
      }

      // return columns
    },
    getTimeStep () {
      return new Promise(resolve => {
        const require = this.argument.classType === 'TEACH' ? queryScheduleCourseTime : queryNursePeriod
        require().then(res => {
          resolve(res.data.map(cur => {
            return {
              label: `${cur.startTime}-${cur.endTime}`,
              value: cur.courseTimePeriodId || cur.caScourseTimePeriodId
            }
          }))
        })
      })
    },
    close () {
      this.isShow = false
    },
    selectable (row, index) {
      if (row.status === '可预约') {
        return true
      }

      return false
    },
    searchHandle (event) {
      const result = {}
      event.forEach(cur => {
        if (cur.prop === 'time') {
          result.startDate = parseTime(cur.value[0], '{y}-{m}-{d}')
          result.endDate = parseTime(cur.value[1], '{y}-{m}-{d}')
        } else {
          result[cur.prop] = cur.value
        }
      })

      const _result = Object.assign({}, this.argu, result)

      this.getLists(_result)
    },
    getLists (_result) {
      const result = deepClone(_result || this.argu)
      result.childId = this.prop.childId
      result.weekdayList = result.weekdayList.join(',')
      const require = this.typeApi[this.prop.classType][this.prop.type]

      require(result).then(res => {
        const _result = this.prop.type === 'audi' ? res.data : res.data.list
        if (this.prop.type === 'app') {
          this.remainingCourseLessonMap = Object.keys(res.data.remainingCourseLessonMap).map(cur => {
            return {
              name: cur,
              value: res.data.remainingCourseLessonMap[cur]
            }
          })
        }
        this.data = _result.map(cur => {
          // cur.date = parseTime(cur.date, '{y}-{m}-{d} 星期{a}')
          // cur.status = this.status[cur.status]
          cur.remainingChildPosition = cur.remainingAttemptPosition || cur.remainingChildPosition

          return cur
        })
      })
    },
    reset () {
      this.$nextTick(() => {
        if (this.argument.classType === 'TEACH') {
          this.formData_education[2].value = [1, 2, 3, 4, 5, 6, 7]
        } else {
          this.formData_education[1].value = [1, 2, 3, 4, 5, 6, 7]
        }

        const today = new Date()
        let monthLastDay = new Date()

        monthLastDay.setDate(1)

        monthLastDay = new Date(monthLastDay.getTime() + (24 * 3600 * 32 * 1000))
        monthLastDay.setDate(1)
        monthLastDay = new Date(monthLastDay.getTime() - (24 * 3600 * 1000))

        this.formData_education[0].value = [today, monthLastDay]
      })

      this.getLists()
    },
    choiceChild (e) {
      // console.log(e)
      this.choiceNumber = e.length
      // this.choiceIds = e.map(cur => {
      //   return cur.courseManagementId
      // })

      this.choiceIds = e
    },
    show () {
      this.isShow = true
    },

    confirm () {
      this.$emit('getIds', {
        ids: this.choiceIds,
        classType: this.prop.classType,
        id: this.prop.childId,
        type: this.prop.type
      })
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>

.otherClass {
  align-items: center;
  display: flex;
  justify-content: space-around;
  width: 120px;

  .ell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90px;
  }
}

.aboutBody {

  border-top: 1px solid #eee;
  padding-top: 16px;

  .aboutTools {
    align-items: center;
    display: flex;

    .toolNumber {
      > div {
        border-left: 1px solid #eee;
        padding: 0 16px;

        &:first-child {
          border-left: 0;
        }

        &:last-child {
          border-left: 0;
          padding-left: 0;
        }

        span {
          color: #999;
          display: block;
          line-height: 1;
        }

        h3 {
          @include etm-color;
          font-weight: bold;
          line-height: 1.8;

        }
      }
    }

    .toolItem {
      &:first-child {
        margin-right: 16px;
      }

      > span {
        font-weight: bold;
      }

      .theme {
        @include etm_color;
      }
    }

    .subTool {
      align-items: center;
      display: flex;

      .toolNumber {
        align-items: center;
        display: flex;
      }
    }
  }

}

</style>
