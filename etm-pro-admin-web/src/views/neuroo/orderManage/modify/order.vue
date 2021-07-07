<template>
  <div class="order">
    <etm-form ref="orderForm" :rules="rules" :model="orderForm">
      <el-form-item label="订单编号：" prop="orderNo">
        {{ orderForm.orderNo }}
      </el-form-item>
      <el-form-item label="签约客户：" prop="customerName">
        {{ orderForm.customerName }}
      </el-form-item>
      <el-form-item label="付费课时：" prop="payHour">
        <el-input v-model="orderForm.payHour" />
      </el-form-item>
      <el-form-item label="赠送课时：" prop="giveHour">
        <el-input v-model="orderForm.giveHour" />
      </el-form-item>
      <el-form-item label="剩余付费课时：" prop="leftPayHour">
        <el-input v-model="orderForm.leftPayHour" />
      </el-form-item>
      <el-form-item label="剩余赠送课时：" prop="leftGiveHour">
        <el-input v-model="orderForm.leftGiveHour" />
      </el-form-item>
      <el-form-item label="已补课时：" prop="usedSupplementHour">
        <el-input v-model="orderForm.usedSupplementHour" />
      </el-form-item>
      <el-form-item label="需补课时：" prop="supplementHour">
        <el-input v-model="orderForm.supplementHour" />
      </el-form-item>
      <el-form-item label="开始日期：" prop="startDate">
        <el-date-picker
          v-model="orderForm.startDate"
          type="date"
          placeholder="请选择开始日期"
        />
      </el-form-item>
      <el-form-item label="结束日期：" prop="endDate">
        <el-date-picker
          v-model="orderForm.endDate"
          type="date"
          placeholder="请选择结束日期"
        />
      </el-form-item>
      <el-form-item label="签约园区：" prop="signSchoolId">
        <el-select v-model="orderForm.signSchoolId" placeholder="请选择签约园区">
          <el-option v-for="(s, i) in schoolList" :key="i" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="上课园区：" prop="schoolId">
        <el-select v-model="orderForm.schoolId" placeholder="请选择上课园区">
          <el-option v-for="(s, i) in schoolList" :key="i" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import { getSchoolList } from '@/api/neuroo/orderManage'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    }
  },
  data() {
    return {
      orderForm: {},
      rules: {
        payHour: [
          { required: true, message: '请输入付费课时' }
        ],
        giveHour: [
          { required: true, message: '请输入赠送课时' }
        ],
        leftPayHour: [
          { required: true, message: '请输入剩余付费课时' }
        ],
        leftGiveHour: [
          { required: true, message: '请输入剩余赠送课时' }
        ],
        usedSupplementHour: [
          { required: true, message: '请输入已补课时' }
        ],
        supplementHour: [
          { required: true, message: '请输入需补课时' }
        ],
        startDate: [
          { required: true, message: '请输入开始日期' }
        ],
        endDate: [
          { required: true, message: '请输入结束日期' }
        ],
        signSchoolId: [
          { required: true, message: '请选择签约园区' }
        ],
        schoolId: [
          { required: true, message: '请选择上课园区' }
        ]
      },
      schoolList: []
    }
  },
  computed: {
  },
  watch: {
    content(v) {
      this.orderForm = v
    }
  },
  created() {
    getSchoolList().then(res => {
      this.schoolList = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.order {
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }
  & >>> .el-input {
    width: 560px!important;
  }
}
</style>
