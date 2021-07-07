<template>
  <div class="edit">
    <etm-form ref="form" :model="form" type="dialog">
      <el-form-item
        label="上课时段"
        prop="time"
        :rules="formValidate.nullValueRule(true,'请选择上课时段')"
      >
        <el-select v-model="form.time" :disabled="type === 'edit'" placeholder="请选择上课时段">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="schoolDay"
        label="上课日"
        :rules="formValidate.nullValueRule(true,'请选择上课日',['blur', 'change'],'array')"
      >
        <etm-screen-tab v-model="form.schoolDay" :options="checkList" multiple :disabled="type==='edit'" />
      </el-form-item>

      <el-form-item
        label="特色课程"
        prop="featuredPrograms"
        :rules="formValidate.nullValueRule(true,'请选择特色课程')"
      >
        <el-select v-model="form.featuredPrograms" placeholder="请选择特色课程" @change="changeFeaturedPrograms">
          <el-option
            v-for="item in featuredProgramsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="课表颜色"
        prop="color"
        :rules="formValidate.nullValueRule(true,'请选择课表颜色')"
      >
        <etm-color v-model="form.color" />
      </el-form-item>

      <el-form-item
        prop="headTeacher"
        label="授课老师"
      >
        <el-select v-model="form.headTeacher" multiple filterable placeholder="请选择授课老师" @change="changeTeacher(form.headTeacher,'headTeacher')">
          <el-option
            v-for="item in teacherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="teacher"
        label="助教老师"
      >
        <el-select v-model="form.teacher" multiple filterable placeholder="请选择助教老师" @change="changeTeacher(form.teacher,'teacher')">
          <el-option
            v-for="item in teacherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="room"
        label="上课场地"
      >
        <el-select v-model="form.room" placeholder="请选择上课场地">
          <el-option
            v-for="item in roomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="报名幼儿"
      >
        <el-button plain @click="addChild"><i class="el-icon-plus" />&nbsp;&nbsp;添加幼儿</el-button>
      </el-form-item>

      <childTable :table-data="tableData" @handleDelete="handleDelete" />
    </etm-form>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="选择幼儿"
      confirm-btn="确定"
      append-to-body
      @close="popClose"
      @cancel="popClose"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <editChild v-if="popVisible" ref="childPopForm" :select-ids="form.childIds" :special-course-id="form.featuredPrograms" />
      </div>
    </etm-pop>
  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import etmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor.vue'

import childTable from '../registeredChild/childTable'
import editChild from '../registeredChild/editChild'

import { getEmployeeAll } from '@/api/customer'
import { getRoom } from '@/api/guardcare/edu/roomManage'
import { getCourseSpecial } from '@/api/guardcare/edu/courseManage'
import { getScheduleItem, getScheduleTimeSetting } from '@/api/guardcare/edu/scheduleManage'
export default {
  name: 'Edit',
  components: {
    etmColor,
    childTable,
    editChild
  },
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    },
    labelId: {
      type: [Number, String],
      default: null
    },
    colProp: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      formValidate,
      popVisible: false,
      form: {
        time: null,
        featuredPrograms: null,
        color: '',
        room: null,
        schoolDay: [],
        headTeacher: [],
        teacher: [],
        headTeacherInfo: [],
        teacherInfo: [],
        childIds: []
      },
      checkList: [
        {
          name: '星期一',
          value: 'MON'
        },
        {
          name: '星期二',
          value: 'TUES'
        },
        {
          name: '星期三',
          value: 'WED'
        },
        {
          name: '星期四',
          value: 'THUR'
        },
        {
          name: '星期五',
          value: 'FRI'
        },
        {
          name: '星期六',
          value: 'SAT'
        },
        {
          name: '星期日',
          value: 'SUN'
        }
      ],
      timeOptions: [],
      featuredProgramsOptions: [],
      teacherOptions: [],
      roomOptions: [],
      rolesHeadTeacher: [],
      rolesTeacher: [],
      tableData: [],
      selectTableData: []

    }
  },
  created() {
    this.init()
    if (this.type === 'edit') {
      this.detail()
    }
  },
  methods: {
    changeFeaturedPrograms() {
      this.tableData = []
      this.form.childIds = []
    },
    init() {
      // 获取上课场地
      const param = {
        paged: false
      }
      getRoom(param).then((res) => {
        this.roomOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      // 获取市场人员
      getEmployeeAll().then((res) => {
        this.teacherOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      // 获取特色课程
      getCourseSpecial(param).then((res) => {
        this.featuredProgramsOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      // 获取时段
      const paramTime = {
        type: 'SPECIAL_COURSE'
      }
      getScheduleTimeSetting(paramTime).then((res) => {
        this.timeOptions = []
        res.data.map(item => {
          this.timeOptions.push(
            {
              label: item.startTime + '~' + item.endTime,
              value: item.id
            }
          )
        })

        // 添加课程时段默认值
        if (this.labelId) {
          this.form.time = this.labelId
        }
      })

      // 添加课程上课日默认值
      if (this.colProp) {
        this.form.schoolDay = [this.colProp]
      }
    },
    detail() {
      const id = this.itemId
      getScheduleItem(id).then((res) => {
        const { data } = res
        this.form = {
          time: data.scheduleTimeSettingId,
          featuredPrograms: data.specialCourseId,
          color: data.color,
          room: data.roomId,
          schoolDay: data.scheduleWeeks,
          headTeacher: [],
          teacher: [],
          headTeacherInfo: [],
          teacherInfo: [],
          childIds: []
        }
        this.tableData = []
        if (data.children) {
          this.tableData = data.children
          this.tableData.map((val) => {
            val.gender = val.gender === 'MALE' ? '男' : '女'
            this.form.childIds.push(val.id)
          })
        }

        if (data.scheduleRoles) {
          data.scheduleRoles.map((val) => {
            if (val.type === 'LECTURER') {
              const id = val.employeeId
              this.form.headTeacher.push(id)
              this.form.headTeacherInfo.push({
                label: val.employeeName,
                value: id,
                id: val.id
              })
            }
            if (val.type === 'ASSISTANT') {
              const id = val.employeeId
              this.form.teacher.push(id)
              this.form.teacherInfo.push({
                label: val.employeeName,
                value: id,
                id: val.id
              })
            }
          })
        }

        this.rolesHeadTeacher = JSON.parse(JSON.stringify(this.form.headTeacherInfo))
        this.rolesTeacher = JSON.parse(JSON.stringify(this.form.teacherInfo))
      })
    },

    // 修改颜色
    // handleColorChange(val) {
    //   this.form.color = val
    // },

    // 修改老师
    changeTeacher(idArr, type) {
      const that = this
      const arr = []

      idArr.map((val) => {
        let obj = {}
        this.teacherOptions.map((item) => {
          if (item.value === val) {
            obj = {
              value: item.value,
              label: item.label
            }
          }
        })
        arr.push(obj)
      })

      if (type === 'headTeacher') {
        this.form.headTeacherInfo = JSON.parse(JSON.stringify(arr))
        this.form.headTeacherInfo.map((val, index) => {
          that.rolesHeadTeacher.map((v, i) => {
            if (val.value === v.value) {
              val.id = v.id
            }
          })
        })
      } else if (type === 'teacher') {
        this.form.teacherInfo = JSON.parse(JSON.stringify(arr))
        this.form.teacherInfo.map((val, index) => {
          that.rolesTeacher.map((v, i) => {
            if (val.value === v.value) {
              that.form.teacherInfo[index].id = v.id
            }
          })
        })
      }
    },

    // 添加幼儿
    addChild() {
      if (!this.form.featuredPrograms) {
        this.$message.warning('请先选择特色课程')
        return
      }
      this.popVisible = true
    },

    // 删除幼儿
    handleDelete(row, index) {
      this.tableData.splice(index, 1)
      this.form.childIds.splice(index, 1)
    },
    // 弹窗关闭
    popClose() {
      this.popVisible = false
    },
    popConfirm() {
      const formData = this.$refs['childPopForm'].multipleSelection
      this.popVisible = false
      this.tableData = []
      this.form.childIds = []
      formData.map((val) => {
        this.tableData.push({
          name: val.childName,
          id: val.childId,
          clazz: val.clazzName,
          gender: val.gender
        })
        this.form.childIds.push(val.childId)
      })
    }

  }
}
</script>

<style scoped lang="scss">
  .limit{
    color: $secondary-color;
  }
  .priceItem{
    display: flex;

  }
  .edit {
    ::v-deep .EtmScreenTab-wrap {
      margin-bottom: 0;
    }
  }
</style>
