<template>
  <div class="h5Data-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            :show-toggle="false"
            @tab-click="handleReset"
          >
            <el-tab-pane
              label="表单汇总"
              name="表单汇总"
            >
              <!--            <etm-tool-bar v-show="true" v-model="formData" @reset="handleReset" @search="handleSearch" />-->
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :data="tableData"
            @currentChange="handleCurrentChange"
            @size-change="handleSizeChange"
            @selection-change="handleSelectionChange"
          >
            <!--            <etm-table-tool-bar slot="tool">-->
            <!--              <el-button slot="right" plain @click.stop="handleExportExcel">导出Excel</el-button>-->
            <!--            </etm-table-tool-bar>-->
            <el-table-column
              v-for="(it,i) in tableHeader"
              :key="i"
              :label="it"
            >
              <template v-slot="scoped">
                <img
                  v-if="obj[i] === 'image'"
                  :src="scoped.row[i]"
                >
                <p v-else>
                  {{ scoped.row[i] }}
                </p>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
// import baseMixin from '@/layout/mixin/baseMixin'
import { queryForm } from '@/api/newDaycare/eqx'

export default {
  name: 'H5Data',
  components: {},
  filters: {
    filterDate (v) {
      return v
    }
  },
  // mixins: [baseMixin],
  data () {
    return {
      id: '',
      editType: '',
      activeName: '表单汇总',
      // formData: [
      //   // {
      //   //   label: '活动名称',
      //   //   type: 'input',
      //   //   prop: 'name',
      //   //   value: null,
      //   //   props: {
      //   //     placeholder: '请输入活动名称'
      //   //   }
      //   // }
      // ],
      pageInfo: {
        count: 1,
        pageSize: 10,
        pageNo: 1
      },
      obj: [],
      tableHeader: [],
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
        content: []
      },
      multipleSelection: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (val) {
        if (val.name === 'h5Data') {
          this.init()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created () {

  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      this.id = this.$route.query.id
      this.editType = this.$route.query.editType
      queryForm({
        editType: this.editType,
        id: this.id,
        ...this.pageInfo
      }).then(res => {
        if (res.data.content.length) {
          let idx = null
          if (res.data.content[0].includes('ID')) {
            idx = res.data.content[0].findIndex(v => v === 'ID')
            this.tableHeader = res.data.content[0].filter(v => v !== 'ID')
          }
          this.tableData.content = res.data.content.filter((v, i) => i !== 0).map(v => {
            const item = {}
            if (idx !== null) {
              v = v.filter((d, j) => j !== idx)
            }
            v.forEach((it, index) => {
              item[index] = it
            })
            return item
          })
        }
        if (res.data.pageInfo) {
          this.pageInfo = res.data.page
          this.tableData.pageNum = res.data.page.pageNo
          this.tableData.pageSize = res.data.page.pageSize
          this.tableData.totalElements = res.data.page.count
        }
        if (res.data.obj && res.data.obj.length) this.obj = res.data.obj.filter(v => v !== 'id')
      })
    },
    handleSearch () {
      this.pageInfo.pageNo = 1
      this.init()
    },
    handleReset () {
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = 10
      this.init()
    },
    handleCurrentChange (val) {
      this.pageInfo.pageNo = val
      this.init()
    },
    handleSizeChange (val) {
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = val
      this.init()
    },
    handleSelectionChange (v) {
      this.multipleSelection = v
    },
    handleExportExcel () {

    }
  }
}
</script>
<style lang="scss" scoped>
</style>
