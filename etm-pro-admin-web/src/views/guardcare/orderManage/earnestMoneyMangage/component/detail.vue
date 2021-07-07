<template>
  <div class="detail-wrap">
    <etm-layout-split>
      <etm-title :show-line="false" border size="big">订金详情
        <template slot="tool">
          <el-button
            v-if="drawerType === 'detail' && !depositData.use"
            v-has="{authId: 'guardcare.earnestMoney.update'}"
            plain
            size="mini"
            @click="edit"
          >编辑
          </el-button>
          <el-button v-if="drawerType === 'edit' && !depositData.use" plain size="mini" @click="cancel">取消</el-button>
          <el-button v-if="drawerType === 'edit' && !depositData.use" type="primary" size="mini" @click="save">保存
          </el-button>
        </template>
      </etm-title>
      <div v-if="drawerType === 'detail'" class="detail">
        <etm-field-label type="left" label="订金编号">{{ depositData.code }}</etm-field-label>
        <etm-field-label type="left" label="幼儿姓名">{{ depositData.childName }}</etm-field-label>
        <etm-field-label type="left" label="性别">{{ depositData.gender === 'MALE' ? '男' : '女' }}</etm-field-label>
        <etm-field-label type="left" label="家长姓名">{{ depositData.parentName }}</etm-field-label>
        <etm-field-label type="left" label="联系电话">{{ depositData.phone }}</etm-field-label>
        <etm-field-label type="left" label="订金金额（元）">{{ depositData.amount }}</etm-field-label>
        <etm-field-label type="left" label="支付方式">{{ transferType(depositData.paymentType) }}</etm-field-label>
        <etm-field-label type="left" label="收费日期">{{ transferDate(depositData.paymentDate) }}</etm-field-label>
        <etm-field-label type="left" label="使用状态">{{ depositData.use ? '已使用' : '未使用' }}</etm-field-label>
        <etm-field-label type="left" label="关联账单编号">{{ depositData.useOrderCode }}</etm-field-label>
      </div>
      <div v-if="drawerType === 'edit'" class="edit">
        <etm-form ref="form" :model="formData" :rules="rule" type="dialog">
          <el-form-item label="幼儿姓名" prop="childId" placeholder="请选择幼儿">
            <el-select v-model="formData.childId" filterable>
              <el-option
                v-for="(child, index) in childList"
                :key="index"
                :label="child.childName"
                :value="child.childId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订金金额（元）" prop="amount">
            <el-input-number
              v-model="formData.amount"
              class="actualInput"
              controls-position="right"
              :min="0"
              placeholder="请输入订金金额"
            />
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentType">
            <el-select v-model="formData.paymentType">
              <el-option label="微信" value="WECHAT" />
              <el-option label="支付宝" value="ALIPAY" />
              <el-option label="现金" value="CASH" />
              <el-option label="网银" value="ONLINE_BANKING" />
            </el-select>
          </el-form-item>
          <el-form-item label="收费日期" prop="paymentDate">
            <el-date-picker v-model="formData.paymentDate" placeholder="请选择日期" :clearable="false" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              placeholder="请输入备注内容"
              type="textarea"
              :autosize="{ minRows: 3}"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>/**
 * detail create by Administrator
 * createTime 2020/9/1 13:42
 */

import { getDepositDetail, renewDeposit } from '@/api/guardcare/orderManage/depositManage'
import { getChildList } from '@/api/guardcare/orderManage/charge'
import { parseTime } from '@/utils'

export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    depositId: {
      type: Number,
      default() {
        return null
      }
    },
    drawerType: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editClick: false,
      depositData: {},
      formData: {},
      rule: {
        childId: [{ required: true, message: '幼儿不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        paymentType: [{ required: true, message: '支付方式不能为空', trigger: 'change' }],
        paymentDate: [{ required: true, message: '支付日期不能为空', trigger: 'change' }]
      },
      childList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getChild()
    this.getDetail()
  },
  methods: {
    getChild() {
      getChildList().then(res => {
        this.childList = res.data
      })
    },
    getDetail() {
      getDepositDetail(this.depositId).then(res => {
        this.depositData = res.data
        this.formData = {
          code: this.depositData.code,
          use: this.depositData.use,
          childId: this.depositData.childId,
          amount: this.depositData.amount,
          paymentType: this.depositData.paymentType,
          paymentDate: this.depositData.paymentDate,
          remark: this.depositData.remark
        }
      })
    },
    transferType(type) {
      // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
      switch (type) {
        case 'WECHAT':
          return '微信'
        case 'ALIPAY':
          return '支付宝'
        case 'CASH':
          return '现金'
        case 'ONLINE_BANKING':
          return '网银'
        default:
          return type
      }
    },
    transferDate(date) {
      if (date) {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    edit() { // 在详情页点击编辑
      this.editClick = true
      this.$emit('change', 'edit')
    },
    cancel() { // 取消编辑
      if (this.editClick) {
        this.editClick = false
        this.$emit('change', 'detail')
      } else {
        this.$emit('close')
      }
    },
    save() { // 编辑保存
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          this.formData.paymentDate = parseTime(this.formData.paymentDate, '{y}-{m}-{d}')
          renewDeposit(this.depositId, this.formData).then(() => {
            this.$message.success('保存成功')
            this.getDetail()
            this.editClick = false
            this.$emit('finish')
            this.$emit('change', 'detail')
            // if (this.editClick) { // 在详情页进行编辑
            //   this.editClick = false
            //   this.$emit('finish')
            //   this.$emit('change', 'detail')
            // } else { // 在表格直接进来编辑
            //   this.$emit('finish')
            //   this.$emit('close')
            // }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {

}

.actualInput {
  ::v-deep .el-input__inner {
    padding-left: 10px !important;
    text-align: left;
  }

  ::v-deep .el-input-number__increase {
    display: none;
  }

  ::v-deep .el-input-number__decrease {
    display: none;
  }
}
</style>
