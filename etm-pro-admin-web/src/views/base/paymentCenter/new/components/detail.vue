<template>
  <div class="detail-wrap">
    <etm-drawer
      :visible.sync="showSide"
      type="big"
    >
      <etm-layout-split>
        <etm-title :show-line="false" border size="big">
          {{ title }}
        </etm-title>

        <etm-tool-bar v-model="formData_class" @search="handleSearch($event)" @reset="reset" />

        <etm-table-page :columns="columns" :data="table">

          <el-table-column slot="left" label="订单号">
            <template v-slot="scoped">
              <etm-text @click="showDetail(scoped.row)">{{ scoped.row.orderNo }}</etm-text>
            </template>
          </el-table-column>

        </etm-table-page>
      </etm-layout-split>
    </etm-drawer>

    <order-detail :id="currentId" ref="orderDetail" />
  </div>
</template>

<script>
import {
  queryRechargeOrder
} from '@/api/base/base'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import orderDetail from './order'
export default {
  name: 'Detail',
  components: {
    orderDetail
  },
  mixins: [baseMixin],
  props: {
    prop: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showSide: false,
      currentId: 0,
      formData_class: [
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
          label: '充值时间',
          type: 'date',
          prop: 'date',
          value: null,
          props: {
            type: 'daterange',
            'range-separator': '-',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        }
      ],
      titleType: {
        'MESSAGE': '短信数量',
        'CALL': '通话时长',
        'CLOUD_DISK': '云盘空间'
      },
      columns: [
        {
          label: '充值类型',
          prop: 'items',
          width: '120'
        },
        {
          label: '充值金额',
          prop: 'amount',
          width: '120'
        },
        {
          label: '充值时间',
          prop: 'payTime',
          width: '120'
        },
        {
          label: '支付方式',
          prop: 'payMethod',
          width: '120'
        },
        {
          label: '支付人',
          prop: 'operator',
          width: '120'
        }
      ],
      payType: {
        'CASH': '现金',
        'ALIPAY': '支付宝',
        'WECHAT': '微信',
        'BANK': '银行转账'
      },
      table: {
        content: []
      },
      params: {
        startDate: null,
        endDate: null,
        orderNo: null,
        type: ''
      }
    }
  },
  computed: {
    title() {
      return `${this.titleType[this.prop.type]}充值记录`
    }
  },
  watch: {
    prop: {
      deep: true,
      handler(n) {
        this.init({
          type: n.type
        })
      }
    }
  },
  methods: {
    showDetail(row) {
      this.currentId = row.orderId
      this.$refs.orderDetail.show()
    },
    handleSearch(event) {
      const result = {
        type: this.prop.type
      }
      event.forEach(cur => {
        if (cur.prop === 'date') {
          result.startDate = cur['value'][0]
          result.endDate = cur['value'][1]
        } else {
          result[cur.prop] = cur.value
        }
      })
      this.pageInfo.page = 1
      this.init(result)
    },
    reset() {
      this.pageInfo.page = 1
      this.init({
        type: this.prop.type
      })
    },
    show() {
      this.showSide = true
    },
    hide() {
      this.showSide = false
    },
    init(searchParams) {
      const params = Object.assign({}, this.pageInfo, this.params, searchParams)
      queryRechargeOrder(params).then(res => {
        this.table = res.data
        this.table.content = res.data.content.map(cur => {
          cur.payMethod = this.payType[cur.payMethod]
          cur.payTime = parseTime(cur.payTime, '{y}-{m}-{d}')

          return cur
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail-wrapv{

}
</style>
