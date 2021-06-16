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
// import {
//   getScheduleTimeSetting,
//   postScheduleTimeSetting,
//   putScheduleTimeSetting,
//   delScheduleTimeSetting,
//   putScheduleTimeSettingSort
// } from '@/api/guardcare/edu/scheduleManage'

import {
  getScheduleTimeSetting,
  postScheduleTimeSetting,
  putScheduleTimeSetting,
  putScheduleTimeSettingSort,
  delScheduleTimeSetting
} from '@/api/newDaycare/listEduGuardScheduleManage'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragData: [
        {
          startTime: '',
          endTime: ''
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []
      const param = {
        type: 'COURSE'
      }
      getScheduleTimeSetting(param).then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            startTime: v.startTime,
            endTime: v.endTime,
            id: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange () {
      const param = {
        scheduleTimeSettingList: [],
        type: 'COURSE'
      }
      const scheduleTimeSettingList = []
      this.dragData.forEach((v, index) => {
        scheduleTimeSettingList.push({
          id: v.id,
          startTime: v.startTime,
          endTime: v.endTime,
          sortIndex: index
        })
      })
      param.scheduleTimeSettingList = scheduleTimeSettingList
      putScheduleTimeSettingSort(param).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem () {
      const data = this.dragData
      if (data.length) {
        if (data[data.length - 1] && (!data[data.length - 1].startTime || !data[data.length - 1].endTime)) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }
      this.dragData.push({
        startTime: '',
        endTime: ''
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      delScheduleTimeSetting({ id: this.dragData[e[0].index].id }).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },

    updateNew (index) {
      const target = this.dragData[index]

      const startTime = this.dragData[index].startTime
      const endTime = this.dragData[index].endTime
      if (!startTime || !endTime) {
        return
      }

      const heavy = this.heavy()
      if (heavy) {
        this.$message.warning('时段重复，保存失败')
        return
      }
      const data = {
        startTime: startTime,
        endTime: endTime,
        type: 'COURSE'
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        data.id = id
        putScheduleTimeSetting(data).then(res => {
          const result = res.data
          target.id = result.id
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postScheduleTimeSetting(data).then(res => {
          const result = res.data
          target.id = result.id
          this.handleChange()
        }).catch(err => {
          console.error(err)
        })
      }
    },

    // 时间段判重，（返回的结果为true表示有重复区间，false则表示没有）
    heavy () {
      const startTimeArr = []
      const endTimeArr = []
      this.dragData.map(function (item) {
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
