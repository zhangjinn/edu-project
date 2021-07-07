<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane label="导入批次管理">
              <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" />
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
            <el-table-column slot="left" fixed="left" label="批次号" width="120">
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
        <batch-detail v-if="showSide" :import-batch-id="importBatchId" />
      </etm-drawer>
    </etm-main-body>
  </div>

</template>

<script>
import batchDetail from '@/views/newDaycare/importBatch/views/batchDetail'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryImportBatchList, updateBatchStatusById } from '@/api/newDaycare/importBatch'
import { parseTime } from '@/utils'

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
          prop: 'batchNo',
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
              value: 'NORMAL'
            },
            {
              label: '已撤销',
              value: 'CANCEL'
            }
          ],
          props: {
            placeholder: '请选择批次状态',
            clearable: true,
            filterable: true
          }
        },
        {
          label: '导入时间',
          type: 'date',
          prop: 'operatorTime',
          value: null,
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
          label: '导入成功数据（条）',
          prop: 'successCount'
        },
        {
          label: '导入失败数据（条）',
          prop: 'failCount'
        },
        {
          label: '操作人',
          prop: 'operatorName'
        },
        {
          label: '名单来源',
          prop: 'source'
        },
        {
          label: '导入时间',
          prop: 'createTime'
        }
      ],
      show: true,
      showSide: false,
      type: 'big',
      importBatchId: '',
      tableData: {}
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
    handleSearch() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    init() {
      const batchId = this.getObjectByProp('batchNo', this.formData).value
      const status = this.getObjectByProp('status', this.formData).value
      const getTime = this.getObjectByProp('operatorTime', this.formData).value
      queryImportBatchList({
        batchNo: batchId,
        status: (status) || null,
        startTime: (getTime && getTime[0]) || null,
        endTime: (getTime && getTime[1]) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          if (item.status === 'NORMAL') {
            item.status = '正常'
          } else {
            item.status = '已撤销'
          }
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          // console.log(item.createTime)
        })
      })
    },
    edit(row) {
      this.$etmTip.init({
        title: '警告',
        content: '是否撤销该导入',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          updateBatchStatusById({ id: row.importBatchId }).then(res => {
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
      // console.log(typeof (scoped.row.importBatchId))
      this.importBatchId = scoped.row.importBatchId
      this.showSide = true
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
}
</style>
