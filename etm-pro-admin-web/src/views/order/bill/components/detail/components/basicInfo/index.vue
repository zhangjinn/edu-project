<template>
  <div class="billInfo">
    <div class="titleText">基础信息</div>
    <div class="infoform">
      <el-form label-position="left">
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="会员:">
                <label>
                  {{ billDetail.feesDetail.customerName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="办理人:">
                <label>
                  {{ billDetail.invoicesInfo.employeeName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="支付状态:">
                <span :class="billDetail.invoicesInfo.payState === 'NOPAY' ? 'warnText' : ''">
                  {{ getPayState(billDetail.invoicesInfo.payState) }}
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="单据生成时间:">
                <label>
                  {{ handleTime(billDetail.invoicesInfo.invoiceCreateTime) }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="单据号:">
                <label>
                  {{ billDetail.invoicesInfo.invoiceCode }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="单据状态:">
                <label>
                  {{ getState(billDetail.invoicesInfo.state) }}
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
  props: ['billDetail'],
  methods: {
    getPayState(state) {
      if (state === 'PAID') {
        return '已支付'
      } else {
        return '未支付'
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
    handleTime(time) {
      if (!time) {
        return '未录入'
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
.warnText{
  @include c_error_color();
}
</style>
