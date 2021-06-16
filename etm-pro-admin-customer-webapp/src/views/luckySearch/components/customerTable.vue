<template>
  <div class="customerTable-wrap">
    <div class="top-content">
      <!--      <div v-for="(item, index) in valueArr" :key="index" class="customer-info">-->
      <!--        <div class="top">{{ item.topVal }}</div>-->
      <!--        <div class="bottom" :style="{color: item.color}">{{ item.bottomVal }}</div>-->
      <!--      </div>-->
      <template v-for="(value, key, index) in statisticalData">
        <div
          v-if="!['nextTakeTime', 'nowTime'].includes(key)"
          :key="index"
          class="customer-info"
        >
          <div class="top">
            <span>{{ setTopText(key) }}</span>
            <span
              v-if="key === 'remanentContactable'"
              class="iconfont icontianjia"
              @click="handlePay"
            />
          </div>
          <div
            class="bottom"
            :style="{color: setColor(key)}"
          >
            {{ value }}
          </div>
        </div>
      </template>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="545"
      >
        <el-table-column
          prop="customer"
          label="潜在客户"
        >
          <template slot-scope="{$index}">
            <div class="content">
              <div class="number">
                {{ String($index + 1).padStart(2, '0') }}
              </div>
              <span class="iconfont iconmorentouxiang" />
            </div>
          </template>
        </el-table-column>
        <template v-if="type === 'OUTER'">
          <el-table-column
            prop="tags"
            label="标签"
            show-overflow-tooltip
            min-width="250%"
          >
            <template slot-scope="{row}">
              <div class="content">
                <div
                  v-for="(item, index) in row.tagList"
                  :key="index"
                  class="tag"
                >
                  {{ item }}
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          prop="status"
          label="沟通状态"
          sortable
        >
          <template slot-scope="{row}">
            <div class="content">
              <div :class="[setClass(row.status), 'radius']" />
              <div class="status">
                {{ row.status === 'COMMUNICATED' ? '已沟通' : '未沟通' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
        >
          <template slot-scope="{row}">
            <div class="content">
              <div
                class="phone"
                @click="handleCallUp(row)"
              >
                <span class="iconfont icontonghuashichang" />
              </div>
              <div
                class="message"
                @click="handleMessage(row)"
              >
                <span class="iconfont iconfaduanxin4" />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <button-drag @handleClick="handleGroupMessage" />

    <!--    打电话弹窗 TODO:等花椒保存接口-->
    <CallUp
      :show-pop-call-up.sync="showPopCallUp"
      :tag-list.sync="tagList"
      :demo="demo"
      :result-customer-address-id="resultCustomerAddressId"
      :type="type"
    />

    <!--    发短信-->
    <send-message
      :show-pop-send-message.sync="showPopSendMessage"
      :group-message.sync="groupMessage"
      :result-customer-address-id-list.sync="resultCustomerAddressIdList"
      :table-data="tableData"
      :type="type"
    />
  </div>
</template>

<script>
/**
   * customerTable create by 油麦菜
   * createTime 2021/1/11 19:15
   */
import CallUp from './callUp'
import sendMessage from './sendMessage'
import buttonDrag from '@/views/radarSearch/components/buttonDrag'
export default {
  name: 'CustomerTable',
  components: {
    CallUp,
    sendMessage,
    buttonDrag
  },
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: '',
      required: true,
      validator: function (value) {
        return ['OUTER', 'AI'].includes(value)
      }
    },
    statistical: {
      type: Object,
      default () {
        return {}
      }
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      demo: false,
      showPopCallUp: false,
      showPopSendMessage: false,
      groupMessage: false,
      callTime: null,
      tagList: [],
      resultCustomerAddressIdList: [],
      resultCustomerAddressId: 0,
      statisticalData: {
        today: '',
        week: '',
        month: '',
        total: '',
        haveCustomer: '',
        remanentContactable: '',
        explore: ''
      }
    }
  },
  computed: {},
  watch: {
    statistical (val) {
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          this.statisticalData[key] = val[key]
        }
      }
      this.addKey()
      this.deleteKey()
    },
    tableData (val) {
      this.$set(this.statisticalData, 'total', val.length)
    }
  },
  created () {
  },
  mounted () {
    // this.addKey()
    // this.deleteKey()
  },
  methods: {
    setClass (status) {
      switch (status) {
        case 'COMMUNICATED':
          return 'pass'
        case 'NOT_COMMUNICATED':
          return 'no-pass'
      }
    },
    setTopText (key) {
      switch (key) {
        case 'today':
          return '今日已收客'
        case 'week':
          return '本周已收客'
        case 'month':
          return '本月已收客'
        case 'total':
          return '总收客数'
        case 'haveCustomer':
          return '探索到的客户'
        case 'remanentContactable':
          return '剩余可联系'
        case 'explore':
          return '已联系'
      }
    },
    setColor (key) {
      switch (key) {
        case 'today':
          return '#FFC548'
        case 'week':
          return '#61FFF2'
        case 'month':
          return '#FF869A'
        case 'total':
          return '#23F477'
        case 'haveCustomer':
          return '#FFC548'
        case 'remanentContactable':
          return '#FF869A'
        case 'explore':
          return '#23F477'
      }
    },
    addKey () {
      this.$set(this.statisticalData, 'total', this.tableData.length)
      this.$set(this.statisticalData, 'haveCustomer', this.tableData.length)
    },
    deleteKey () {
      if (this.type === 'OUTER') {
        // this.statistical
        this.$delete(this.statisticalData, 'remanentContactable')
        this.$delete(this.statisticalData, 'explore')
        this.$delete(this.statisticalData, 'haveCustomer')
      } else if (this.type === 'AI') {
        this.$delete(this.statisticalData, 'today')
        this.$delete(this.statisticalData, 'week')
        this.$delete(this.statisticalData, 'month')
        this.$delete(this.statisticalData, 'total')
      }
    },

    handleCallUp (row) {
      this.resultCustomerAddressId = row.resultCustomerAddressId
      this.demo = row.demo || false
      this.tagList = row.tagList
      this.showPopCallUp = true
    },
    handleMessage (row) {
      this.resultCustomerAddressIdList = [{ id: row.resultCustomerAddressId, demo: false }]
      this.groupMessage = false
      this.showPopSendMessage = true
    },
    handleGroupMessage () {
      this.groupMessage = true
      this.showPopSendMessage = true
    },
    handlePay () {
      console.log('剩余可联系点击')
    }
  }
}
</script>
<style lang="scss" scoped>
  .customerTable-wrap {
    position: relative;
    padding: 15px;
    /*width: calc(0.5 * 100vw);*/
    width: 100%;
    /*min-width: 530px;*/
    height: 100%;
    background: rgba(90, 90, 90, 0.16);
    border: 1px solid #FFD886;
    .top-content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .customer-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 166px;
        height: 92px;
        text-align: center;
        background: url("../../../assets/images/customer-info.png") no-repeat;
        background-size: 100% 100%;
        .top {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          line-height: 16px;
          font-weight: 400;
          color: #FFFFFF;
          .icontianjia {
            margin-left: 6px;
            font-size: 10px;
            color: #FFC548;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .bottom {
          font-size: 24px;
          font-weight: 700;
          color: #FFBE31!important;
        }
      }
    }

    .table-container {
      width: 100%;
      /*background: rgba(14, 118, 238, 0.16);*/

      /*::v-deep .el-table {*/
      /*  height: calc(100% - 100px);*/
      /*}*/

      ::v-deep .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
        width: 7px;
        height: 1px;
      }

      ::v-deep .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background: #525252;
        border-radius: 4px;
      }

      ::v-deep .el-table::before {
        background-color: transparent;
      }

      ::v-deep .el-table tbody tr:hover>td {
        background-color:rgba(#353535, .3)!important
      }

      ::v-deep .el-table, ::v-deep .el-table__expanded-cell {
        background: transparent;
      }

      ::v-deep .el-table th, ::v-deep .el-table tr {
        font-size: 14px;
        font-weight: 700;
        color: #FFFFFF;
        background: rgba(#353535, .3);
      }

      ::v-deep .el-table th {
        background: #312E27;
      }

      ::v-deep .el-table td {
        .cell {
          padding: 4px;
        }
      }

      ::v-deep .el-table tr {
        font-weight: 400;
        .content {
          display: flex;
          align-items: center;
          .number {
            padding: 0 8px;
          }
          .iconmorentouxiang {
            color: #ffffff;
            font-size: 25px;
          }
          .tag {
            margin-right: 5px;
            padding: 0 8px;
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            background: #9D7826;
            border: 1px solid #FFBF35;
            border-radius: 2px;
          }
          .radius {
            margin-right: 6px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }
          .pass {
            background: #FF7E26;
          }
          .no-pass {
            background: #DDDDDD;
          }
          .phone {
            margin-right: 12px;
            .icontonghuashichang {
              color: #FFC548;
              font-size: 24px;
              &:hover {
                cursor: pointer;
              }
            }
          }
          .message {
            .iconfaduanxin4 {
              color: #FF7E26;
              font-size: 24px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }

      ::v-deep .el-table tr:nth-child(2n-1) {
        background: transparent!important;
      }

      ::v-deep .el-table td, ::v-deep .el-table th.is-leaf {
        border: none;
      }

      ::v-deep .el-table__empty-text {
        color: #ffffff;
      }
    }

    /*.group-message {*/
    /*  display: flex;*/
    /*  justify-content: flex-start;*/
    /*  align-items: center;*/
    /*  position: absolute;*/
    /*  right: 0;*/
    /*  bottom: 25px;*/
    /*  width: 146px;*/
    /*  height: 40px;*/
    /*  background: #104ABA;*/
    /*  border: 1px solid #0058FF;*/
    /*  box-shadow: 0 8px 10px 0 rgba(0, 19, 64, 0.3);*/
    /*  border-radius: 2px;*/
    /*  &:hover {*/
    /*    cursor: pointer;*/
    /*  }*/
    /*  .iconqunfaduanxin {*/
    /*    margin-left: 16px;*/
    /*    margin-right: 12px;*/
    /*    color: #ffffff;*/
    /*    font-size: 26px;*/
    /*  }*/
    /*  .msg {*/
    /*    font-size: 14px;*/
    /*    font-weight: 400;*/
    /*    color: #FFFFFF;*/
    /*  }*/
    /*}*/
    ::v-deep .el-table .descending .sort-caret.descending {
      border-top-color: #FFBD34;
    }
    ::v-deep .el-table .ascending .sort-caret.ascending {
      border-bottom-color: #FFBD34;
    }
  }
</style>
