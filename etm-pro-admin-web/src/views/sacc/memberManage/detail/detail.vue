<template>
  <div class="det">
    <!-- <div class="controlBtn">
      <el-button class="refund" @click="refund">退费</el-button>
      <el-button @click="sign">签单</el-button>
    </div> -->
    <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
      <el-tab-pane :label="$t('memberManage.detailTabsLabelStatus')" name="status">
        <status :content="statusData" />
      </el-tab-pane>
      <el-tab-pane :label="$t('memberManage.detailTabsLabelItem')" name="item">
        <item :content="itemData" />
      </el-tab-pane>
      <el-tab-pane :label="$t('memberManage.detailTabsLabelFood')" name="food">
        <food :content="foodData" />
      </el-tab-pane>
      <el-tab-pane :label="$t('memberManage.detailTabsLabelMedicine')" name="medicine">
        <medicine :content="medicineData" />
      </el-tab-pane>
      <!-- <el-tab-pane label="单据列表" name="bill">
        <bill />
      </el-tab-pane>
      <el-tab-pane label="账户信息" name="account">
        <account />
      </el-tab-pane> -->
    </etm-tabs>
    <etm-side
      :visible="showList"
      :append-to-body="false"
      title="选择退费单据"
      @close="closeRefund"
    >
      <slot>
        <div class="sideTable">
          <el-table
            :data="tableData"
          >
            <el-table-column
              prop="code"
              label="单据号"
            />

            <el-table-column
              prop="amount"
              label="收款金额"
            />

            <el-table-column
              prop="state"
              label="单据状态"
            >
              <template slot-scope="{row}">
                <label>{{ getState(row.state) }}</label>
              </template>
            </el-table-column>

            <el-table-column
              prop="guardianName"
              label="单据生效日"
            >
              <template slot-scope="{row}">
                <label>{{ handleTime(row.startTime) }}</label>
              </template>
            </el-table-column>

            <el-table-column
              prop="guardianName"
              label="单据结束日"
            >
              <template slot-scope="{row}">
                <label>{{ handleTime(row.endTime) }}</label>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
            >
              <template slot-scope="{row}">
                <el-button v-if="row.state === 'NORMAL' || row.state === 'VOID'" type="text" size="small" @click="toRefund(row)">退费</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </slot>
    </etm-side>
  </div>
</template>
<script>
import status from './tabs/status'
import item from './tabs/item'
import food from './tabs/food'
// import bill from './tabs/bill'
import medicine from './tabs/medicine'
// import account from './tabs/account'
import EtmSide from '@/layout/main/EtmSide'

import { getInvoicesList } from '@/api/sacc'

export default {
  components: {
    status,
    item,
    food,
    medicine,
    EtmSide
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    },
    // eslint-disable-next-line vue/require-default-prop
    memberId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      activeName: 'status',
      statusData: null,
      itemData: null,
      foodData: null,
      medicineData: null,
      showList: false,
      tableData: null
    }
  },
  watch: {
    content(v) {
      this.statusData = v.studentStatusInfo || {}
      this.itemData = v.belongings || []
      this.foodData = v.dietInfo || []
      this.medicineData = v.medication || {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        customerId: this.memberId
      }
      getInvoicesList(param).then(res => {
        this.tableData = res.data
      })
    },
    handleTime(time, type) {
      if (!time) {
        return '-'
      }
      const date = new Date(time)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      if (type === 'hm') {
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m
      } else {
        return y + '-' + MM + '-' + d
      }
    },

    getState(val) {
      if (val === 'NORMAL') {
        return '有效'
      } else if (val === 'SETTLED') {
        return '完成'
      } else if (val === 'REFUND') {
        return '退费'
      } else if (val === 'VOID') {
        return '作废'
      } else if (val === 'OVERDUE') {
        return '过期'
      }
    },
    // 退费
    refund() {
      this.showList = true
    },
    closeRefund() {
      this.showList = false
    },
    toRefund(row) {
      this.showList = false
      this.$store.commit('billInfo/SET_BILL_ID', row.id)
      this.$emit('toRefund')
    },
    // 签单
    sign() {
      this.$emit('toSign')
    }
  }
}
</script>

<style scoped lang="scss">
.det {
  position: relative;
  padding-bottom: 16px;
  .controlBtn {
    z-index: 10;
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 24px;
    font-size: 0;
    height: 48px;
    @include bgc_white();
    & >>> .el-button {
      padding: 9px 25px;
      span {
        @include c_white();
      }
      &.refund {
        @include bgc_white();
        @include bc_error_color();
        span {
          @include c_error_color();
        }
      }
    }
  }
  &/deep/.el-drawer.rtl{
    width: 800px!important;
  }
  & >>> .EtmTitle-wrap {
    margin-bottom: 0;
  }
}
</style>
