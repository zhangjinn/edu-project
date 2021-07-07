<template>
  <div class="earlyCourse">
    <etm-table-tool-bar>
      <el-input v-model.trim="keyword" placeholder="请输入早教课程名称" @keyup.native.enter="getData">
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
import { queryEarlyCourseList } from '@/api/newDaycare/courseManage'

export default {
  data() {
    return {
      selectionData: [],
      keyword: '',
      columns: [
        { label: '早教课程名称', prop: 'caeCourseName' },
        { label: '课程类型', prop: 'courseTypeName' },
        { label: '消课课时', prop: 'lesson' },
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
      queryEarlyCourseList({ teCourseName: this.keyword }).then(res => {
        this.tableData = res.data || []
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
