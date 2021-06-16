<template>
  <div class="sendMessage-wrap">
    <etm-pop
      :visible="showPopSendMessage"
      pop="complex"
      :title="groupMessage ? '群发短信' : '发短信'"
      :confirm-btn="groupMessage ? '发送' : '确定'"
      cancel-btn="取消"
      @open="showPopSendMessage = true"
      @close="handleClose"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <div
        v-if="groupMessage"
        class="chooseNum"
      >
        <span class="label">已选中</span>
        <span>{{ sendMessageFormData.exploreCustomerList.length }}人</span>
      </div>
      <etm-form
        ref="etmFormRef"
        type="dialog"
        :model="formData"
        :rules="formRules"
      >
        <template v-if="groupMessage">
          <el-form-item
            label="沟通状态"
            prop="radio"
          >
            <el-radio-group
              v-model="formData.radio"
              @change="radioChange"
            >
              <el-radio label="COMMUNICATED">
                已沟通
              </el-radio>
              <el-radio label="NOT_COMMUNICATED">
                未沟通
              </el-radio>
              <el-radio label="ALL">
                全部
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item
          label="短信模板"
          prop="selectVal"
        >
          <el-select
            v-model="formData.selectVal"
            placeholder="请选择短信模板"
            @change="smsSelectChange"
          >
            <el-option
              v-for="item in smsTemplateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="短信内容"
          prop="message"
        >
          <el-input
            v-model="formData.message"
            type="textarea"
            :rows="4"
            placeholder="请输入短信内容，每67个字为一条短信"
          />
        </el-form-item>
      </etm-form>
      <div class="surplus-sms">
        剩余可用短信数量 <span class="surplus-count">{{ messageNum }}</span> 条
      </div>
    </etm-pop>
  </div>
</template>

<script>
import { querySmsTemplate, querySmsTemplateDetail } from '@/api/luckySearch'
import { getAccount } from '@/api/customer2'
import { sendMessage } from '@/api/radarSearch'

/**
   * sendMessage create by 油麦菜
   * createTime 2021/1/13 12:49
   */
export default {
  name: 'SendMessage',
  components: {},
  filters: {},
  mixins: [],
  props: {
    showPopSendMessage: {
      type: Boolean,
      default: false
    },
    groupMessage: {
      type: Boolean,
      default: false
    },
    exploreCustomerList: {
      type: Array,
      default () {
        return []
      }
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    batchId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formData: {
        radio: 'COMMUNICATED',
        selectVal: '',
        message: ''
      },
      sendMessageFormData: {
        exploreCustomerList: [],
        content: '',
        batchId: this.batchId
      },
      formRules: {
        radio: [
          { required: true, message: '请选择沟通状态', trigger: 'blur' }
        ],
        // selectVal: [
        //   { required: true, message: '请选择短信模板', trigger: ['blur', 'change'] }
        // ],
        message: [
          { required: true, message: '请输入短信内容', trigger: 'blur' }
        ]
      },
      smsTemplateOptions: [],
      messageNum: 0
    }
  },
  computed: {},
  watch: {
    groupMessage (val) {
      if (val) {
        this.radioChange('COMMUNICATED')
      }
    },
    exploreCustomerList: {
      handler (val) {
        this.sendMessageFormData.exploreCustomerList = val
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      querySmsTemplate({ paged: false }).then(res => {
        this.smsTemplateOptions = res.data.content.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
      getAccount().then(res => {
        this.messageNum = res.data.messageNum
      })
    },
    handleTip (content, confirmBtn, toPath) {
      this.$etmTip.init({
        type: 'warn',
        title: '提示',
        content: content,
        confirmBtn: confirmBtn,
        cancelBtn: '取消',
        confirm: () => {
          this.$appRouter.push(toPath)
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleConfirm () {
      const ref = this.$refs.etmFormRef.$children[0]
      ref.validate(valid => {
        if (!valid) {
          return ''
        }
        if (!this.sendMessageFormData.exploreCustomerList.length) {
          return this.$message({
            type: 'info',
            message: '已选中0人，不能发送短信'
          })
        }
        // // 判断剩余短信数量
        // if (!this.messageNum) {
        //   this.handleTip('可用短信数量不足，请充值。', '前往充值', '/static/paymentCenter')
        // }
        this.sendMessageFormData.content = this.formData.message
        this.sendMessageFormData.batchId = this.batchId
        sendMessage(this.sendMessageFormData).then(res => {
          if (res.data.result === 'SUCCESS') {
            this.$message({
              type: 'success',
              message: '发送短信成功'
            })
            this.$emit('handleConfirm', this.formData.radio)
            this.handleCancel()
          } else if (res.data.result === 'NO_SIGNATURE') {
            this.handleTip('您还未开完成短信签名认证', '前往认证', { name: 'customer_smsCenterSetting' })
          } else if (res.data.result === 'INSUFFICIENT_BALANCE') {
            this.handleTip('可用短信数量不足，请充值。', '前往充值', '/static/paymentCenter')
          } else if (res.data.result === 'FAILED') {
            this.$message({
              type: 'error',
              message: '发送短信失败'
            })
            this.handleCancel()
          }
        })
      })
    },
    handleClose () {
      const ref = this.$refs.etmFormRef.$children[0]
      ref.clearValidate()
      this.resetData()
      this.handleCancel()
    },
    handleCancel () {
      this.$emit('update:showPopSendMessage', false)
      this.$emit('update:groupMessage', false)
      this.$emit('update:resultCustomerAddressIdList', [])
    },
    smsSelectChange (val) {
      querySmsTemplateDetail({ id: val }).then(res => {
        this.formData.message = res.data.content
      })
    },
    radioChange (val) {
      if (['COMMUNICATED', 'NOT_COMMUNICATED'].includes(val)) {
        this.sendMessageFormData.exploreCustomerList = this.tableData.filter(item => item.status === val).map(item => {
          return {
            resultExploreCustomerId: item.resultExploreCustomerId,
            demo: item.demo || false,
            telephone: item.telephone
          }
        })
        console.log(this.sendMessageFormData)
      } else {
        this.sendMessageFormData.exploreCustomerList = this.tableData.map(item => {
          return {
            resultExploreCustomerId: item.resultExploreCustomerId,
            demo: item.demo || false,
            telephone: item.telephone
          }
        })
      }
    },
    resetData () {
      this.formData = {
        radio: 'COMMUNICATED',
        selectVal: '',
        message: ''
      }
      this.sendMessageFormData = {
        exploreCustomerList: [],
        content: '',
        batchId: 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .chooseNum {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding-bottom: 16px;

    .label {
      min-width: 120px;
      color: #555555;
    }
  }

  ::v-deep .el-form {
    position: relative;
  }

  .custom-num {
    position: absolute;
    top: 0;
    right: 0;
    width: 110px;
    ::v-deep .el-form-item__content {
      margin-left: 30px!important;

      .el-form-item__error {
        width: 200%!important;
      }
    }
  }

  .surplus-sms {
    .surplus-count {
      @include etm-color();
    }
  }

</style>
