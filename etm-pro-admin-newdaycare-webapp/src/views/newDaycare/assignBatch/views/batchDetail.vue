<template>
  <div class="batchDetail-wrap">
    <etm-layout-split>
      <div>
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          分配批次详情
        </etm-title>
      </div>
      <div>
        <!--            <etm-table-page index :columns="columns" :data="tableData" index-type="index" border @currentChange="currentChange">-->
        <!--            </etm-table-page>-->
        <etm-table
          index
          :columns="columns"
          :data="tableData"
          border
        />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import { queryAssignBatchDetailList } from '@/api/newDaycare/assignBatch'
import { parseTime } from '@/utils'

/**
 * piciDetail create by Administrator
 * createTime 2020/08/26 10:37
 */
export default {
  name: 'BatchDetail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    assignBatchId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tab1: 'tab1',
      columns: [
        { label: '学员姓名', prop: 'childName' },
        { label: '分配前跟进人员', prop: 'beforeFollowerName' },
        { label: '分配后跟进人员', prop: 'afterFollowerName' },
        { label: '分配人', prop: 'operatorName' },
        { label: '分配时间', prop: 'operatorTime' }
      ],
      tableData: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryAssignBatchDetailList({ assignBatchId: this.assignBatchId }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(item => {
          item.operatorTime = parseTime(item.operatorTime, '{y}-{m}-{d} {h}:{i}:{s}')
        })
      })
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
