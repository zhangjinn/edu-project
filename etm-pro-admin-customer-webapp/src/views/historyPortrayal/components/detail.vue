<template>
  <div class="detail-wrap">
    <etm-drawer
      :visible.sync="showSide"
      type="big"
    >
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          AI碰客点数充值记录
        </etm-title>

        <etm-tool-bar
          v-model="formData_class"
          @search="handleSearch($event)"
          @reset="reset"
        />

        <etm-table-page
          :columns="columns"
          :data="table"
          @currentChange="currentChange"
        >
          <el-table-column
            slot="left"
            label="订单号"
          >
            <template v-slot="scoped">
              <!--              @click="showDetail(scoped.row)"-->
              <etm-text>
                {{ scoped.row.orderNo }}
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </etm-layout-split>
    </etm-drawer>

    <order-detail
      :id="currentId"
      ref="orderDetail"
    />
  </div>
</template>

<script>
import {
  queryPortrayalLog
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
      default () {
        return {}
      }
    }
  },
  data () {
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
      state: {
        HAVE_PAID: '已支付',
        UNPAID: '待支付'
      },
      payChannel: {
        ALIPAY: '支付宝',
        WECHAT: '微信',
        WECHAT_JSAPI: '微信公众号'
      },
      columns: [
        {
          label: '充值类型',
          prop: 'payMethod',
          width: '120'
        },
        {
          label: '充值金额',
          prop: 'amount',
          width: '120'
        },
        {
          label: '充值时间',
          prop: 'createTime',
          width: '120'
        },
        {
          label: '支付方式',
          prop: 'payChannel',
          width: '120'
        },
        {
          label: '支付人',
          prop: 'operatorName',
          width: '120'
        }
      ],
      payType: {
        CASH: '现金',
        ALIPAY: '支付宝',
        WECHAT: '微信',
        BANK: '银行转账'
      },
      table: {
        content: []
      },
      pageConfig: {
        pageNum: 1,
        pageSize: 10
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
  },
  watch: {
    showSide: {
      handler (n) {
        this.init({})
      }
    }
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    showDetail (row) {
      this.currentId = row.orderId
      this.$refs.orderDetail.show()
    },
    handleSearch (event) {
      const result = {
        type: this.prop.type
      }
      event.forEach(cur => {
        if (cur.prop === 'date') {
          result.startDate = cur.value[0]
          result.endDate = cur.value[1]
        } else {
          result[cur.prop] = cur.value
        }
      })
      this.pageInfo.pageNum = 1
      this.init(result)
    },
    reset () {
      this.pageInfo.pageNum = 1
      this.init({})
    },
    show () {
      this.showSide = true
    },
    hide () {
      this.showSide = false
    },
    init (searchParams) {
      const params = Object.assign({}, this.pageInfo, this.params, searchParams)
      queryPortrayalLog(params).then(res => {
        this.table = res.data
        this.table.content = res.data.content.map(cur => {
          cur.payMethod = '点数'
          cur.createTime = cur.createTime ? parseTime(cur.createTime, '{y}-{m}-{d}') : ''
          cur.state = this.state[cur.state]
          cur.payChannel = this.payChannel[cur.payChannel]
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
