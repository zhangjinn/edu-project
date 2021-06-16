<template>
  <div class="detail-wrap">
    <etm-drawer
      type="big"
      :visible.sync="isShow"
    >
      <etm-layout-split>
        <div>
          <etm-title
            :show-line="false"
            border
          >
            详情
          </etm-title>

          <div>
            <el-row class="row">
              <el-col :span="8">
                <etm-field-label label="单号">
                  {{ row.orderNo }}
                </etm-field-label>
              </el-col>
              <el-col :span="8">
                <etm-field-label label="客户名称">
                  {{ row.customerName }}
                </etm-field-label>
              </el-col>
              <el-col :span="8">
                <etm-field-label label="签单时间">
                  {{ row.createLocalDate }}
                </etm-field-label>
              </el-col>

              <el-col :span="8">
                <etm-field-label label="经办人">
                  {{ row.employeePrivilegeCacheName }}
                </etm-field-label>
              </el-col>
              <el-col :span="8">
                <etm-field-label label="签单金额">
                  {{ row.amount | toFixed }}
                </etm-field-label>
              </el-col>
            </el-row>

            <etm-title>签单产品</etm-title>
            <nesting-table
              v-model="templateData"
              :map="map"
              :disable="false"
              :is-delete="false"
            />

            <etm-field-label label="备注">
              {{ row.remarks }}
            </etm-field-label>
            <etm-field-label label="附件">
              <div v-if="!row.annex.length">
                无
              </div>
              <div
                v-for="(item, index) in row.annex"
                :key="index"
                @click="download(item.url)"
              >
                <etm-text>{{ item.name }}</etm-text><i class="iconfont icondownload" />
              </div>
            </etm-field-label>
          </div>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import nestingTable from '@/views/listCustomer/myCustomer/components/pops/nestingTable3'
import {
  queryDealRecordDetail
} from '@/api/customer'
import { parseTime } from '@/utils'
export default {
  name: 'Detail',
  components: {
    nestingTable
  },
  filters: {
    toFixed (n) {
      return n.toFixed(2)
    }
  },
  props: {
    orderId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      templateData: [],
      map: {
        id: 'productId',
        name: 'productName',
        netReceipts: 'paid', // 实收
        give: 'give', // 赠送
        receivable: 'receivable', // 应收
        purchase: 'quantity', // 购买
        img: 'productCover',
        modify: 'modify',
        netReceiptsNotes: 'paidSubtotal', // 实收总额
        receivableNotes: 'receivableSubtotal', // 应收总额
        cacSetMealEnum: 'cacSetMealEnum', // 类型
        childList: 'childList'
      },
      isShow: false,
      row: {
        amount: 0,
        annex: []
      }
    }
  },
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.$nextTick(() => {
            this.init()
          })
        }
      }
    }
  },
  methods: {
    download (url) {
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    init () {
      queryDealRecordDetail(this.orderId).then(res => {
        res.data.createLocalDate = parseTime(res.data.createLocalDate, '{y}-{m}-{d}')
        res.data.annex = res.data.annex || []
        this.row = res.data
        this.templateData = res.data.orderItemList
      })
    },
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }

  }
}
</script>

<style scoped lang="scss">
::v-deep{
  .EtmText-wrap{
    margin-right: 8px;
  }
}
.detail-wrap{

}
</style>
