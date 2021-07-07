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
        {{ form.clazzTeacherName }}
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
        <el-select v-model="form.helpTeacherId" multiple>
          <el-option
            v-for="(item,index) of teacherList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="设置日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item label="日程时段">
        <el-select v-model="form.timePeriodId">
          <el-option v-for="(item, index) in props.timePeriod" :key="index" :value="item.id" :label="item.name" />
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
import EtmColor from '@/views/newDaycare/courseTimeMangeCare/course/components/etmColor'
import { queryScheduleDate, queryScheduleSelect } from '@/api/newDaycare/nurseSchedule'
import { parseTime } from '@/utils'

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
        return {}
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
        scheduleId: { required: true, message: '请选择日程' },
        date: { required: true, message: '请选择日期' },
        timePeriodId: { required: true, message: '请选择日程时段' }
      },
      teacherList: []
    }
  },
  computed: {},
  watch: {
    // props: {
    //   props: {
    //     type: Object,
    //     default() {
    //       return {}
    //     }
    //   }
    // }
  },
  created() {
    queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
      this.teacherList = this.convertDataToOptions(res.data, 'name', 'id')
    })
    queryScheduleSelect().then(res => {
      this.schedule = res.data
    })

    queryScheduleDate(this.props.id).then(res => {
      res.data.helpTeacherId = res.data.helpTeacherId ? res.data.helpTeacherId.split(',').map(cur => {
        return parseInt(cur)
      }) : []
      // res.data.date = parseTime(res.data.date, '{y}-{m}-{d}')
      this.form = res.data
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
            resolve(Object.assign(this.form, { date: parseTime(this.form.date, '{y}-{m}-{d}') }))
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
