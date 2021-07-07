<template>
  <div class="timetable">
    <EtmCalendar @input="queryCourseContent">
      <template
        slot="dateCell"
        slot-scope="{data}"
      >
        <div class="cellwrap">
          <div class="day">
            {{ data.day.slice(-2) }}
          </div>
          <p v-if="getContentByDay(data.day).holiday && !getContentByDay(data.day).courseName" class="rest">园区休息</p>
          <div>
            <ul v-show="getContentByDay(data.day).clazzName && getContentByDay(data.day).courseName">
              <li>{{ getContentByDay(data.day).clazzName }} {{ getContentByDay(data.day).courseName }}<i class="iconfont" @click.stop="deleteCourse(data)">&#xe64e;</i></li>
            </ul>
            <span v-show="!getContentByDay(data.day).courseName" class="add" @click.stop="editCell(data)">
              <EtmFontIcon name="plus" />添加
            </span>
          </div>
        </div>
      </template>
    </EtmCalendar>
    <Etm-pop
      :visible="pop"
      pop="simple"
      :title="`添加课程(${selectDate}, ${name}宝宝)`"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div>
        <etm-form ref="form" :rules="rules" :model="formData" type="dialog">
          <el-form-item label="上课班级" prop="class">
            <el-select v-model="formData.class" placeholder="请选择上课班级" @change="queryCourse">
              <el-option v-for="(clazz, index) in classList" :key="index" :label="clazz.clazzName" :value="clazz.clazzId" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程选择" prop="course">
            <el-select v-model="formData.course" placeholder="请选择课程" @change="selectCourse">
              <el-option v-for="(course, index) in courseList" :key="index" :label="course.courseName" :value="course.scheduleId" />
            </el-select>
          </el-form-item>
        </etm-form>
      </div>
    </Etm-pop>
  </div>
</template>

<script>
import EtmCalendar from './components/EtmCalendar'
import EtmFontIcon from '@/components/EtmFontIcon/index'
import EtmPop from '@/layout/main/EtmPop'
import { queryTimeTableContent, deletTimeTableCourse, getClazzList, getCourseList, addCourse } from '@/api/neuroo/memberManage'
import { getStartDateAndEndDateByMonth } from '@/utils/date'
export default {
  components: {
    EtmFontIcon,
    EtmCalendar,
    EtmPop
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    id: {
      type: [String, Number]
    },
    // eslint-disable-next-line vue/require-default-prop
    name: {
      type: String
    }
  },
  data() {
    return {
      pop: false,
      formData: {
        class: '',
        course: ''
      },
      rules: {
        class: [
          { required: true, message: '请选择上课班级', trigger: 'change' }
        ],
        course: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ]
      },
      timeTableData: [],
      selectDate: '',
      current: null,
      classList: [],
      courseList: []
    }
  },
  methods: {
    refresh() {
      this.queryCourseContent()
      getClazzList(localStorage.getItem('memberManage_neuroo_schoolId')).then(res => {
        this.classList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getContentByDay(day) {
      day = day.slice(-5)
      if (this.timeTableData.length) {
        for (let i = 0; i < this.timeTableData.length; i++) {
          if (this.timeTableData[i].date === day) {
            return this.timeTableData[i]
          }
        }
        return {}
      } else {
        return {}
      }
    },
    queryCourseContent(e, force) {
      if (e && !force) {
        if (this.current && (e.getMonth() === this.current.getMonth())) {
          return
        }
      }
      let dateObj
      this.current = e || new Date()
      if (e) {
        dateObj = getStartDateAndEndDateByMonth(e.getMonth() + 1)
      } else {
        dateObj = getStartDateAndEndDateByMonth()
      }
      queryTimeTableContent({
        customerId: this.id,
        startDate: dateObj.startDate,
        endDate: dateObj.endDate
      }).then(res => {
        const { data } = res
        this.timeTableData = data
      }).catch(err => {
        console.log(err)
      })
    },
    queryCourse(v) {
      getCourseList({ clazzId: v, date: this.selectDate }).then(res => {
        this.courseList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.formData.course = ''
    },
    selectCourse() {
      if (!this.formData.class) {
        this.$message({
          type: 'warning',
          message: '请先选择班级'
        })
        this.formData.course = ''
      }
    },
    editCell(data) {
      this.selectDate = data.day
      this.handlePopOpen()
    },
    deleteCourse(data) {
      this.selectDate = data.day
      const dateData = this.getContentByDay(data.day)
      this.$etmTip.init({
        type: 'warn',
        title: `确认要删除${this.name}的${this.selectDate}的课程？`,
        content: `${dateData.clazzName}，${dateData.courseName}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: this.handleTipConfirm,
        cancel: this.handleTipCancel
      })
      this.$etmTip.open()
    },
    handleTipConfirm() {
      deletTimeTableCourse(this.getContentByDay(this.selectDate).positionId).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.queryCourseContent(this.current, true)
      }).catch(err => {
        console.log(err)
      })
      this.handleTipCancel()
    },
    handleTipCancel() {
      this.$etmTip.close()
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
      this.$refs.form.$children[0].resetFields()
    },
    handlePopCancel() {
      this.courseList = []
      this.handlePopClose()
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          addCourse({
            scheduleId: this.formData.course,
            customerId: this.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.handlePopClose()
            this.queryCourseContent(this.current, true)
          }).catch(err => {
            console.log(err)
            this.handlePopClose()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.timetable {
  /*height: calc(100vh - 206px);*/
  /*padding-bottom: 16px;*/
  /*overflow-y: auto;*/
  /*& >>> .el-calendar__header {*/
  /*  border-bottom: none;*/
  /*}*/
  /*& >>> .el-calendar__body {*/
  /*  padding: 0 20px 16px;*/
  /*}*/
  & >>> .el-calendar-table {
    td.is-selected {
      @include bgc_white();
    }
    .el-calendar-day {
      min-height: 120px;
      padding: 10px!important;
      &:hover {
        cursor: default;
        @include bgc_white();
      }
    }
  }
  & >>> .el-calendar-table td.is-today {
    .day {
      @include c_main_color();
    }
  }
  .cellwrap {
    height: 100%;
    position: relative;
    .rest {
      @include c_disabled_color();
    }
    .day {
      @include c_secondary_color();
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        i {
          font-size: 12px;
          &:hover {
            @include c_error_color();
            cursor: pointer;
          }
        }
      }
    }
    .iconfont {
      width: 10px;
    }
    .add {
      position: absolute;
      bottom: -2px;
      left: 5px;
      cursor: pointer;
      font-size: 14px;
      @include c_main_color();
      i {
        transform: translateX(-4px);
        margin-right: 3px;
      }
      &:hover {
        opacity: .7;
      }
    }
  }
}
.el-form {
  & >>> .el-form-item__error {
    left: 78px!important;
  }
}
</style>
