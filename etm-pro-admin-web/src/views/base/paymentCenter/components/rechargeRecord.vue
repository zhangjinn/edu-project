<template>
  <div class="callRecords">
    <div class="tableHandle">
      <el-form>
        <el-form-item>
          <template slot="label">
            <span>充值日期:</span>
          </template>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="change"
          />
        </el-form-item>
      </el-form>
      <el-button plain @click="recharge">充值</el-button>
    </div>

    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <el-table-column
        slot="left"
        label="订单号"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scoped">
          <span class="orderNumber" @click="detail(scoped.row, scoped.$index)">{{ scoped.row.orderNo }}</span>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-drawer :visible.sync="sideVisible" @close="sideClose">
      <etm-layout-split>
        <etm-title title="订单详情" border size="big" />
        <etm-field-label type="left" label="订单号"> {{ details.orderNumber }}</etm-field-label>
        <etm-field-label type="left" label="充值组织"> {{ details.rechargeOrg }}</etm-field-label>
        <etm-field-label type="left" label="充值套餐">
          <template v-for="(item,index) of details.phoneRechargePackage">
            <span v-if="item.type === 'CALL'" :key="index">电话 {{ item.num }} 分钟</span>
            <span v-if="item.type === 'MESSAGE'" :key="index">短信 {{ item.num }} 条</span>
            <span v-if="item.type === 'CLOUD_DISK'" :key="index">云盘 {{ item.num }} GB</span>
          </template>
        </etm-field-label>
        <etm-field-label type="left" label="支付金额"> {{ details.paymentAmount }}</etm-field-label>
        <etm-field-label type="left" label="支付方式"> {{ details.paymentMethod }}</etm-field-label>
        <etm-field-label type="left" label="支付人"> {{ details.payer }}</etm-field-label>
        <etm-field-label type="left" label="支付时间"> {{ details.paymentTime }}</etm-field-label>

      </etm-layout-split>
    </etm-drawer>

    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="充值"
      confirm-btn="支付"
      cancel-btn="取消"
      @close="popClose"
      @cancel="popClose"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <recharge v-if="popVisible" org="123" @protocol="protocol" @pay="pay" />
      </div>
    </etm-pop>

    <etm-pop
      :visible="popPayVisible"
      class="payPop"
      title="支付"
      @close="popPayClose"
      @cancel="popPayClose"
      @confirm="popPayConfirm"
    >
      <div class="popContent">
        <pay v-if="popPayVisible" :choose-package="choosePackage" />
      </div>
    </etm-pop>

    <etm-pop
      :visible="popVisibleProtocol"
      pop="complex"
      title="增值服务及使用协议"
      @close="popCloseProtocol"
      @cancel="popCloseProtocol"
      @confirm="popConfirmProtocol"
    >
      <div class="popContent">
        <service-agreement v-if="popVisibleProtocol" />
      </div>
    </etm-pop>
  </div>
</template>

<script>
import etmPop from '@/layout/main/EtmPop'
import recharge from './recharge/recharge'
import pay from './pay/pay'
import serviceAgreement from '../serviceAgreement'

import { enumerationFilter, parseTime } from '@/utils'
import { getRechargeOrder, getRechargeOrderDetails } from '@/api/base/paymentCenter'

export default {
  name: 'CallRecords',
  components: {
    etmPop,
    recharge,
    pay,
    serviceAgreement
  },
  props: {
    org: {
      type: String
    }
  },
  data() {
    return {
      sideVisible: false,
      popVisible: false,
      popPayVisible: false,
      popVisibleProtocol: false,
      date: '',
      pageSize: 10,
      pageNum: 1,

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '充值类型',
          prop: 'items',
          align: 'left'
        },
        {
          label: '充值金额',
          prop: 'amount',
          align: 'left'
        },
        {
          label: '充值时间',
          prop: 'payTime',
          align: 'left'
        },
        {
          label: '支付方式',
          prop: 'enumPayMethod',
          align: 'left'
        },
        {
          label: '支付人',
          prop: 'operator',
          align: 'left'
        }
      ],
      details: {
        orderNumber: null,
        rechargeOrg: null,
        phoneRechargePackage: null,
        paymentAmount: null,
        paymentMethod: null,
        payer: null,
        paymentTime: null
      },
      // table传参
      tableParameter: {
        startDate: null,
        endDate: null
      },
      // 支付方式枚举
      payMethodOption: [
        {
          name: '现金',
          value: 'CASH'
        },
        {
          name: '支付宝',
          value: 'ALIPAY'
        },
        {
          name: '微信',
          value: 'WECHAT'
        },
        {
          name: '银行转账',
          value: 'BANK'
        }
      ],
      choosePackage: {}
    }
  },
  created() {
    this.getTableData()
  },

  methods: {
    // 分页触发事件
    currentChange(num, size) {
      this.pageNum = num
      this.pageSize = size
      this.getTableData()
    },
    getTableData() {
      const param = {
        startDate: this.tableParameter.startDate,
        endDate: this.tableParameter.endDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getRechargeOrder(param).then((res) => {
        const { data } = res
        this.tableData = data
        if (this.tableData.content) {
          this.tableData.content.forEach((item, index) => {
            item.enumPayMethod = enumerationFilter(item.payMethod, this.payMethodOption)
            item.payTime = item.payTime ? parseTime(item.payTime) : item.payTime
          })
        }
      })
    },

    // 搜索条件改变
    change(val) {
      if (val) {
        this.tableParameter.startDate = val[0]
        this.tableParameter.endDate = val[1]
      } else {
        this.tableParameter.startDate = null
        this.tableParameter.endDate = null
      }
      this.pageNum = 1
      this.getTableData()
    },

    // 打开电话充值窗口
    recharge() {
      this.popVisible = true
    },

    popClose() {
      this.popVisible = false
    },

    // 打开支付窗口
    popConfirm() {
      this.choosePackage.id = this.choosePackage.id.filter(item => item)
      if (this.choosePackage.id.length <= 0) {
        this.$message.warning('请选择一个套餐')
        return
      }
      this.popPayVisible = true
    },
    popPayClose() {
      this.popPayVisible = false
      this.getTableData()
    },
    popPayConfirm() {
      this.popPayVisible = false
      this.popVisible = false
      this.getTableData()
    },
    // 打开协议
    protocol() {
      this.popVisibleProtocol = true
    },

    // 支付
    pay(val) {
      this.choosePackage = val
    },
    popCloseProtocol() {
      this.popVisibleProtocol = false
    },
    popConfirmProtocol() {
      this.popVisibleProtocol = false
    },

    // 详情
    detail(row) {
      const id = row.orderId
      getRechargeOrderDetails(id).then((res) => {
        const { data } = res
        this.details.orderNumber = data.orderNo
        this.details.rechargeOrg = data.organization
        this.details.phoneRechargePackage = data.items
        this.details.phoneRechargePackage.map((val) => {
          if (val.type === 'CALL') {
            val.num = Math.floor(val.num / 60)
          }
        })
        this.details.paymentAmount = data.amount
        this.details.paymentMethod = enumerationFilter(data.payMethod, this.payMethodOption)
        this.details.payer = data.operator
        this.details.paymentTime = data.payTime ? parseTime(data.payTime) : data.payTime
      })
      this.sideVisible = true
    },
    sideClose() {
      this.sideVisible = false
    }

  }
}
</script>

<style scoped lang="scss">
.callRecords {
  .tableHandle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .el-form .el-form-item {
      display: flex;
      margin-bottom: 0;
    }
  }

  .orderNumber {
    @include c_main_color();
    cursor: pointer;
  }
}

.sideContent {
  padding: 0 16px;
}

/deep/ .payPop {
  .el-dialog {
    .el-dialog__footer {
      display: none;
    }
  }
}

.popContent {
  max-height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
