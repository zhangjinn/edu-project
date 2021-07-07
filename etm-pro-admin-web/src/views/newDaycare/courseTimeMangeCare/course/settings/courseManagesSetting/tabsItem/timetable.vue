<template>
  <div class="callWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新时段"
      :no-slot="['color']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @timeChange="updateNew"
    />
  </div>
</template>
<script>
import itemTemplate from '../components/itemTemplate'
import {
  createScheduleCourseTime,
  queryScheduleCourseTime,
  removeScheduleCourseTime,
  updateScheduleCourseTime,
  updateScheduleCourseTimeSort
} from '@/api/newDaycare/scheduleManage'

export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [
        {
          startTime: '',
          endTime: ''
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.dragData = []
      queryScheduleCourseTime().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            startTime: v.startTime,
            endTime: v.endTime,
            ...v
          })
        })
      })
    },
    handleChange(params) {
      if (!params) {
        console.log('非拖动')
        return false
      }
      const ids = this.dragData.map(item => item.courseTimePeriodId)
      updateScheduleCourseTimeSort({ ids }).then(res => {
        this.init()
      })
    },
    addItem() {
      this.dragData.push({
        startTime: '',
        endTime: '',
        courseTimePeriodId: null
      })
    },
    deleteItem(arr) {
      const { index } = arr[0]
      console.log(this.dragData[index])
      // 空的
      if (!this.dragData[index].courseTimePeriodId) {
        this.dragData.splice(index, 1)
        return
      }
      removeScheduleCourseTime({ courseTimePeriodId: this.dragData[index].courseTimePeriodId }).then(res => {
        this.dragData.splice(index, 1)
      })
    },

    updateNew(index) {
      const target = this.dragData[index]
      const { startTime, endTime } = this.dragData[index]
      if (!startTime || !endTime) {
        return
      }

      if (this.heavy()) {
        this.$message.warning('时段重复，保存失败')
        return
      }

      if (target.courseTimePeriodId) {
        // 存在id，修改
        const id = target.courseTimePeriodId
        updateScheduleCourseTime({ serialNo: index, startTime, endTime, courseTimePeriodId: id }).then(res => {
          const result = res.data
          target.courseTimePeriodId = result.courseTimePeriodId
        })
      } else {
        // 不存在id，新增
        createScheduleCourseTime({ serialNo: index, startTime, endTime }).then(res => {
          const result = res.data
          target.courseTimePeriodId = result.courseTimePeriodId
        })
      }
    },

    // 时间段判重，（返回的结果为true表示有重复区间，false则表示没有）
    heavy() {
      const startTimeArr = []
      const endTimeArr = []
      this.dragData.map(function(item) {
        startTimeArr.push(item.startTime ? item.startTime : '')
        endTimeArr.push(item.endTime ? item.endTime : '')
      })
      const allStartTime = startTimeArr.sort() // 排序
      const allEndTime = endTimeArr.sort()

      let result = 0 // 判断时间是否有重复区间
      for (let k = 0; k < allStartTime.length; k++) {
        if (k > 0) {
          if (allStartTime[k] < allEndTime[k - 1]) {
            result += 1
          }
        }
      }
      return result > 0
    }

  }
}
</script>

<style scoped>
</style>
