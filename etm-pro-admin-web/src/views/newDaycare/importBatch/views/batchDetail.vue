<template>
  <div class="batchDetail-wrap">
    <etm-layout-split
      styles="{height: '100vh'}"
    >
      <div>
        <etm-title :show-line="false" border size="big">导入批次详情</etm-title>
      </div>
      <div>
        <etm-tabs :setting="false" :show-toggle="false">
          <el-tab-pane label="成功记录">
            <etm-table-page index :columns="columns" :data="tableData" border @currentChange="currentChange" />
            <!--            <etm-table index :columns="columns" :data="tableData" border />-->
          </el-tab-pane>
          <el-tab-pane label="失败记录">
            <!--            <etm-table index :columns="columns2" :data="tableData2" border />-->
            <etm-table-page index :columns="columns2" :data="tableData2" border @currentChange="currentChange2" />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * BatchDetail create by Administrator
 * createTime 2020/08/26 10:37
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryImportBatchDetail } from '@/api/newDaycare/importBatch'
import { parseTime } from '@/utils'

export default {
  name: 'BatchDetail',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    importBatchId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tab1: 'tab1',
      columns: [
        { label: '批次号', prop: 'batchNo' },
        { label: '学员姓名', prop: 'childName' },
        { label: '联系人电话', prop: 'parentPhone' },
        { label: '操作人', prop: 'operatorName' },
        { label: '导入时间', prop: 'createTime' }
      ],
      columns2: [
        { label: '批次号', prop: 'batchNo' },
        { label: '学员姓名', prop: 'childName' },
        { label: '联系人电话', prop: 'parentPhone' },
        { label: '失败原因', prop: 'statusDescription' },
        { label: '操作人', prop: 'operatorName' },
        { label: '导入时间', prop: 'createTime' }
      ],
      tableData: {},
      tableData2: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      pageInfo2: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.suc()
    this.failure()
  },
  methods: {
    // init(status, pageNum, pageSize) {
    //   return new Promise(resolve => {
    //     queryImportBatchDetail({ importBatchId: this.importBatchId, status: status, pageNum: pageNum,
    //       pageSize: pageSize }).then(res => {
    //       // this.tableData = res.data
    //       res.data.forEach(item => {
    //         item.createTime = parseTime(item.operatorTime, '{y}-{m}-{d} {h}:{i}:{s}')
    //       })
    //       resolve(res.data)
    //     })
    //   })
    // },
    suc() {
      queryImportBatchDetail({
        importBatchId: this.importBatchId, status: 'SUCCESS', pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        })
      })
    },
    failure() {
      queryImportBatchDetail({
        importBatchId: this.importBatchId, status: 'FAILED ', pageNum: this.pageInfo2.pageNum,
        pageSize: this.pageInfo2.pageSize
      }).then(res => {
        this.tableData2 = res.data
        this.tableData2.content.forEach(item => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        })
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.suc()
    },
    currentChange2(pageNum, pageSize) {
      this.pageInfo2 = {
        pageNum, pageSize
      }
      this.failure()
    }
  }
}
</script>
<style lang="scss" scoped>
.batchDetail-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
