<template>

  <etm-form ref="form" :model="form" :rules="drawerRules" type="dialog">
    <el-form-item
      label="学员姓名"
    >
      {{ form.childName }}
    </el-form-item>
    <el-form-item
      :label="(type === 'add' || type === 'continue') ? '购买人' : '联系人姓名'"
    >
      {{ form.personName }}
    </el-form-item>
    <el-form-item
      v-if="type === 'edit'"
      label="关系"
    >
      {{ form.relationshipName }}
    </el-form-item>
    <el-form-item
      v-if="type === 'edit'"
      label="联系人电话"
    >
      {{ form.parentPhone }}
    </el-form-item>

    <el-form-item v-if="type === 'add' || type === 'continue'" label="选择套餐" prop="serviceId">
      <el-select v-model="form.serviceId" placeholder="请选择套餐" @change="handleSelectService">
        <el-option
          v-for="(item, index) in serviceList"
          :key="index"
          :value="item.cameraServicePackageId"
          :label="item.typeName"
        >
          {{ `${item.quantity}个月-￥${item.sellMoney}` }}
          <span v-show="item.discountMoney !== null" style="text-decoration: line-through; color: #666;">
            {{ `(￥${item.discountMoney})` }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label="到期日期"
      prop="expireDate"
    >
      <el-date-picker
        v-model="form.expireDate"
        type="date"
        format="yyyy/MM/dd"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
    </el-form-item>

    <el-form-item v-if="type === 'add' || type === 'continue'" label="应付金额(元)" prop="shouldPay">
      <el-input
        ref="shouldPayInput"
        v-model="form.shouldPay"
        placeholder="请输入应付金额"
        @blur="handleBlur"
      />
    </el-form-item>
    <el-form-item v-if="type === 'add' || type === 'continue'" label="实付金额(元)" prop="actualPay">
      <el-input
        ref="actualPayInput"
        v-model="form.actualPay"
        placeholder="请输入实付金额"
        @blur="handleBlur"
      />
    </el-form-item>
    <el-form-item v-if="type === 'add' || type === 'continue'" label="支付方式" prop="paymentType">
      <el-select v-model="form.paymentType" placeholder="请选择支付方式">
        <el-option
          v-for="item in paymentTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import transferDate from '@/utils/date'
import { queryCamertOrder, queryPayTypeList, queryPackageList } from '@/api/newDaycare/monitorEquipment'
import { parseTime } from '@/utils'

export default {
  name: 'CloudCameraServiceEdit',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add'
    },
    childId: {
      type: [Number, String],
      default: ''
    },
    parentPhone: {
      type: [Number, String],
      default: ''
    },
    parentId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      formValidate,
      form: {
        childName: '',
        personName: '',
        relationshipName: '',
        parentPhone: '',
        expireDate: '',
        shouldPay: '',
        actualPay: '',
        paymentType: '',
        serviceId: undefined
      },
      paymentTypeList: [],
      serviceList: [],
      drawerRules: {
        serviceId: [
          { required: true, message: '请选择套餐' }
        ],
        expireDate: [
          { required: true, message: '请选择到期日期' }
        ],
        shouldPay: [
          { required: true, message: '请输入应付金额' }
        ],
        actualPay: [
          { required: true, message: '请输入实付金额' }
        ],
        paymentType: [
          { required: true, message: '请选择支付方式' }
        ]
      }
    }
  },
  created() {
    // 查询支付方式列表
    queryPayTypeList().then(res => {
      const { data } = res
      this.paymentTypeList = []
      Array.isArray(data) && data.forEach(v => {
        this.paymentTypeList.push({
          label: v.financePayTypeName,
          value: v.financePayTypeId
        })
      })
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
    this.getDetailData()
  },
  methods: {
    async init() {
      // 查询套餐列表
      await queryPackageList({}).then(res => {
        this.serviceList = res.data
      }).catch(err => {
        console.log(err)
      })
      if (this.serviceList.length) { // 默认选中第一个
        this.form.serviceId = this.serviceList[0].cameraServicePackageId
        this.handleSelectService(this.form.serviceId)
        // this.$refs.form.$children[0].clearValidate()
      }
    },
    getDetailData() {
      const childId = this.childId
      const parentId = this.parentId
      queryCamertOrder({ childId, parentId }).then((res) => {
        const { data } = res
        this.form.childName = data.childName
        this.form.personName = data.personName
        this.form.relationshipName = data.relationshipName
        this.form.parentPhone = data.parentPhone
        this.form.expireDate = data.expireDate ? parseTime(data.expireDate).substr(0, 10) : ''
      })
    },
    handleBlur(e) { // 限制只能输入两位数小数
      let value = e.target.value.replace(/[a-zA-z]/g, '') // 转为只能是数字
      if (value) {
        const REG = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/ // 验证是否是两位小数的数字
        if (/\./.test(value)) { // 有小数点
          if (!REG.test(value)) { // 不符合两位小数的
            this.$message.warning('请输入两位小数的数字类型')
            value = ''
          }
        } else { // 没有小数点，后面补两位小数0
          value += '.00'
        }
        e.target.value = value
      } else {
        e.target.value = ''
      }
    },
    handleSelectService(serviceId) {
      let target
      for (let i = 0; i < this.serviceList.length; i++) {
        if (this.serviceList[i].cameraServicePackageId === serviceId) {
          target = this.serviceList[i]
          break
        }
      }
      if (target) {
        this.form.shouldPay = target.sellMoney + ''
        this.form.actualPay = target.discountMoney === null ? (target.sellMoney + '') : (target.discountMoney + '')
        let date
        if (this.type === 'continue') { // 续费
          date = new Date(this.form.expireDate)
        }
        if (this.type === 'add') { // 开通
          date = new Date(transferDate().time)
        }
        date.setMonth(date.getMonth() + target.quantity)
        this.form.expireDate = parseTime(date).substr(0, 10)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  margin-bottom: 24px;
}
</style>
