<template>
  <div class="my-customer-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="currentTab">
          <el-tab-pane
            label="签单记录"
            name="public"
          >
            <etm-tool-bar
              v-model="formData"
              @search="search"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <etm-table-digit :data="tipData" />
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            width="200"
            label="单号"
          >
            <template v-slot="{row}">
              <etm-text @click="showDetail(row)">
                {{ row.orderNo }}
              </etm-text>
            </template>
          </el-table-column><el-table-column
            slot="left"
            width="120"
            label="客户姓名"
          >
            <template v-slot="{row}">
              {{ row.customerName }}
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            min-width="120"
            label="附件"
          >
            <template v-slot="{row}">
              <etm-text
                v-for="(item, index) in row.annex"
                :key="index"
                @click="download(item.url)"
              >
                {{ item.name }}
              </etm-text>
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
            label="备注"
          >
            <template v-slot="{row}">
              {{ row.remarks }}
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
            label="经办人"
          >
            <template v-slot="{row}">
              {{ row.employeePrivilegeCacheName }}
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <detail
      ref="detail"
      :order-id="detailId"
    />
  </div>
</template>

<script>
import detail from '@/views/listCustomer/dealRecord/detail'
import EtmTableDigit from '@/components/EtmTableDigit'
import {
  queryDealTotal,
  queryDealRecord
} from '@/api/customer'
import { parseTime } from '@/utils'
export default {
  name: 'FollowRecord',
  components: {
    detail,
    EtmTableDigit
  },
  data () {
    return {
      detailId: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true,
        sort: null
      },
      tableParams: {
        orderNo: null,
        customerName: null,
        startDate: null,
        endDate: null
      },
      currentTab: 'public',
      tipData: [
        {
          digit: 0,
          text: '本日签单金额'
        },
        {
          digit: 0,
          text: '本周签单金额'
        }, {
          digit: 0,
          text: '本月签单金额'
        }
      ],
      tableData: {
        content: [{}]
      },
      formData: [
        {
          label: '单号',
          prop: 'orderNo',
          value: '',
          type: 'input',
          props: {
            placeholder: '请输入单号'
          }
        },
        {
          label: '客户名称',
          prop: 'customerName',
          value: '',
          type: 'input',
          props: {
            placeholder: '请输入客户名称'
          }
        },
        {
          label: '签单时间',
          prop: 'date',
          value: '',
          type: 'date',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            'value-format': 'yyyy-MM-dd',
            endPlaceholder: '年/月'
          }
        }
      ],
      columns: [
        {
          label: '签单产品',
          width: '120',
          prop: 'productName'
        }, {
          label: '签单金额',
          width: '120',
          prop: 'amount'
        }, {
          label: '签单时间',
          width: '120',
          prop: 'createLocalDate'
        }
      ]
    }
  },
  created () {
    this.total()
    this.init()
  },
  methods: {
    showDetail (item) {
      this.detailId = item.orderId
      this.$refs.detail.show()
    },
    download (url) {
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    total () {
      queryDealTotal().then(res => {
        this.tipData[0].digit = res.data.dailyBillingAmount
        this.tipData[1].digit = res.data.weeklySigningAmount
        this.tipData[2].digit = res.data.monthlyBillingAmount
      })
    },
    init () {
      queryDealRecord({
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        paged: this.pageInfo.paged,
        sort: this.pageInfo.paged,
        orderNo: this.tableParams.orderNo,
        customerName: this.tableParams.customerName,
        startDate: this.tableParams.startDate,
        endDate: this.tableParams.endDate
      }).then(res => {
        this.tableData = res.data
        this.tableData.content = (res.data.content || []).map(cur => {
          cur.createLocalDate = parseTime(cur.createLocalDate, '{y}-{m}-{d}')
          cur.amount = cur.amount.toFixed(2)
          return cur
        })
      })
    },
    search (e) {
      e.forEach(cur => {
        if (cur.prop === 'date') {
          this.tableParams.startDate = `${cur.value[0]} 00:00:00`
          this.tableParams.endDate = `${cur.value[1]} 23:59:59`
        } else {
          this.tableParams[cur.prop] = cur.value
        }
      })

      this.init()
    },
    reset () {
      this.tableParams = {
        orderNo: null,
        customerName: null,
        startDate: null,
        endDate: null
      }

      this.init()
    },
    changeCommand (e) {
      switch (e) {
        case 'batchDelete':

          break
        case 'batchGet':

          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.my-customer-wrap{

}
</style>
