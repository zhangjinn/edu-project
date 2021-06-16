<template>
  <div class="detail">
    <ul class="list-wrapper">
      <li>
        <etm-field-label label="年级">
          {{ baseInfo.gradeName }}
        </etm-field-label>
      </li>
      <li>
        <etm-field-label label="班主任">
          {{ baseInfo.headTeacher }}
        </etm-field-label>
      </li>
      <li>
        <etm-field-label label="班级名称">
          {{ baseInfo.clazzName }}
        </etm-field-label>
      </li>
      <li>
        <etm-field-label label="副班老师">
          {{ baseInfo.teacher }}
        </etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>
import { getClazzItemDetail } from '@/api/newDaycare/listEduGuardClazzManage'
// import {
//   getClazzItem
// } from '@/api/guardcare/edu/clazzManage'
export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      baseInfo: {
        gradeName: null,
        clazzName: null,
        headTeacher: null,
        teacher: null
      }
    }
  },
  created () {
    this.getClazzItemData()
  },
  methods: {
    getClazzItemData () {
      const id = this.itemId
      getClazzItemDetail({ id }).then((res) => {
        const { data } = res
        this.baseInfo.gradeName = data.grade
        this.baseInfo.clazzName = data.name

        const headTeacher = []
        const teacher = []
        if (data.clazzRoles) {
          data.clazzRoles.map((val) => {
            if (val.type === 'HEADTEACHER') {
              headTeacher.push(val.employeeName)
            }
            if (val.type === 'TEACHER') {
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
  .detail {
    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 50%;
      }
    }
  }
</style>
