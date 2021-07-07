<template>
  <div class="eduDegreeList-wrap-side">
    <div class="course-info">
      <div class="course-name">
        <div class="name">{{ propDetailData.courseName }}({{ propDetailData.startTime }}~{{ propDetailData.endTime }})</div>
        <div class="date">{{ propDetailData.date }}</div>
      </div>
      <div class="member">
        <div><span class="current-number">{{ propDetailData.currentNumber }}</span>/{{ propDetailData.fullNumber }}</div>
        <div>实际/容量</div>
      </div>
    </div>
    <etm-title :border="false"> 班级信息</etm-title>
    <status-item style="margin-bottom: 16px;" :data="propDetailData" :prop="propData" />
    <etm-title :border="false">
      <div style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
        <span>学员列表</span>
        <span class="add-customer" @click="displayStudent"><i
          class="el-icon-plus"
          style="margin-right: 5px;"
        />增加学员</span>
      </div>
    </etm-title>

    <div class="scroll-box">
      <div class="student-list-box">
        <div v-for="(student, index) of propDetailData.customerList" :key="index" class="student-list">
          <div class="student-avatar">
            <img v-if="student.avatar" :src="student.avatar" :alt="student.avatar">
            <div v-else class="name2img">{{ student.customerName | name2img }}</div>
          </div>
          <div class="student-name">{{ student.customerName }}
            <span :class="['label', computedClass(student.attendanceStatus).className]">{{ computedClass(student.attendanceStatus).label }}</span>
          </div>
          <span class="btn-del" @click="delStudent(student)"> <i
            class="el-icon-delete"
            style="margin-right: 5px;"
          />删除</span>
        </div>

      </div>
    </div>

    <etm-pop
      :visible="visible"
      title="新增学员"
      pop="simple"
      cancel-btn="取消"
      @confirm="confirm"
      @close="visible = false"
      @cancel="visible = false"
    >
      <etm-form type="dialog">
        <el-form-item label="学员">
          <el-select v-model="studentId" filterable>
            <el-option v-for="(student, index) of students" :key="index" :label="student.label" :value="student.value" />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>

</template>
<script>
import StatusItem from '@/views/sacc/attendance/components/statusItem'
import { delStudentByPositionId, postStudentToPosition, queryHasMemberOfCourseTime } from '@/api/neuroo/edu/courseManage'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'CourseDetail',
  components: { EtmPop, StatusItem },
  mixins: [baseMixin],
  props: {
    propData: {
      type: Array,
      default() {
        return []
      }
    },
    propDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    schoolId: {
      type: [String, Number],
      default: ''
    },
    scheduleId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      studentId: '',
      students: [],
      propDetailData: this.propDetail
    }
  },
  watch: {
    propDetail(value) {
      this.propDetailData = value
    },
    schoolId: {
      handler() {
        queryHasMemberOfCourseTime({ schoolId: this.schoolId }).then(res => {
          this.students = this.convertDataToOptions(res.data, 'customerName', 'customerId')
        })
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    computedClass(enumName) {
      /**
       * NORMAL 正常
       * ABSENCE 缺勤
       * REQUEST_FOR_LEAVE 请假
       * NOT_LEFT 未离园
       * NON_ATTENDANCE_DAY 无排课日
       */
      const statusMap = {
        NORMAL: {
          label: '正常',
          className: 'success'
        },
        ABSENCE: {
          label: '缺勤',
          className: 'error'
        },
        REQUEST_FOR_LEAVE: {
          label: '请假',
          className: 'warn'
        },
        NOT_LEFT: {
          label: '未离园',
          className: 'info'
        }
      }
      return statusMap[enumName] || {}
    },
    displayStudent() {
      this.visible = true
      this.studentId = ''
    },
    delStudent(student) {
      console.log(student)
      this.$confirm('是否删除' + student.customerName + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delStudentByPositionId(student.positionId).then(res => {
          this.$message.success('删除成功')
          this.propDetailData.customerList.splice(this.propDetailData.customerList.findIndex(item => item.positionId === student.positionId), 1)
          this.$emit('update')
        })
      })
    },
    confirm() {
      postStudentToPosition({ customerId: this.studentId, scheduleId: this.scheduleId }).then(res => {
        this.visible = false
        this.$message.success('操作成功')
        this.propDetailData.customerList.push({ ...res.data })
        this.$emit('update')
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .eduDegreeList-wrap-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 55px);

    & /deep/ .EtmTitle-wrap {
      margin-bottom: 0;

      .add-customer {
        @include c_main_color();
        cursor: pointer;
      }
    }

    .course-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 92px;
      padding: 0 24px;
      margin-bottom: 16px;
      box-shadow: 0px 3px 6px 0px rgba(34, 34, 34, 0.1);

      .course-name {
        flex: 1;

        .name {
          font-size: 16px;
          color: $title-color;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .date {
          color: $text-color;
        }
      }

      .member {
        div:first-child {
          margin-bottom: 10px;
        }

        .current-number {
          font-size: 16px;
          color: $title-color;
          font-weight: bold;
        }
      }
    }

    .scroll-box {
      flex: 1;
      overflow: auto;

      .student-list-box {
        padding: 0 24px;

        .student-list {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          border-bottom: 1px solid $divide-color;

          &:hover {
            .btn-del {
              display: block;
            }
          }

          .student-avatar {
            margin-right: 10px;

            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }

            .name2img {
              display: flex;
              align-items: center;
              justify-content: center;
              color: $white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              @include bgc_main_color();
            }
          }

          .label {
            display: inline-block;
            padding: 0 8px;
            border-radius: 2px;
            &.success {
              color: $success-color;
              border: 1px solid $success-color;
            }
            &.warn {
              color: $warn-color;
              border: 1px solid $warn-color;
            }
            &.error {
              color: $error-color;
              border: 1px solid $error-color;
            }
            &.info {
              color: $tip-color;
              border: 1px solid $tip-color;
            }
          }

          .btn-del {
            display: none;
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 26px;
            color: #F43939;
          }
        }
      }
    }
  }
</style>
