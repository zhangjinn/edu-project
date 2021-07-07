<template>
  <div class="refund">
    <etm-title>结算详情</etm-title>
    <div class="refundinfo">
      <el-form label-position="left">
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="结算时间:">
                <label>
                  {{ billDetail.feesDetail.customerName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="入账金额:">
                <label>
                  {{ billDetail.invoicesInfo.employeeName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="退费金额:">
                <label>
                  {{ billDetail.invoicesInfo.payState }}
                </label>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="dragItem">
          <el-col :span="8">
            <div>
              <el-form-item label="金额去向:">
                <label>
                  {{ billDetail.feesDetail.customerName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="退费方式:">
                <label>
                  {{ billDetail.invoicesInfo.employeeName }}
                </label>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" />
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
