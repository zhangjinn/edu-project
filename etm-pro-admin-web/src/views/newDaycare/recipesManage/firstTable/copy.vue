<template>
  <etm-form ref="form" :model="form" :rules="rules" type="dialog">

    <el-form-item label="选择复制周次" prop="week">
      <el-date-picker
        v-model="form.week"
        format="yyyy-MM月-第WW周"
        type="week"
        placeholder="请选择周"
        :picker-options="{ firstDayOfWeek: 1 }"
        @change="handleChangeWeek"
      />
      <!--      <el-select-->
      <!--        v-model="form.weekRecipeId"-->
      <!--        placeholder="请选择周"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in weekOptions"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value"-->
      <!--        />-->
      <!--      </el-select>-->
    </el-form-item>
    <el-form-item prop="age" label="适用年龄段">
      <el-select
        v-model="form.generationId"
        placeholder="请选择适用年龄段"
      >
        <el-option
          v-for="item in ageOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="remarks" label="备注">
      <el-input v-model="form.remarks" placeholder="最多输入20个字" maxlength="20" />
    </el-form-item>
  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { queryDaycareGenerationList, queryDaycareWeekRecipeList } from '@/api/newDaycare/recipesManage'
import { parseTime } from '@/utils'

export default {
  name: 'Copy',

  mixins: [baseMixin],
  props: {
    // semesterId: {
    //   type: [Number, String],
    //   default: null
    // },
    // weekId: {
    //   type: [Number, String],
    //   default: null
    // }
  },
  data() {
    return {
      rules: {
        week: [
          { required: true, message: '请选择周次', trigger: 'change' }
        ],
        generationId: [
          { required: true, message: '请选择适用年龄段', trigger: 'change' }
        ],
        remarks: [
          { required: true, message: '请填写备注，最多可填写20个字', trigger: 'change' }
        ]
      },
      form: {
        weekRecipeId: '',
        // age: '',
        // startAge: '',
        generationId: '',
        endAge: '',
        remarks: ''
      },
      weekOptions: [],
      ageOption: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      queryDaycareGenerationList().then(res => {
        this.ageOption = res.data.map(v => {
          // return {
          //   label: `${v.startAge}至${v.endAge}`,
          //   value: `${v.startAge}_${v.endAge}`
          // }
          return {
            label: v.generationName,
            value: v.generationId
          }
        })
      })
      queryDaycareWeekRecipeList({}).then((res) => {
        // const { data } = res
        // console.log('res', res)
        this.weekOptions = res.data.content.map(v => {
          return {
            label: v.weekName,
            value: v.weekRecipeId
          }
        })
      })
    },
    handleChangeWeek(v) {
      if (!v) return
      const date = new Date(v)
      // const dateTime = date.getTime()
      // const day = date.getDay()
      let firstDay = new Date(date.getFullYear(), 0, 1)
      const dayOfWeek = firstDay.getDay()
      let spendDay = 1
      if (dayOfWeek !== 0) spendDay = 7 - dayOfWeek + 1
      firstDay = new Date(date.getFullYear(), 0, 1 + spendDay)
      const d = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000)
      const week = Math.ceil(d / 7) + 1

      const day = date.getDay()
      const startTimeNum = date.getTime() - (day - 1) * 86400000
      const endTimeNum = date.getTime() + (7 - day) * 86400000

      // const startTimeNum = date.valueOf() - (6 - spendDay) * 86400000
      // const endTimeNum = date.valueOf() + spendDay * 86400000
      this.form.startDate = parseTime(startTimeNum, '{y}-{m}-{d}')
      this.form.endDate = parseTime(endTimeNum, '{y}-{m}-{d}')
      this.form.weekName = this.form.startDate + '至' + this.form.endDate + ' ' + week + '周'
      // console.log(this.form.weekName)
    },
    handleSelectAge(v) {
      console.log(v)
      if (v) {
        const valArr = v.split('_')
        this.form.startAge = valArr[0]
        this.form.endAge = valArr[1]
      }
    }
  }
}
</script>

<style scoped>

</style>
