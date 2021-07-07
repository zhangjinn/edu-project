<template>
  <div class="addCourse-wrap">
    <etm-form ref="etmForm" type="dialog" :model="courseForm" :rules="rules">
      <el-form-item label="课程名称" required>
        <div class="course-name">

          <el-form-item prop="courseTypeId">
            <el-select v-model="courseForm.courseTypeId" @change="handleCourseTypeChange">
              <el-option v-for="(item,index) of courseTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item prop="courseId">
            <el-select v-model="courseForm.courseId" @change="handleCourseChange">
              <el-option v-for="(item,index) of courseList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

        </div>

      </el-form-item>
      <el-form-item label="课程容量" prop="">
        总学位 {{ courseForm.totalCapacity }} 正式学位 {{ courseForm.formalCapacity }} 试听学位 {{ courseForm.experienceCapacity }}
      </el-form-item>
      <el-form-item label="上课班级" prop="clazzId">
        <el-select v-model="courseForm.clazzId" @change="handleClazzChange">
          <el-option v-for="(item,index) of classList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任" prop="">
        <el-input v-model="courseForm.headTeacherName" disabled placeholder="班主任" />
      </el-form-item>
      <el-form-item label="上课老师" prop="teacherId">
        <el-select v-model="courseForm.teacherId">
          <el-option v-for="(item,index) of teacherList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="助教老师" prop="helperTeacherIds">
        <el-select v-model="courseForm.helperTeacherIds" multiple>
          <el-option v-for="(item,index) of teacherList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="上课教室" prop="classsroomId">
        <el-select v-model="courseForm.classsroomId">
          <el-option v-for="(item,index) of classroomList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <template v-if="!isBatch">
        <el-form-item label="上课时段" prop="courseTimePeriodId">
          <el-select v-model="courseForm.courseTimePeriodId">
            <el-option v-for="(item,index) of courseTimeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="起止日期" prop="date">
          <el-date-picker
            v-model="courseForm.date"
            type="daterange"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
          />
        </el-form-item>
        <el-form-item label="每周重复日" prop="weekdayList">
          <el-select v-model="courseForm.weekdayList" multiple placeholder="请选择">
            <el-option
              v-for="item in weekdayList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上课时段" prop="courseTimePeriodIdList">
          <el-select v-model="courseForm.courseTimePeriodIdList" multiple>
            <el-option
              v-for="(item,index) of courseTimePeriodIdList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="设置颜色" prop="colorCode">
        <etm-color v-model="courseForm.colorCode" />
      </el-form-item>
      <el-form-item label="学员/容量" prop="colorCode">
        <span>{{ courseForm.formalChildIdList.length + courseForm.expChildIdList.length }}/{{
          courseForm.totalCapacity
        }}</span>
      </el-form-item>
    </etm-form>

    <template v-if="!!courseForm.courseId">
      <etm-title border show-toggle open-text="展开" close-text="收起" @toggle="toggle('showTable1',$event)">
        学员/试听学位 {{ courseForm.expChildIdList.length }}/{{ courseForm.experienceCapacity }}
        <etm-text slot="tool" @click="cancelAll('expChildIdList')">取消所有排课</etm-text>
      </etm-title>
      <el-collapse-transition>
        <div v-show="showTable1" style="margin-bottom: 16px;">
          <etm-table :data="courseForm.expChildIdList">
            <el-table-column slot="left" label="姓名" prop="childName" />
            <el-table-column slot="left" label="性别" prop="gender" />
            <el-table-column slot="left" label="年龄" prop="age" />
            <el-table-column slot="left" label="操作">
              <template v-slot="{row}">
                <etm-text style="margin: 0;" type="primary" @click="cancelCourse(row,courseForm.expChildIdList)">取消排课
                </etm-text>
              </template>
            </el-table-column>
          </etm-table>
          <el-button @click="handleShowAddExpChild">添加试听学员</el-button>
        </div>

      </el-collapse-transition>
    </template>

    <template v-if="!!courseForm.courseId">
      <etm-title border show-toggle open-text="展开" close-text="收起" @toggle="toggle('showTable2',$event)">
        学员/正式学位 {{ courseForm.formalChildIdList.length }}/{{ courseForm.formalCapacity }}
        <etm-text slot="tool" @click="cancelAll('formalChildIdList')">取消所有排课</etm-text>
      </etm-title>
      <el-collapse-transition>
        <div v-show="showTable2" style="margin-bottom: 16px;">
          <etm-table :data="courseForm.formalChildIdList">
            <el-table-column slot="left" label="姓名" prop="childName" />
            <el-table-column slot="left" label="性别" prop="gender" />
            <!--<el-table-column slot="left" label="班级" prop="className" />-->
            <el-table-column slot="left" label="年龄" prop="age" />
            <el-table-column slot="left" label="操作">
              <template v-slot="{row}">
                <etm-text style="margin: 0;" type="primary" @click="cancelCourse(row,courseForm.formalChildIdList)">
                  取消排课
                </etm-text>
              </template>
            </el-table-column>
          </etm-table>
          <el-button @click="handleShowAddFormalChild">添加正式学员</el-button>
        </div>
      </el-collapse-transition>
    </template>

    <!--添加体验学员-->
    <etm-pop
      title="添加试听学员"
      pop="big"
      :visible.sync="showChildTable1"
      @close="showChildTable1 = false"
      @cancel="showChildTable1 = false"
      @confirm="handleChildTable1"
    >
      <template v-if="showChildTable1">
        <etm-tool-bar v-model="formData1" @search="searchTable1" />
        <div style="margin-bottom: 16px;">已选择 {{ selectedTable1.length }}</div>
        <etm-table :data="tableData3" selection @selection-change="(e) => selectedTable1 = e">
          <el-table-column slot="left" label="学员姓名" prop="childName" />
          <el-table-column slot="left" label="年龄" prop="age" />
          <el-table-column slot="left" label="联系人姓名" prop="parentName" />
          <el-table-column slot="left" label="联系人电话" prop="telephone" />
          <el-table-column slot="left" label="性别" prop="gender" />
        </etm-table>
      </template>
    </etm-pop>

    <!--添加正式学员-->
    <etm-pop
      title="添加正式学员"
      pop="big"
      :visible.sync="showChildTable2"
      @close="showChildTable2 = false"
      @cancel="showChildTable2 = false"
      @confirm="handleChildTable2"
    >
      <etm-tool-bar v-model="formData2" @search="searchTable2" />
      <span>已选择 {{ selectedTable2.length }}</span>
      <etm-table :data="childTable2" selection @selection-change="(e) => selectedTable2 = e">
        <el-table-column slot="left" label="学员姓名" prop="childName" />
        <el-table-column slot="left" label="年龄" prop="age" />
        <el-table-column slot="left" label="签单课程" prop="courseName" />
        <el-table-column slot="left" label="联系人姓名" prop="parentName" />
        <el-table-column slot="left" label="联系人电话" prop="telephone" />
        <el-table-column slot="left" label="性别" prop="gender" />
      </etm-table>
    </etm-pop>

  </div>
</template>

<script>/**
 * addCourse create by haijinsha
 * createTime 2020/9/15 16:12
 */
import { queryEarlyCourseList, queryEarlyCourseTypeList } from '@/api/newDaycare/courseManage'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryClassroomList, queryTeachClasses } from '@/api/newDaycare/classes'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import { queryCourseDetailById, queryScheduleCourseTime } from '@/api/newDaycare/scheduleManage'
import EtmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor'
import { unique } from '@/utils/arrUtils'
import { queryChildHaveCourse, queryChildNotInPool } from '@/api/newDaycare/childManage'
import { parseTime } from '@/utils'

export default {
  name: 'AddCourse',
  components: { EtmColor },
  filters: {},
  mixins: [baseMixin],
  props: {
    courseManagementId: {
      type: [Number, String],
      required: false,
      default: ''
    },
    classRoomId: {
      type: [Number, String],
      default: 0
    },
    date: {
      type: [String, Number],
      required: false,
      default: ''
    },
    isBatch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      color: 'rgb(30, 144, 255)',
      courseDate: this.date,
      colorFormat: {
        type: String,
        default: 'rgb'
      },
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      courseForm: {
        courseId: '',
        clazzId: '',
        courseTypeId: '',
        classsroomId: '',
        teacherId: '',
        helperTeacherIds: '',
        courseDate: '',
        colorCode: '',
        courseTimePeriodId: '',
        formalChildIdList: [],
        expChildIdList: [],
        experienceCapacity: 0,
        formalCapacity: 0,
        totalCapacity: 0,
        weekdayList: [],
        courseTimePeriodIdList: []
      },
      rules: {
        courseId: { required: true, message: '请选择课程', trigger: 'change' },
        courseTypeId: { required: true, message: '请选择课程名', trigger: 'change' },
        clazzId: { required: true, message: '请选择班级', trigger: 'change' },
        classsroomId: { required: true, message: '请选择教室', trigger: 'change' },
        courseTimePeriodId: { required: true, message: '请选择时段', trigger: 'change' },
        courseTimePeriodIdList: { type: 'array', required: true, message: '请选择时段', trigger: 'change' },
        weekdayList: { type: 'array', required: true, message: '请选择星期', trigger: 'change' },
        date: { required: true, message: '请选择日期', trigger: 'change' }
      },
      courseTypeList: [],
      courseOriginList: [],
      courseList: [],
      classroomList: [],
      courseTimeList: [],
      teacherList: [],
      classList: [],
      showTable1: true,
      showTable2: true,
      showChildTable1: false,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '班级',
          prop: 'attendance'
        }
      ],

      formData1: [
        {
          type: 'input',
          label: '学员姓名',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          prop: 'telephone',
          type: 'input',
          label: '联系电话',
          value: '',
          props: {
            placeholder: '请输入电话号码'
          }
        }
      ],
      selectedTable1: [],
      showChildTable2: false,
      formData2: [
        {
          type: 'select',
          label: '早教班级',
          value: '',
          prop: 'clazzName',
          props: {
            placeholder: '请选择班级'
          }
        },
        {
          type: 'input',
          label: '学员姓名',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        }
      ],
      childTable2: [],
      childColumns2: [
        {
          label: '学员姓名',
          prop: 'childName'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '签单课程',
          prop: 'course'
        },
        {
          label: '联系人姓名',
          prop: 'parentName'
        },
        {
          label: '联系人电话',
          prop: 'parentPhone'
        },
        {
          label: '性别',
          prop: 'gender'
        }
      ],
      selectedTable2: [],
      weekdayList: [
        {
          label: '星期一',
          value: 0
        },
        {
          label: '星期二',
          value: 1
        },
        {
          label: '星期三',
          value: 2
        },
        {
          label: '星期四',
          value: 3
        },
        {
          label: '星期五',
          value: 4
        },
        {
          label: '星期六',
          value: 5
        },
        {
          label: '星期日',
          value: 6
        }
      ],
      courseTimePeriodIdList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
    console.log('this.isBatch: ', this.isBatch)
  },
  methods: {
    async init() {
      // TODO 别动这个流程
      // 课程类型
      await queryEarlyCourseTypeList().then(res => {
        this.courseTypeList = this.convertDataToOptions(res.data, 'teCourseTypeName', 'teCourseTypeId')
      })
      // 班级列表
      await queryTeachClasses({ clazzName: this.getValueByProp('clazzName', this.formData2) }).then(res => {
        this.classList = this.convertDataToOptions(res.data, 'teClazzName', 'teClazzId')

        const Other = [
          {
            label: '全部早教班级',
            value: 'ALL'
          },
          {
            label: '未分班',
            value: 'NOT_CLAZZ'
          }
        ]
        this.getObjectByProp('clazzName', this.formData2).options = Other.concat(this.classList)
        // this.getObjectByProp('clazzName', this.formData2).options.un
      })
      // 老师列表
      await queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
        this.teacherList = this.convertDataToOptions(res.data, 'name', 'id')
      })
      // 教室
      await queryClassroomList({ roomName: '' }).then(res => {
        this.classroomList = this.convertDataToOptions(res.data, 'roomName', 'roomId')

        if (this.classRoomId) {
          this.courseForm.classsroomId = this.classRoomId
        }
      })
      // 时段
      await queryScheduleCourseTime().then(res => {
        const data = res.data.map(item => {
          item.time = item.startTime + '-' + item.endTime
          return { ...item }
        })
        console.log('data: ', data)
        this.courseTimeList = this.convertDataToOptions(data, 'time', 'courseTimePeriodId')
      })

      if (this.courseManagementId) {
        queryCourseDetailById({ courseManagementId: this.courseManagementId }).then(async res => {
          this.courseForm = Object.assign(this.courseForm, res.data)
          const { helperTeacherIds, courseId, colorCode } = this.courseForm
          this.courseForm.helperTeacherIds = []
          helperTeacherIds && helperTeacherIds.split(',').forEach(item => {
            this.courseForm.helperTeacherIds.push(item && parseInt(item))
          })
          this.courseDate = this.courseForm.courseDate
          await this.handleCourseTypeChange()
          this.courseForm.courseId = courseId
          this.courseForm.colorCode = colorCode
          this.courseForm.expChildIdList = this.courseForm.expChildList.map(item => {
            item.childName = item.name
            item.telePhone = item.parentPhone
            item.childId = item.id
            return {
              ...item
            }
          })
          this.courseForm.formalChildIdList = this.courseForm.formalChildList.map(item => {
            item.childName = item.name
            item.telePhone = item.parentPhone
            item.childId = item.id
            return {
              ...item
            }
          })
          this.handleCourseChange(this.courseForm.courseId)
        })
      }
      queryScheduleCourseTime().then(res => {
        this.courseTimePeriodIdList = res.data.map(item => {
          return {
            label: item.startTime + '-' + item.endTime,
            value: item.courseTimePeriodId,
            ...item
          }
        })
        // this.convertDataToOptions(res.data, 'startTime', 'courseTimePeriodId')
      })
    },
    async handleCourseTypeChange() {
      this.courseList = []
      this.courseForm.courseId = ''
      await queryEarlyCourseList({ teCourseTypeId: this.courseForm.courseTypeId }).then(res => {
        this.courseOriginList = res.data
        this.courseList = this.convertDataToOptions(res.data, 'caeCourseName', 'caeCourseId')
      })
    },
    handleCourseChange(id) {
      const { experienceCapacity, formalCapacity, totalCapacity } = this.courseOriginList.find(item => item.caeCourseId === id)
      this.courseForm.experienceCapacity = experienceCapacity
      this.courseForm.formalCapacity = formalCapacity
      this.courseForm.totalCapacity = totalCapacity
    },
    handleClazzChange(value) {
      const find = this.classList.find(item => item.teClazzId === value)
      this.courseForm.headTeacherName = find.headTeacherName
    },

    toggle(variable, bool) {
      this[variable] = bool
    },
    handleShowChild() {
      this.showChildTable1 = true
    },
    searchTable1() {
      const childName = this.getValueByProp('childName', this.formData1)
      const telephone = this.getValueByProp('telephone', this.formData1)
      queryChildNotInPool({ childName, telephone }).then(res => {
        this.tableData3 = res.data.map(item => {
          item.gender = item.gender === 'MALE' ? '男' : '女'
          return item
        })
      })
    },
    searchTable2() {
      const courseType = this.getValueByProp('clazzName', this.formData2)
      const require = {
        childName: this.getValueByProp('childName', this.formData2),
        // teClazzId: this.getValueByProp('clazzName', this.formData2),
        courseId: this.courseForm.courseId,
        courseTypeId: this.courseForm.courseTypeId
      }

      if (courseType === 'ALL' || courseType === 'NOT_CLAZZ') {
        require.type = courseType
        require.teClazzId = null
      } else if (courseType) {
        require.type = 'BY_CLAZZID'
        require.teClazzId = this.getValueByProp('clazzName', this.formData2)
      } else {
        require.type = 'ALL'
        require.teClazzId = null
      }

      queryChildHaveCourse(require).then(res => {
        this.childTable2 = res.data.map(item => {
          if (item.gender) {
            item.gender = item.gender === 'MALE' ? '男' : '女'
          }
          return item
        })
      })
    },
    handleShowAddExpChild() {
      this.showChildTable1 = true
      // 查询学员
      queryChildNotInPool({
        childName: this.getValueByProp('childName', this.formData1),
        telephone: this.getValueByProp('telephone', this.formData1)
      }).then(res => {
        this.tableData3 = res.data.map(item => {
          if (item.gender) {
            item.gender = item.gender === 'MALE' ? '男' : '女'
          }
          return item
        })
      })
    },
    handleShowAddFormalChild() {
      // 查询学员
      this.showChildTable2 = true
      this.searchTable2()
    },
    // 体验学员
    handleChildTable1() {
      this.showChildTable1 = false
      this.courseForm.expChildIdList = unique([...this.courseForm.expChildIdList, ...this.selectedTable1], 'childId')
      // 删除多出的体验学员
      this.courseForm.expChildIdList = this.courseForm.expChildIdList.splice(0, this.courseForm.experienceCapacity)
      console.log('this.courseForm.expChildIdList: ', this.courseForm.expChildIdList)
      this.selectedTable1.length = 0
    },
    // 正式学员
    handleChildTable2() {
      this.showChildTable2 = false
      this.courseForm.formalChildIdList = unique([...this.courseForm.formalChildIdList, ...this.selectedTable2], 'childId')
      this.courseForm.formalChildIdList = this.courseForm.formalChildIdList.splice(0, this.courseForm.formalCapacity)
      console.log('this.courseForm.formalChildIdList: ', this.courseForm.formalChildIdList)
      this.selectedTable2.length = 0
    },
    cancelCourse(row, data) {
      data.splice(data.findIndex(item => item.childId === row.childId), 1)
    },
    cancelAll(arr) {
      this.courseForm[arr] = []
    },
    submit() {
      let data = null
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          this.courseForm.courseManagementId = this.courseManagementId
          this.courseForm.courseDate = typeof this.courseDate === 'string' ? this.courseDate : parseTime(this.courseDate, '{y}-{m}-{d}')
          data = this.courseForm
        }
      })
      console.log('data: ', data)
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.addCourse-wrap {

  .color {
    display: inline-block;
    width: 30px;
    height: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    margin-right: 8px;
  }

  .course-name {
    display: flex;
    align-items: center;
    justify-content: space-between;

    ::v-deep {
      & > * {
        flex: 1;
      }

      .el-form-item {
        margin: 0 5px;
      }

      .el-form-item:first-child {
        margin-left: 0;
      }

      .el-form-item:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
