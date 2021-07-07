<template>
  <div class="detail">
    <ul class="list">
      <li><etm-field-label type="left" label="课程名称">{{ baseInfo.specialCourse }}</etm-field-label></li>
      <li><etm-field-label type="left" label="授课老师">{{ baseInfo.headTeacher }}</etm-field-label></li>
      <li><etm-field-label type="left" label="助教老师">{{ baseInfo.teacher }}</etm-field-label></li>
      <li><etm-field-label type="left" label="上课场地">{{ baseInfo.room }}</etm-field-label></li>
      <li>
        <etm-field-label type="left" label="上课时段">
          {{ baseInfo.startTime }}~{{ baseInfo.endTime }}
        </etm-field-label>
      </li>
      <li class="scheduleWeeks"><etm-field-label type="left" label="上课日">{{ baseInfo.scheduleWeeks }}</etm-field-label></li>
    </ul>
    <div class="childCount">
      报名幼儿 ( <span v-if="tableData">{{ tableData.length }}</span> <span v-else>0</span>)人
    </div>
    <childList :table-data="tableData" />
  </div>
</template>

<script>
import childList from '../registeredChild/childList'
// import {
//   getScheduleItem
// } from '@/api/guardcare/edu/scheduleManage'
import { getScheduleItem } from '@/api/newDaycare/listEduGuardScheduleManage'
export default {
  name: 'Detail',
  components: {
    childList
  },
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      baseInfo: {
        specialCourse: null,
        headTeacher: null,
        teacher: null,
        room: null,
        startTime: null,
        endTime: null,
        scheduleWeeks: null
      },
      tableData: [],
      checkList: [
        {
          name: '星期一',
          value: 'MON'
        },
        {
          name: '星期二',
          value: 'TUES'
        },
        {
          name: '星期三',
          value: 'WED'
        },
        {
          name: '星期四',
          value: 'THUR'
        },
        {
          name: '星期五',
          value: 'FRI'
        },
        {
          name: '星期六',
          value: 'SAT'
        },
        {
          name: '星期日',
          value: 'SUN'
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const id = this.itemId
      getScheduleItem({ id }).then((res) => {
        const { data } = res
        this.baseInfo = {
          specialCourse: data.specialCourse,
          headTeacher: null,
          teacher: null,
          room: data.room,
          startTime: data.startTime,
          endTime: data.endTime,
          // scheduleWeeks: data.scheduleWeeks
          scheduleWeeks: []
        }
        this.tableData = []
        if (data.children) {
          this.tableData = data.children
          this.tableData.map((val) => {
            val.gender = val.gender === 'MALE' ? '男' : '女'
          })
        }

        const weeks = []
        if (data.scheduleWeeks) {
          this.checkList.map((val) => {
            if (data.scheduleWeeks.includes(val.value)) {
              weeks.push(val.name)
            }
          })
        }
        this.baseInfo.scheduleWeeks = weeks.toString()

        const headTeacher = []
        const teacher = []
        if (data.scheduleRoles) {
          data.scheduleRoles.map((val) => {
            if (val.type === 'LECTURER') {
              headTeacher.push(val.employeeName)
            }
            if (val.type === 'ASSISTANT') {
              teacher.push(val.employeeName)
            }
          })
        }

        this.baseInfo.headTeacher = headTeacher.toString()
        this.baseInfo.teacher = teacher.toString()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .detail{
    .list{
      padding-bottom: 8px;
    }
    .scheduleWeeks{
      span{
        margin-right: 8px;
      }
    }
    .childCount{
      padding-bottom: 16px;
    }
  }
</style>
