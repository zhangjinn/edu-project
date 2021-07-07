<template>
  <div class="addForm-wrap">

    <etm-form ref="etmForm" type="dialog" :model="form" :rules="rules">
      <el-form-item label="日程内容" prop="scheduleId">
        <el-select v-model="form.scheduleId">
          <el-option
            v-for="(item) of schedule"
            :key="item.caeScheduleId"
            :label="item.caeScheduleName"
            :value="item.caeScheduleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任" prop="clazzId">
        {{ props.name }}
      </el-form-item>
      <el-form-item label="上课老师" prop="teacherId">
        <el-select v-model="form.teachTeacherId">
          <el-option
            v-for="(item,index) of teacherList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="助教老师" prop="helperTeacherIds">
        <el-select v-model="form.helpTeacherId2" multiple>
          <el-option
            v-for="(item,index) of teacherList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="设置颜色" prop="colorCode">
        <etm-color v-model="form.colorCode" />
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
/**
 * addSchedule create by Administrator
 * createTime 2020/9/22 11:41
 */

import baseMixin from '@/layout/mixin/baseMixin'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import EtmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor'
import { queryScheduleSelect } from '@/api/newDaycare/nurseSchedule'

export default {
  name: 'AddForm',
  components: {
    EtmColor
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    props: {
      type: Object,
      default() {
        return {
          name: ''
        }
      }
    }
  },
  data() {
    return {
      isShow: false,
      color: 'rgb(30, 144, 255)',
      schedule: [],
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
      form: {
        clazzId: null,
        scheduleId: null,
        clazzTeacherId: null,
        teachTeacherId: null,
        helpTeacherId2: null,
        date: null,
        timePeriodId: null,
        remark: '',
        colorCode: ''
      },
      rules: {
        scheduleId: { required: true, message: '请选择日程' }
      },
      teacherList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
      this.teacherList = this.convertDataToOptions(res.data, 'name', 'id')
    })
    queryScheduleSelect().then(res => {
      this.schedule = res.data
    })
  },
  mounted() {
  },
  methods: {
    reset() {
      this.form = {
        clazzId: null,
        scheduleId: null,
        clazzTeacherId: null,
        teachTeacherId: null,
        helpTeacherId2: null,
        date: null,
        timePeriodId: null,
        remark: '',
        colorCode: ''
      }
      this.$refs['etmForm'].$children[0].resetFields()
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.etmForm.$children[0].validate(valid => {
          if (valid) {
            resolve(this.form)
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addForm-wrap {

}
</style>
