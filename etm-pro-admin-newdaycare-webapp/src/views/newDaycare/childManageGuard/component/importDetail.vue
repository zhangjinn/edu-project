<template>
  <div class="importDetail-wrap">
    <etm-layout-split>
      <etm-title
        :show-line="false"
        border
        size="big"
      >
        导入批次详情
      </etm-title>
      <etm-tabs
        v-model="activeName"
        :show-toggle="false"
      >
        <el-tab-pane
          label="失败记录"
          name="fail"
        />
        <el-tab-pane
          label="成功记录"
          name="success"
        />
      </etm-tabs>
      <div v-show="activeName === 'fail'">
        <etm-table
          index
          :columns="column"
          :data="batchData.failedList"
        >
          <el-table-column
            slot="right"
            label="失败原因"
            prop="failedReason"
            width="150"
          />
          <el-table-column
            slot="right"
            label="操作人"
            prop="operatorName"
            width="90"
          />
          <el-table-column
            slot="right"
            label="导入时间"
            width="180"
          >
            <template slot-scope="scoped">
              <span>{{ transferDate(scoped.row.createTime) }}</span>
            </template>
          </el-table-column>
        </etm-table>
      </div>
      <div v-show="activeName === 'success'">
        <etm-table
          index
          :columns="column"
          :data="batchData.successList"
        >
          <el-table-column
            slot="right"
            label="操作人"
            prop="operatorName"
            width="90"
          />
          <el-table-column
            slot="right"
            label="导入时间"
            wodth="180"
          >
            <template slot-scope="scoped">
              <span>{{ transferDate(scoped.row.createTime) }}</span>
            </template>
          </el-table-column>
        </etm-table>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * importDetail create by Administrator
 * createTime 2021/1/15 10:53
 */
import { queryImportBatchById } from '@/api/newDaycare/childManageGuard'
import { parseTime } from '@/utils'
export default {
  name: 'ImportDetail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    batchId: {
      type: Number,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      batchData: {},
      activeName: 'fail',
      column: [
        {
          label: '批次号',
          prop: 'batchNumber',
          width: 180
        },
        {
          label: '幼儿姓名',
          prop: 'childName'
        },
        {
          label: '联系人电话',
          prop: 'parentPhone'
        }
      ]
    }
  },
  computed: {},
  watch: {
    batchId () {
      this.getDetail()
    }
  },
  created () {
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      queryImportBatchById({ batchId: this.batchId }).then(res => {
        this.batchData = res.data
      })
    },
    transferDate (date) {
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
