<template>
  <div class="sendMessage-wrap">
    <etm-pop
      :visible="showPopSendMessage"
      pop="simple"
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
        <span>{{ sendMessageFormData.resultCustomerAddressIdList.length }}人</span>
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
            :rows="6"
            placeholder="请输入短信内容，每67个字为一条短信"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import { createSendMessage, querySmsTemplate, querySmsTemplateDetail } from '@/api/luckySearch'

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
    resultCustomerAddressIdList: {
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
    type: {
      type: String,
      default: 'OUTER',
      validator (val) {
        return ['OUTER', 'AI'].includes(val)
      }
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
        resultCustomerAddressIdList: [],
        content: '',
        type: ''
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
      smsTemplateOptions: []
    }
  },
  computed: {},
  watch: {
    groupMessage (val) {
      if (val) {
        this.radioChange('COMMUNICATED')
      }
    },
    resultCustomerAddressIdList (val) {
      this.sendMessageFormData.resultCustomerAddressIdList = val
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
        if (res.message === '成功') {
          this.smsTemplateOptions = res.data.content.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        }
      })
    },
    handleConfirm () {
      const ref = this.$refs.etmFormRef.$children[0]
      ref.validate(valid => {
        if (!valid) {
          return ''
        }
        if (!this.sendMessageFormData.resultCustomerAddressIdList.length) {
          return this.$message({
            type: 'info',
            message: '已选中0人，不能发送短信'
          })
        }
        this.sendMessageFormData.content = this.formData.message
        this.sendMessageFormData.type = this.type
        createSendMessage(this.sendMessageFormData).then(res => {
          if (res.message === '成功') {
            this.$message({
              type: 'success',
              message: '发送短信成功'
            })
            this.$emit('handleConfirm', this.formData.radio)
            this.handleCancel()
          } else {
            this.$message({
              type: 'error',
              message: '发送短信失败'
            })
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
        if (res.message === '成功') {
          this.formData.message = res.data.content
        }
      })
    },
    radioChange (val) {
      if (['COMMUNICATED', 'NOT_COMMUNICATED'].includes(val)) {
        this.sendMessageFormData.resultCustomerAddressIdList = this.tableData.filter(item => item.status === val).map(item => {
          return {
            id: item.resultCustomerAddressId,
            demo: item.demo || false
          }
        })
      } else {
        this.sendMessageFormData.resultCustomerAddressIdList = this.tableData.map(item => {
          return {
            id: item.resultCustomerAddressId,
            demo: item.demo || false
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
        resultCustomerAddressIdList: [],
        content: '',
        type: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .sendMessage-wrap {

  }
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

</style>
