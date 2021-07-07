<template>
  <div class="billInfo" :class="type">
    <div class="titleText">支付详情</div>
    <div class="infoform">
      <el-form label-position="left">
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="单据有效期:">
                <label>
                  {{ billDetail.feesDetail.validity }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="单据生效日:">
                <label>
                  {{ handleTime(billDetail.feesDetail.startDate) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="单据结束日:">
                <span class="paid">
                  {{ handleTime(billDetail.feesDetail.endDate) }}
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="支付渠道:">
                <label>
                  {{ getPayMethod(billDetail.feesDetail.payMethod) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="支付时间:">
                <label>
                  {{ handleTime(billDetail.invoicesInfo.payTime) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="支付金额:">
                <label>
                  {{ getPayTotal(billDetail.invoicesInfo.payState, billDetail.feesDetail.items) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  props: ['billDetail', 'type'],
  methods: {
    getPayMethod(way) {
      if (way === 'WECHAT') {
        return '微信支付'
      } else if (way === 'ALIPAY') {
        return '支付宝'
      } else if (way === 'UNIONPAY') {
        return '银行转账'
      } else if (way === 'CASH') {
        return '现金'
      } else if (way === 'POS') {
        return 'POS机刷卡'
      } else {
        return '-'
      }
    },
    getPayTotal(state, item) {
      if (state === 'NOPAY') {
        return '-'
      }
      let total = 0
      item.forEach(i => {
        total += (i.price * i.num)
      })
      return total
    },
    handleTime(time) {
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
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m
    }
  }
}

</script>

<style scoped lang="scss">
.billInfo{
  &.pop::after{
    border: none!important;
  }
}
</style>
