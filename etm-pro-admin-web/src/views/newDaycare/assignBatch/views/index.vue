<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane label="分配批次管理">
              <etm-tool-bar v-model="formData" @search="handleSearch" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            index
            :columns="columns"
            :data="tableData"
            border
            @currentChange="currentChange"
          >
            <el-table-column slot="left" label="批次号" fixed="left" width="120">
              <template slot-scope="scoped">
                <etm-text type="primary" @click.stop="batchDetail(scoped)">{{ scoped.row.batchNo }}</etm-text>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="操作" width="120">
              <template v-slot="row">
                <etm-text v-if="row.row.status === '正常'" type="primary" @click="edit(row.row)">撤销</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
      <etm-drawer
        :visible.sync="showSide"
        :type="type"
      >
        <batch-detail v-if="showSide" :assign-batch-id="assignBatchId" />
      </etm-drawer>
    </etm-main-body>
  </div>

</template>

<script>
import { queryAssignBatchList, updateBatchStatusById } from '@/api/newDaycare/assignBatch'
import batchDetail from '@/views/newDaycare/assignBatch/views/batchDetail'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils/index'

/**
 * index create by songlu
 * createTime 2020/08/25 17:18
 */
export default {
  name: 'Index',
  components: {
    batchDetail
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      formData: [
        {
          label: '批次号',
          type: 'input',
          prop: 'assignBatchId',
          value: '',
          props: {
            placeholder: '请输入批次号'
          }
        },
        {
          label: '批次状态',
          type: 'select',
          prop: 'status',
          value: '',
          default: '',
          options: [
            {
              label: '正常',
              value: 'NORMAL '
            },
            {
              label: '已撤销',
              value: 'REVOKED '
            }
          ],
          props: {
            placeholder: '请选择批次状态',
            clearable: true,
            filterable: true
          }
        },
        {
          label: '分配时间',
          type: 'date',
          prop: 'orderTime',
          value: null,
          // default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          // default: [null, null],
          props: {
            'type': 'daterange',
            'clearable': false,
            'range-separator': '-',
            'value-format': 'yyyy-MM-dd',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        }
      ],
      columns: [
        {
          label: '批次状态',
          prop: 'status'
        },
        {
          label: '批次数据（条）',
          prop: 'total'
        },
        {
          label: '分配人',
          prop: 'operatorName'
        },
        {
          label: '分配时间',
          prop: 'operatorTime'
        }
      ],
      show: true,
      showSide: false,
      type: 'big',
      tableData: {
        content: [
          {}
        ]
      },
      assignBatchId: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const batchId = this.getObjectByProp('assignBatchId', this.formData).value
      const status = this.getObjectByProp('status', this.formData).value
      const getTime = this.getObjectByProp('orderTime', this.formData).value
      queryAssignBatchList({
        batchNo: batchId,
        status: (status) || null,
        startTime: (getTime && getTime[0]) || null,
        endTime: (getTime && getTime[1]) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          if (item.status === 'NORMAL') {
            item.status = '正常'
          } else {
            item.status = '已撤销'
          }
          item.operatorTime = parseTime(item.operatorTime, '{y}-{m}-{d} {h}:{i}:{s}')
        })
      })
    },
    handleSearch() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    edit(row) {
      this.$etmTip.init({
        title: '警告',
        content: '是否撤销该分配',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          updateBatchStatusById({ assignBatchId: row.assignBatchId }).then(() => {
            // console.log(res)
            this.$message.success('操作成功')
            this.init()
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    batchDetail(scoped) {
      this.assignBatchId = scoped.row.assignBatchId
      // console.log(this.assignBatchId)
      this.showSide = true
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
}
</style>
