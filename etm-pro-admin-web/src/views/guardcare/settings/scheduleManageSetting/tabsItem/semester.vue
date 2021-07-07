<template>
  <div class="callWrap">
    <semester-template
      :data.sync="dragData"
      btn-text="添加新类型"
      :no-slot="['color']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @timeChange="updateNew"
    />
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import semesterTemplate from '../components/semesterTemplate'
import {
  getSemesterSetting,
  postSemesterSetting,
  putSemesterSetting,
  delSemesterSetting,
  putSemesterSettingSort
} from '@/api/guardcare/edu/scheduleManage'
export default {
  components: {
    semesterTemplate
  },
  data() {
    return {
      dragData: [
        {
          name: '',
          time: ''
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.dragData = []
      getSemesterSetting().then(res => {
        res.data.forEach(v => {
          const startDate = parseTime(v.startDate, '{y}-{m}-{d}')
          const endDate = parseTime(v.endDate, '{y}-{m}-{d}')
          this.dragData.push({
            name: v.name,
            time: [startDate, endDate],
            id: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const param = {
        courseSubjectList: []
      }
      const courseSubjectList = []
      this.dragData.forEach((v, index) => {
        courseSubjectList.push({
          id: v.id,
          sortIndex: index
        })
      })
      param.courseSubjectList = courseSubjectList
      putSemesterSettingSort(param).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem() {
      const data = this.dragData
      if (data.length > 0) {
        if (data[data.length - 1] && (!data[data.length - 1].name || !data[data.length - 1].time)) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }

      this.dragData.push({
        name: '',
        time: ''
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      delSemesterSetting(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },

    updateNew(index) {
      const target = this.dragData[index]

      const name = target.name
      const time = target.time
      if (!name || !time) {
        return
      }

      const heavy = this.heavy()
      if (heavy) {
        this.$message.warning('时段重复，保存失败')
        return
      }
      const data = {
        name: name,
        startDate: time[0],
        endDate: time[1]
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        putSemesterSetting(data, id).then(res => {
          const result = res.data
          target.id = result.id
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postSemesterSetting(data).then(res => {
          const result = res.data
          target.id = result.id
          this.handleChange()
        }).catch(err => {
          console.error(err)
        })
      }
    },

    // 时间段判重，（返回的结果为true表示有重复区间，false则表示没有）
    heavy() {
      const startTimeArr = []
      const endTimeArr = []
      this.dragData.map(function(item) {
        startTimeArr.push(item.time ? item.time[0] : '')
        endTimeArr.push(item.time ? item.time[1] : '')
      })
      const allStartTime = startTimeArr.sort() // 排序
      const allEndTime = endTimeArr.sort()

      let result = 0 // 判断时间是否有重复区间
      for (let k = 0; k < allStartTime.length; k++) {
        if (k > 0) {
          if (allStartTime[k] <= allEndTime[k - 1]) {
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
