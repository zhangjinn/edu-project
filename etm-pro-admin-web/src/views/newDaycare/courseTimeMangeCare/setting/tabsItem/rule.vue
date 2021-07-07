<template>
  <div class="rule-wrap">
    <item-template
      :data.sync="dragData"
      step="00:01"
      btn-text="添加新时段"
      :no-slot="['color']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @timeChange="updateNew"
    />
  </div>

</template>

<script>/**
 * rule create by Administrator
 * createTime 2020/9/8 18:53
 */

import itemTemplate from '../../../courseTimeManageTeach/settings/courseManagesSetting/components/itemTemplate'

import { createNursePeriod, queryNursePeriod, removeNursePeriod, updateNursePeriod, updatePeriodSort } from '@/api/newDaycare/nurseSchedule'

export default {
  name: 'Rule',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      dragData: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    getData() {
      this.dragData = []
      queryNursePeriod().then(res => {
        res.data.forEach(cur => {
          this.dragData.push({
            startTime: cur.startTime.slice(0, -3),
            endTime: cur.endTime.slice(0, -3),
            id: cur.caScourseTimePeriodId,
            sort: cur.caScourseTimePeriodId,
            move: true
          })
        })
      })
    },
    handleChange() {
      const scheduleTimeSettingList = []
      this.dragData.forEach((v, index) => {
        scheduleTimeSettingList.push(v.id)
      })

      updatePeriodSort(scheduleTimeSettingList).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem() {
      const hasEmpty = this.dragData.some(cur => {
        return cur.startTime === '' || cur.startTime === ''
      })

      if (hasEmpty) {
        this.$message.warning('请先填写前一项的内容')
        return
      }

      this.dragData.push({
        startTime: '',
        endTime: '',
        move: false
      })
    },
    deleteItem(e) {
      // console.log(e)
      removeNursePeriod(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.log(err)
      })
    },

    updateNew(index) {
      const target = this.dragData[index]

      const startTime = this.dragData[index].startTime
      const endTime = this.dragData[index].endTime
      if (!startTime || !endTime) {
        return
      }

      // const heavy = this.heavy()
      // if (heavy) {
      //   this.$message.warning('时段重复，保存失败')
      //   return
      // }
      const data = {
        startTime: startTime + ':00',
        endTime: endTime + ':00'
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        updateNursePeriod({ ...data, caScourseTimePeriodId: id }).then(res => {
          const result = res.data
          target.id = result.caScourseTimePeriodId
        })
      } else {
        // 不存在id，新增

        createNursePeriod(data).then(res => {
          const result = res.data
          target.id = result.caScourseTimePeriodId

          this.dragData[index].move = true
          this.dragData[this.dragData.length - 1].id = res.data.caScourseTimePeriodId
          this.dragData[this.dragData.length - 1].sort = res.data.caScourseTimePeriodId

          this.handleChange()
        })
      }
    },

    // 时间段判重，（返回的结果为true表示有重复区间，false则表示没有）
    heavy() {
      const startTimeArr = []
      const endTimeArr = []

      this.dragData.forEach(function(item) {
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
<style lang="scss" scoped>
.rule-wrap {

}
</style>
