<template>
  <div class="weekPeriod">
    <el-date-picker
      v-model="weekValue1"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择开始周"
      :picker-options="pickerOptions0"
      @change="changeDate1"
    />
    <span> - </span>
    <el-date-picker
      v-model="weekValue2"
      type="week"
      format="yyyy 第 WW 周"
      value-format="yyyy-MM-dd"
      placeholder="选择结束周"
      :picker-options="pickerOptions1"
      @change="changeDate2"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'WeekPeriod',
  data () {
    return {
      weekValue1: '',
      weekValue2: '',
      pickerOptions0: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          if (this.weekValue2 !== '') {
            const lastDayOfWeek = this.getDayOfWeek(new Date(this.weekValue2), 7)
            return time.getTime() > lastDayOfWeek
          }
        }
      },
      pickerOptions1: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          if (this.weekValue1 !== '') {
            const firstDayOfWeek = this.getDayOfWeek(new Date(this.weekValue1), 1)
            return time.getTime() < firstDayOfWeek
          }
        }
      }
    }
  },
  created () {
    const tuesday = parseTime(this.getDayOfWeek(new Date(), 2), '{y}-{m}-{d}')
    this.weekValue1 = parseTime(new Date(tuesday), '{y}-{m}-{d}')
    this.weekValue2 = parseTime(this.setDate(new Date(tuesday)), '{y}-{m}-{d}')
    const obj = {
      value1: this.weekValue1,
      value2: this.weekValue2
    }
    this.$emit('handleInit', obj)
  },
  methods: {
    // 获取这周的周几
    getDayOfWeek (date, n) {
      const weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + n)// 往前算（weekday-1）天，年份、月份会自动变化
      return date.getTime()
    },

    addDate (date, n) {
      date.setDate(date.getDate() + n)
      return date
    },

    setDate (date, n = 8) {
      const week = date.getDay() - 1
      date = this.addDate(date, week * -1)
      const clenEnd = 7 * n // 往后延伸n周
      const value2 = this.addDate(date, clenEnd - 6)
      return value2
    },
    changeDate1 (val) {
      this.weekValue1 = parseTime(val, '{y}-{m}-{d}')
      console.log(this.weekValue1)
      const obj = {
        value1: this.weekValue1,
        value2: this.weekValue2
      }
      this.$emit('handleChange', obj)
    },
    changeDate2 (val) {
      this.weekValue2 = parseTime(val, '{y}-{m}-{d}')
      const obj = {
        value1: this.weekValue1,
        value2: this.weekValue2
      }
      this.$emit('handleChange', obj)
    }
  }
}
</script>

<style scoped lang="scss">
.weekPeriod {
  display: inline-block;
}
</style>
