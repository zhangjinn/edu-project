<template>
  <div>
    <etm-table-page
      ref="cloudOrderTable"
      :data="tableData"
      :columns="columns"
      :stripe="false"
      selection
      index
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button plain @click.stop="exportExcel()">
            导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="订单编号" prop="code" min-width="120">
        <template slot-scope="scoped">
          <etm-text @click="handleDetail(scoped.row.code)">{{ scoped.row.code }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="支付方式" prop="paymentType" min-width="120">
        <template slot-scope="scoped">
          <span>{{ transferPaymentType(scoped.row.payType) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="购买时长" prop="buyedMonth" min-width="120">
        <template slot-scope="scoped">
          <span>{{ scoped.row.buyedMonth }}个月</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="支付日期" prop="paymentDate" show-overflow-tooltip min-width="120">
        <template slot-scope="scoped">
          <span>{{ transferDateToHour(scoped.row.paymentDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="到期日期" prop="expireDate" show-overflow-tooltip min-width="120">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.expireDate) }}</span>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big" />
        <detail v-if="drawerVisible && drawerType==='detail' && orderNumber" :order-number="orderNumber" />
      </etm-layout-split>
    </etm-drawer>

  </div>
</template>

<script>
import { queryCloudList, downExcel } from '@/api/guardcare/orderManage/cloudOrder'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import detail from '../components/detail'

export default {
  name: 'CloudOrderTable',
  components: { detail },
  mixins: [baseMixin],
  props: {
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      orderNumber: null,
      drawerVisible: false,
      drawerTitle: '订单详情',
      drawerType: '',
      tabPlanLabel: '云视频订单表',
      columns: [
        {
          label: '家长姓名',
          prop: 'parentName',
          minWidth: 120
        },
        {
          label: '家长电话',
          prop: 'parentPhone',
          minWidth: 120
        },
        {
          label: '幼儿姓名',
          prop: 'childName',
          minWidth: 120
        },
        {
          label: '所属年级',
          prop: 'grade',
          minWidth: 120
          // width: '120'
        },
        {
          label: '所属班级',
          prop: 'clazz',
          minWidth: 120
          // width: '120'
        },
        {
          label: '支付金额（元）',
          prop: 'actualAmount',
          minWidth: 120
        }
      ],
      selectable: true,
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      }
    }
  },
  watch: {
    searchInfo: {
      handler(newValue, oldValue) {
        this.pageNum = 1
        if (Object.keys(newValue).length !== 0) {
          this.getList()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 详情
    handleDetail(row) {
      console.log(row, 'row')
      if (row) {
        this.orderNumber = row
      }
      this.drawerType = 'detail'
      this.drawerVisible = true
    },
    transferPaymentType(type) { // 支付方式
      switch (type) {
        case 'OFFLINE':
          return '线下'
        case 'ONLINE':
          return '线上'
        default:
          return type
      }
    },
    transferDateToHour(date) { // 日期转换
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{m}:{s}')
      }
    },
    transferDate(date) { // 日期转换
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    exportExcel() {
      const params = {}
      // params.pageNum = this.pageNum
      // params.pageSize = this.pageSize
      // 遍历查询信息出入params中发送请求
      for (const i in this.searchInfo) {
        params[i] = this.searchInfo[i]
      }
      // console.log(params, 'params')
      console.log(downExcel(params))
      downExcel(params).then(res => {
        console.log(res, 'res')
        downloadFileForUrl(res)
      })
    },
    // 获取订单信息
    getList() {
      const params = {}
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      // 遍历查询信息出入params中发送请求
      for (const i in this.searchInfo) {
        params[i] = this.searchInfo[i]
      }
      console.log(params, 'params')
      queryCloudList(params).then(res => {
        console.log(res.data, 'resdata')
        const tableData = JSON.parse(JSON.stringify(res.data))
        // tableData.content = []
        this.rowNum = []
        this.tableData = tableData
      })
    }
  }
}
</script>

<style scoped>

</style>
