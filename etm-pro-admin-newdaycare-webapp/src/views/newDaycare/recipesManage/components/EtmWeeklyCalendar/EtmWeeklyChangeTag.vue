<template>
  <div class="table_box">
    <el-button-group>
      <template>
        <el-button @click="lastClick">
          上一周
        </el-button>
      </template>
      <template>
        <el-button @click="nowClick">
          本周
        </el-button>
      </template>
      <template>
        <el-button @click="nextClick">
          下一周
        </el-button>
      </template>
    </el-button-group>
  </div>
</template>

<script>

export default {
  name: 'EtmWeeklyChangeTag',
  data () {
    return {
      active: 1,
      currentFirstDate: '',
      clen: 7,
      // todayDate: '',
      weekDayArr: [],
      weekStartDay: '',
      weekEndDay: ''
    }
  },
  created () {
    this.nowClick()
  },
  methods: {
    // 日期格式处理
    formatDateNew (date) {
      const seperator1 = '-'
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        day = '0' + day
      }
      return year + seperator1 + month + seperator1 + day
    },

    formatDate (date) {
      const seperator1 = '.'
      let month = date.getMonth() + 1
      let day = date.getDate()
      const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]

      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        day = '0' + day
      }
      return week + '(' + month + seperator1 + day + ')'
    },
    //
    addDate (date, n) {
      date.setDate(date.getDate() + n)
      return date
    },

    //
    setDate (date) {
      const week = date.getDay() - 1
      date = this.addDate(date, week * -1)
      this.currentFirstDate = new Date(date)
      for (let i = 0; i < this.clen; i++) {
        this.weekDayArr.push({
          titleDate: this.formatDate(i === 0 ? date : this.addDate(date, 1)),
          formatDate: this.formatDateNew(date)
        })
      }
    },

    // 本周
    nowClick () {
      this.active = 2
      this.weekDayArr = []
      this.setDate(new Date())
      this.$emit('weekClick', this.weekDayArr)
    },

    // 上一周
    lastClick () {
      this.active = 1
      this.weekDayArr = []
      this.setDate(this.addDate(this.currentFirstDate, -7))
      this.$emit('weekClick', this.weekDayArr)
    },

    // 下一周
    nextClick () {
      this.active = 3
      this.weekDayArr = []
      this.setDate(this.addDate(this.currentFirstDate, 7))
      this.$emit('weekClick', this.weekDayArr)
    }
  }
}
</script>

<style scoped>

</style>
