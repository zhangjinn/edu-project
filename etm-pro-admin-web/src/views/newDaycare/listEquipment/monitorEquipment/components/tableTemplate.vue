<template>
  <div class="tableTemplage-wrap">
    <el-input v-model="searchForm.cameraName" class="search-input" placeholder="请输入搜索内容" @blur="handleSearch">
      <i slot="suffix" class="el-input__icon el-icon-search" />
    </el-input>
    <etm-table-page
      :columns="columns"
      :data="tableData"
      selection
      @currentChange="handleCurrentChange"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import { queryCameraList } from '@/api/newDaycare/monitorEquipment'

/**
 * tableTemplage create by zhangbanxian
 * createTime 2020/10/22 19:50
 */
export default {
  name: 'TableTemplate',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      searchForm: {
        cameraName: null
      },
      // 表格数据
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: []
      },
      columns: [
        {
          label: '摄像头名称',
          prop: 'cameraName'
        }, {
          label: '序列号',
          prop: 'deviceSerial'
        }, {
          label: '摄像头位置',
          prop: 'address'
        }
      ],
      selectObject: []
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(params = this.searchForm) {
      queryCameraList(params).then(res => {
        // console.log('cameraList', res)
        this.tableData = res.data
      })
    },
    handleSearch() {
      this.init()
    },
    handleSelectionChange(v) {
      // console.log('selectObject', v)
      this.selectObject = v
    },
    handleCurrentChange(v) {
      const params = Object.assign({}, this.searchForm)
      params.pageNum = v
      this.init(params)
    }

  }
}
</script>
<style lang="scss" scoped>
.tableTemplage-wrap {
  .el-input{
    margin-bottom: 23px;
    width: 350px;
  }
}
</style>
