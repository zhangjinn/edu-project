<template>
  <div class="refund">
    <etm-title>退费详情</etm-title>
    <div class="refundinfo">
      <el-form label-position="left">
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="退费时间:">
                <label>
                  {{ handleTime(billDetail.refundTime) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="退费金额:">
                <label>
                  {{ billDetail.balance_amount }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="金额去向:">
                <label>
                  {{ getWay(billDetail.refundWay.way) }}
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
import EtmTitle from '@/layout/main/EtmTitle'
export default {
  name: 'Index',
  components: {
    EtmTitle
  },
  props: ['billDetail'],
  methods: {
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
    },
    getWay(way) {
      if (way === 'BALANCE') {
        return '余额'
      } else if (way === 'ALIPAY') {
        return '支付宝'
      } else if (way === 'WECHAT') {
        return '微信'
      } else if (way === 'CASH') {
        return '现金'
      } else {
        return '银行转账'
      }
    }
  }
}

</script>

<style scoped lang="scss">
.refund{
  .refundinfo{
    padding: 24px 24px 0;
  }
}
</style>
