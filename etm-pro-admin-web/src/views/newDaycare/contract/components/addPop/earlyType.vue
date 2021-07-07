<template>
  <div class="earlyType">
    <etm-table-tool-bar>
      <el-input v-model.trim="keyword" placeholder="请输入课程类型名称" @keyup.native.enter="getData">
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
import { queryEarlyCourseTypeList } from '@/api/newDaycare/courseManage'

export default {
  data() {
    return {
      selectionData: [],
      keyword: '',
      columns: [
        { label: '课程类型名称', prop: 'teCourseTypeName' },
        { label: '单价', prop: 'price' }
      ],
      tableData: [{}]
    }
  },
  computed: {},
  methods: {
    selection(event) {
      this.selectionData = event
    },
    getSelectionData() {
      return {
        name: 'COURSE_TYPE',
        list: this.selectionData
      }
    },
    getData() {
      queryEarlyCourseTypeList(this.keyword).then(res => {
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
.earlyType {
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
