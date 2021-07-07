<template>
  <div class="earlyCourse">
    <etm-table-tool-bar>
      <el-input v-model.trim="keyword" placeholder="请输入托育课程名称" @keyup.native.enter="getData">
        <i slot="suffix" class="el-icon-search el-input__icon" @click.stop="getData" />
      </el-input>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
      selection
      @selection-change="selection"
    />
  </div>
</template>
<script>
import { queryNurseCourseList } from '@/api/newDaycare/courseManage'

export default {
  data() {
    return {
      selectionData: [],
      keyword: '',
      columns: [
        { label: '托育课程名称', prop: 'caeCourseName' },
        { label: '课程类型', prop: 'courseTypeName' },
        { label: '消课天数', prop: 'lesson' },
        { label: '课程容量', prop: 'totalCapacity' },
        { label: '单价', prop: 'price' }
      ],
      tableData: [{}]
    }
  },
  created() {
  },
  methods: {
    selection(event) {
      // this.$emit('change', event)
      // console.log(event)
      this.selectionData = event
    },
    getSelectionData() {
      // return this.selectionData
      return {
        name: 'CAE_COURSE',
        list: this.selectionData
      }
    },
    getData() {
      queryNurseCourseList({ caeCourseName: this.keyword }).then(res => {
        this.tableData = (res.data || []).map(cur => {
          if (cur['image'] && cur['image'].length) {
            cur.img = cur['image'][0].url
          } else {
            cur.img = ''
          }
          return cur
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.earlyCourse {
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
