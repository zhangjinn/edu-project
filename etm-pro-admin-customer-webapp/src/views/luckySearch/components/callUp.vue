<template>
  <div class="callUp-wrap">
    <etm-pop
      :visible="showPopCallUp"
      pop="complex"
      title=""
      confirm-btn="保存"
      cancel-btn="取消"
      luckysearch="luckySearch"
      @open="handleCallUpOpen"
      @close="handleCallClose"
      @confirm="handleCallConfirm"
      @cancel="handleCallCancel"
    >
      <div class="header">
        <div class="calling">
          为保障通话质量，您的通话正在录音中
        </div>
        <div class="info">
          <div class="left-info">
            <div class="iconfont icontonghuazhong" />
            <div class="text">
              <div class="txt">
                通话中
              </div>
              <div class="time">
                {{ callingTime.substr(0, 2) }}:{{ callingTime.substr(2, 2) }}
              </div>
            </div>
          </div>
          <div class="right-info">
            <div class="iconfont iconkehubiaoqian" />
            <div class="text">
              <div class="txt">
                客户标签
              </div>
              <div class="tags">
                <div
                  v-for="(item, index) in tagList.slice(0, 3)"
                  :key="index"
                  class="tag"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <el-form
          ref="callRef"
          :model="customerFormData"
          :rules="customerFormDataRules"
          inline
          label-position="left"
          size="medium"
          label-width="88px"
        >
          <div class="item">
            <el-form-item
              class="common"
              label="客户姓名"
              prop="name"
            >
              <el-input
                v-model="customerFormData.name"
                placeholder="请输入客户姓名"
              />
            </el-form-item>
            <el-form-item
              class="common"
              label="手机号码"
              prop="telephone"
            >
              <el-input
                v-model="customerFormData.telephone"
                maxlength="11"
                placeholder="请输入手机号码"
              />
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item
              label="客户性别"
              prop="gender"
            >
              <el-select
                v-model="customerFormData.gender"
                placeholder="请选择客户性别"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="客户标签"
              prop="mark"
            >
              <el-select
                v-model="customerFormData.mark"
                placeholder="请选择客户标签"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item
            label="所属地区"
            class="address"
            prop="region"
          >
            <etm-address
              v-model="customerFormData.region"
              :area-id="customerFormData.region"
            />
          </el-form-item>
          <!--          TODO:拿过来的标签暂时先用#拼接，ui图的太骚，暂时做不出来-->
          <el-form-item
            label="线索备注"
            class="remarks"
            prop="remark"
          >
            <el-input
              v-model="customerFormData.remark"
              type="textarea"
              :rows="6"
              placeholder="请输入线索备注"
            />
          </el-form-item>
        </el-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
   * callUp create by 油麦菜
   * createTime 2021/1/13 11:35
   */
import EtmAddress from '@/views/base/org/EtmAddress'
import { callUp, queryCustomerTagOptions, createSaveCustomer } from '@/api/luckySearch'
import formValidate from '@/utils/rules'
export default {
  name: 'CallUp',
  components: {
    EtmAddress
  },
  filters: {},
  mixins: [],
  props: {
    showPopCallUp: {
      type: Boolean,
      default: false
    },
    tagList: {
      type: Array,
      default () {
        return []
      }
    },
    resultCustomerAddressId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'OUTER',
      validator (val) {
        return ['OUTER', 'AI'].includes(val)
      }
    },
    demo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customerFormData: {
        name: '',
        telephone: '',
        gender: null,
        mark: '',
        region: '',
        remark: ''
      },
      genderOptions: [
        {
          label: '男',
          value: 'MALE'
        },
        {
          label: '女',
          value: 'FEMALE'
        }
      ],
      customerOptions: [],
      customerFormDataRules: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          formValidate.phoneRule()
        ]
        // gender: [
        //   { required: true, message: '请输入客户性别', trigger: 'blur' }
        // ],
        // mark: [
        //   { required: true, message: '请选择客户标签', trigger: 'blur' }
        // ],
        // region: [
        //   { required: true, message: '请选择所属地区', trigger: 'blur' }
        // ],
        // remarks: [
        //   { required: true, message: '请输入线索备注', trigger: 'blur' }
        // ]
      },
      callingTime: '0000',
      callTime: null
    }
  },
  computed: {},
  watch: {
    tagList (val) {
      this.customerFormData.remark = '#' + val.join('#')
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    resetData () {
      this.customerFormData = {
        name: '',
        telephone: '',
        gender: null,
        mark: '',
        region: '',
        remarks: ''
      }
      this.callTime = null
    },
    handleCallConfirm () {
      const ref = this.$refs.callRef
      ref.validate(valid => {
        if (!valid) {
          return ''
        }
        createSaveCustomer(this.customerFormData).then(res => {
          this.$message({
            type: 'success',
            message: '客户信息保存成功'
          })
        })
        this.handleCallCancel()
      })
    },
    handleCallClose () {
      const ref = this.$refs.callRef
      ref.clearValidate()
      this.resetData()
      this.$emit('handleCallClose')
    },
    handleCallUpOpen () {
      const callData = {
        resultCustomerAddressId: this.resultCustomerAddressId,
        type: this.type,
        demo: this.demo
      }
      callUp(callData).then(res => {
        this.$emit('handleCallUp')
        this.callTime = Date.now()
        const timer = setInterval(() => {
          const time = Date.now()
          const subTimestamp = time - this.callTime
          const minute = Math.floor(subTimestamp / 1000 / 60 % 60)
          const second = Math.floor(subTimestamp / 1000 % 60)
          this.callingTime = minute.toString().padStart(2, '0') + second.toString().padStart(2, '0')
        }, 1000)
        this.$on('handleCallClose', () => {
          timer && clearInterval(timer)
          this.callingTime = '0000'
        })

        queryCustomerTagOptions({ settingType: 'MARK' }).then(res => {
          res.data.options.forEach(item => {
            this.customerOptions.push({
              label: item.label,
              value: item.id
            })
          })
        })
      })
    },
    handleCallCancel () {
      this.$emit('update:showPopCallUp', false)
      this.$emit('update:tagList', [])
    }
  }
}
</script>
<style lang="scss">
  .callUp-wrap {

  }
  [luckysearch=luckySearch] .el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 15px;
      .header {
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 144px;
        background: url("../../../assets/images/call-up-bg.png") no-repeat;
        background-size: 100% 100%;
        .calling {
          margin-bottom: 8px;
          width: 100%;
          text-align: center;
          font-size: 12px;
          height: 26px;
          line-height: 26px;
          font-weight: 400;
          color: #FAFBFF;
          background: url("../../../assets/images/calling.png") no-repeat;
          background-size: 100% 100%;
        }
        .info {
          display: flex;
          justify-content: space-around;
          width: 100%;
          .left-info {
            display: flex;
            align-items: center;
            width: 145px;
            height: 78px;

            background: rgba(238, 189, 79, 0.05);
            border: 1px solid #FFE7B5;
            .icontonghuazhong {
              margin: 0 12px;
              font-size: 32px;
              color: #FFC548;
            }
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
              /*align-items: center;*/
              .txt {
                font-size: 14px;
                font-weight: 700;
                color: #FFFFFF;
              }
              .time {
                font-size: 20px;
                font-weight: 700;
                color: #FFFFFF;
              }
            }
          }
          .right-info {
            display: flex;
            align-items: center;
            width: 420px;
            height: 78px;
            background: rgba(238, 189, 79, 0.05);
            border: 1px solid #FFE7B5;
            .iconkehubiaoqian {
              margin: 0 12px;
              font-size: 32px;
              color: #FF7E26;
            }
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
              .txt {
                font-size: 14px;
                font-weight: 700;
                color: #FFFFFF;
              }
              .tags {
                display: flex;
                padding: 3px 0;
                .tag {
                  margin-right: 5px;
                  height: 24px;
                  line-height: 24px;
                  padding: 0 8px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #ffffff;
                  background: #9D7826;
                  border: 1px solid #FFBF35;
                  border-radius: 2px;
                }
              }
            }
          }

          .left-info, .right-info {
            .text {
              margin-left: 8px;
            }
          }
        }
      }

      .main-content {
        margin-top: 15px;
        width: 100%;
        .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:after {
          content: '*';
          color: #f5222d;
          margin-left: 4px;
        }
        .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
          display: none;
        }

        .item {
          display: flex;
          justify-content: space-between;
          .common {
            .el-form-item__content {
              width: 195px;
            }
          }
        }
        .address {
          display: flex;
          .el-form-item__label {
            min-width: 88px;
          }
        }
        .remarks {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .el-form-item__content {
            /*width: 100%;*/
            flex: 1;
          }
        }
      }
    }
  }
</style>
