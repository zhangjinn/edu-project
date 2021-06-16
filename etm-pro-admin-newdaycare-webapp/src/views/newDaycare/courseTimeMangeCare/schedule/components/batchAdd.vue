<template>
  <div class="addSchedule-wrap">
    <etm-pop
      title="批量添加日程"
      pop="complex"
      :visible="isShow"
      cancel-btn="取消"
      @close="cancel"
      @cancel="cancel"
      @confirm="confirm"
    >
      <div class="addCourse-wrap">
        <etm-form
          ref="etmForm"
          type="dialog"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            label="日程内容"
            prop="scheduleId"
          >
            <el-select v-model="form.scheduleId">
              <el-option
                v-for="(item) of schedule"
                :key="item.caeScheduleId"
                :label="item.caeScheduleName"
                :value="item.caeScheduleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="班主任"
            prop="clazzId"
          >
            {{ form.name }}
          </el-form-item>
          <el-form-item
            label="授课老师"
            prop="teachTeacherId"
          >
            <el-select v-model="form.teachTeacherId">
              <el-option
                v-for="(item,index) of teacherList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="助教老师"
            prop="helperTeacherIds"
          >
            <el-select
              v-model="form.helpTeacherId2"
              multiple
            >
              <el-option
                v-for="(item,index) of teacherList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="起止日期"
            prop="timeStep"
          >
            <el-date-picker
              v-model="form.timeStep"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item
            label="每周重复日"
            prop="weekdayList"
          >
            <!--            <etm-check-box :check-list="checkList" @change="weekChange" />-->
            <el-select
              v-model="form.weekdayList"
              multiple
            >
              <el-option
                v-for="(item, index) in checkList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="日程时段"
            prop="courseTimePeriodIdList"
          >
            <!--            <etm-check-box :check-list="list" @change="dayChange" />-->
            <el-select
              v-model="form.courseTimePeriodIdList"
              multiple
            >
              <el-option
                v-for="(item, index) in list"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="设置颜色"
            prop="colorCode"
          >
            <etm-color v-model="form.colorCode" />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
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
import { queryScheduleSelect, createMultipleCreate, createCheckBatchAdd } from '@/api/newDaycare/nurseSchedule'
import { parseTime } from '@/utils'
// import EtmCheckBox from '@/views/guardcare/edu/scheduleManage/components/EtmCheckBox.vue'

export default {
  name: 'AddSchedule',
  components: {
    EtmColor
    // EtmCheckBox
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      list: [],
      isShow: false,
      schedule: [],
      checkList: [
        {
          name: '周一',
          value: 0
        },
        {
          name: '周二',
          value: 1
        },
        {
          name: '周三',
          value: 2
        },
        {
          name: '周四',
          value: 3
        },
        {
          name: '周五',
          value: 4
        },
        {
          name: '周六',
          value: 5
        },
        {
          name: '周日',
          value: 6
        }
      ],
      color: 'rgb(30, 144, 255)',
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
        helpTeacherId: null,
        teachTeacherId: null,
        name: '',
        date: null,
        timePeriodId: null,
        remark: '',
        helpTeacherId2: [],
        colorCode: null,
        startDate: null,
        timeStep: [],
        endDate: null,
        weekdayList: [],
        courseTimePeriodIdList: []
      },
      rules: {
        scheduleId: { required: true, message: '请选择日程' },
        courseTimePeriodIdList: { required: true, message: '请选择日程时段' },
        weekdayList: { required: true, message: '请选择每周重复日' },
        timeStep: { required: true, message: '请选择起止日期' }
      },

      teacherList: [],
      classList: []
    }
  },
  computed: {},
  watch: {
    props: {
      deep: true,
      handler (n) {
        this.form.clazzId = n.clazz.caeClazzId
        this.form.name = n.clazz.headTeacherName
        this.form.date = n.startWeek
        this.form.clazzTeacherId = n.clazz.headTeacherId

        this.list = n.list.map((cur, index) => {
          return {
            name: cur.label.name,
            value: cur.label.id
          }
        })
      }
    }
  },
  created () {
    queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
      this.teacherList = this.convertDataToOptions(res.data, 'name', 'id')
    })

    // queryScheduleSelect().then(res => {
    //   this.schedule = res.data.map(cur => {
    //     return {
    //       name: cur.caeScheduleName,
    //       value: cur.caeScheduleId
    //     }
    //   })
    // })

    queryScheduleSelect().then(res => {
      this.schedule = res.data
    })
  },
  mounted () {
  },
  methods: {
    // dayChange(event) {
    //   this.form.courseTimePeriodIdList = event
    // },
    // weekChange(event) {
    //   // console.log(event)
    //   this.form.weekdayList = event
    // },
    show () {
      this.isShow = true
    },
    cancel () {
      this.isShow = false
      this.reset()
    },
    reset () {
      this.form = {
        clazzId: null,
        scheduleId: null,
        clazzTeacherId: null,
        helpTeacherId: null,
        teachTeacherId: null,
        name: '',
        date: null,
        timePeriodId: null,
        remark: '',
        colorCode: null,
        startDate: null,
        timeStep: [],
        endDate: null,
        weekdayList: [],
        courseTimePeriodIdList: []
      }
      this.$refs.etmForm.$children[0].resetFields()
    },
    confirm () {
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          this.form.helpTeacherId = (this.form.helpTeacherId2 || []).join(',')
          this.form.startDate = parseTime(this.form.timeStep[0].getTime(), '{y}-{m}-{d}')
          this.form.endDate = parseTime(this.form.timeStep[1].getTime(), '{y}-{m}-{d}')

          new Promise(resolve => {
            createCheckBatchAdd(this.form).then(res => {
              if (res.data) {
                this.$etmTip.init({
                  type: 'warn',
                  title: '将覆盖原有日程，是否继续！',
                  content: '会清空当前添加的项目',
                  confirmBtn: '确定',
                  cancelBtn: '取消',
                  cancel: () => {
                    this.$etmTip.close()
                  },
                  confirm: () => {
                    resolve()
                    this.$etmTip.close()
                  }
                })
                this.$etmTip.open()
              } else {
                resolve()
              }
            })
          }).then(res => {
            createMultipleCreate(this.form).then(res => {
              this.cancel()
              this.$message.success('批量添加日程成功')
              this.$emit('update', {})
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
