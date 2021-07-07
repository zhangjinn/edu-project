<template>
  <etm-form ref="form" :model="form" type="dialog">

    <el-form-item
      label="选择周"
      prop="weekName"
      :rules="formValidate.nullValueRule(true,'请选择周')"
    >
      <el-date-picker
        v-model="form.weekName"
        type="week"
        format="yyyy-MM月-第WW周"
        placeholder="请选择周"
        :picker-options="{ firstDayOfWeek: 1 }"
        @change="handleChangeWeek"
      />
    </el-form-item>

    <el-form-item
      label="适用年龄段"
      prop="generationId"
      :rules="formValidate.nullValueRule(true,'请选择适用年龄段')"
    >
      <el-select
        v-model="form.generationId"
        placeholder="请选择适用年龄段"
        @change="handleChangeGeneration"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="餐次设置"
      prop="meals"
      :rules="mealRule"
    >
      <etm-screen-tab v-model="form.meals" multiple :options="mealsOptions" @change="handleChangeMeals" />
    </el-form-item>
    <el-form-item
      label="备注"
      prop="remarks"
    >
      <el-input
        v-model="form.remarks"
        :rows="3"
        maxlength="20"
        placeholder="最多输入20个字"
        type="textarea"
      />
    </el-form-item>

  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import { queryDaycareGenerationList, queryDaycareMealsList } from '@/api/newDaycare/recipesManage'
import { parseTime } from '@/utils'

export default {
  name: 'EditClass',
  components: {},
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
    }
  },
  data() {
    return {
      formValidate,
      generation: '',
      form: {
        remarks: '',
        weekName: '',
        startDate: '',
        endDate: '',
        meals: [],
        // startAge: '',
        // endAge: '',
        generationId: ''
      },
      options: [],
      mealsOptions: [],
      mealRule: {
        required: true,
        validator: (rule, value, callback) => {
          if (!value || value.length === 0) {
            callback(new Error('请选择餐次设置'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      // 适用年龄段
      queryDaycareGenerationList().then(res => {
        const data = []
        res.data.forEach(v => {
          data.push({
            label: v.generationName,
            value: v.generationId
          })
        })
        this.options = data
      })
    },
    getMealsOptions(mealsType) {
      queryDaycareMealsList(mealsType).then(res => {
        const data = []
        this.form.meals = []
        res.data.forEach(v => {
          data.push({
            name: v.timeQuantumName,
            value: v.timeQuantumId
          })
          this.form.meals.push(v.timeQuantumId)
        })
        this.mealsOptions = data
      })
    },
    handleChangeWeek(v) {
      if (!v) return
      const date = new Date(v)
      // const firstDay = new Date(date.getFullYear(), 0, 1)
      // const dayOfWeek = firstDay.getDay()
      // let spendDay = 1
      // if (dayOfWeek !== 0) spendDay = 7 - dayOfWeek + 1
      // const startTimeNum = date.valueOf() - (6 - spendDay) * 86400000
      // const endTimeNum = date.valueOf() + spendDay * 86400000
      const day = date.getDay()
      const startTimeNum = date.getTime() - (day - 1) * 86400000
      const endTimeNum = date.getTime() + (7 - day) * 86400000
      const startDate = parseTime(startTimeNum, '{y}-{m}-{d}')
      const endDate = parseTime(endTimeNum, '{y}-{m}-{d}')
      this.form.startDate = startDate
      this.form.endDate = endDate
    },
    handleChangeMeals(e) {
      // console.log('handleChangeMeals', e)
      const sortOrder = this.mealsOptions.map(v => v.value)
      this.form.meals = e.sort((a, b) => {
        return sortOrder.indexOf(a) - sortOrder.indexOf(b)
      })
    },
    handleChangeGeneration(e) {
      const label = this.options.find(v => v.value === e).label
      let mealsType
      switch (label) {
        case '乳儿托' :
          mealsType = 'SUCKLING'
          break
        default :
          mealsType = 'STANDARD'
          break
      }
      this.getMealsOptions(mealsType)
    }
  }
}
</script>

<style scoped lang="scss">
.limit{
  color: $secondary-color;
}
</style>
