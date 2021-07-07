<template>
  <div class="authorize">
    <el-input v-model="keywords" class="search-input" placeholder="请输入搜索内容" @keyup.native.enter="getCamsList">
      <span slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getCamsList" />
    </el-input>
    <etm-table
      ref="table"
      selection
      :columns="columns"
      :data="tableData"
      @selection-change="value => selection = value"
    />
  </div>
</template>
<script>
import {
  queryCamListNoPage
} from '@/api/newDaycare/monitorEquipment'
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      keywords: '',
      columns: [
        { label: '摄像头名称', prop: 'cameraName' },
        { label: '序列号', prop: 'deviceSerial' },
        { label: '摄像头位置', prop: 'address' }
      ],
      tableData: [],
      selection: []
    }
  },
  methods: {
    getCamsList() {
      let p
      if (this.keywords.trim()) {
        p = queryCamListNoPage(this.keywords.trim())
      } else {
        p = queryCamListNoPage()
      }
      p.then(res => {
        this.tableData = res.data.content || []
        this.judgeSelect()
      }).catch(err => {
        this.tableData = []
        console.log(err)
      })
    },
    judgeSelect() { // 选中列表中已授权的摄像头
      this.$nextTick(() => {
        const table = this.$refs.table.$children[0]
        this.selection = []
        Array.isArray(this.tableData) && this.tableData.forEach(v => {
          for (let i = 0; i < this.list.length; i++) {
            if (v.cameraId === this.list[i].cameraId) {
              table.toggleRowSelection(v, true)
              break
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.authorize {
  ::v-deep .el-input {
    margin-bottom: 16px;
    width: 220px;
  }
}
</style>
