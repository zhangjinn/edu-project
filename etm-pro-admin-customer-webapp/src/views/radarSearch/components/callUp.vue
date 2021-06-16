<template>
  <div class="callUp-wrap">
    <etm-pop
      :visible="showPopCallUp"
      pop="complex"
      title=""
      confirm-btn="添加到我的客户"
      cancel-btn="取消"
      luckysearch="luckySearch"
      @open="handleCallUpOpen"
      @close="handleCallClose"
      @confirm="handleCallConfirm"
      @cancel="handleCallCancel"
    >
      <div class="header">
        <div class="left-phone">
          <div class="calling">
            <template v-if="callTime">
              通话中 {{ callingTime.substr(0, 2) }}:{{ callingTime.substr(2, 2) }}
            </template>
            <template v-else>
              {{ callData.customerName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ callData.telephone | hiddenPhone }}
            </template>
          </div>
          <div class="tip">
            为保障通话质量，您的通话正在录音中...
          </div>
          <div class="tags">
            <div
              v-for="(item, index) in tagList.slice(0, 3)"
              :key="index + Date.now()"
              class="tag"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div :class="callTime ? '' : 'right-phone'">
          <etm-status :type="communicate ? 'active' : 'inactive'">
            {{ communicate ? '已沟通' : '未沟通' }}
          </etm-status>
          <div
            v-if="!callTime"
            class="not-communicate"
            @click="handleCallUpOpen"
          />
        </div>
      </div>
      <div class="main-content">
        <div class="customer-phone">
          <div
            class="prev"
            @click="switchCallUp('prev')"
          >
            &lt;上一个客户
          </div>
          <div
            class="next"
            @click="switchCallUp('next')"
          >
            下一个客户&gt;
          </div>
        </div>
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
import { queryCustomerTagOptions, createSaveCustomer } from '@/api/luckySearch'
import { callUp } from '@/api/radarSearch'
import formValidate from '@/utils/rules'
export default {
  name: 'CallUp',
  components: {
    EtmAddress
  },
  filters: {
    hiddenPhone (val) {
      if (!val || val.toString().length !== 11) return val
      return val.replace(/^(\d{3})\d+/, '$1********')
    }
  },
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
    callData: {
      type: Object,
      default () {
        return {}
      }
    },
    batchId: {
      type: Number,
      default: null
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
      callTime: null,
      communicate: true,
      timer: null
    }
  },
  computed: {},
  watch: {
    tagList (val) {
      this.customerFormData.remark = '#' + val.join('#')
    },
    callData: {
      handler (val) {
        console.log(val)
        this.communicate = val.status === 'COMMUNICATED'
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    switchCallUp (type) {
      clearInterval(this.timer)
      this.communicate = false
      this.callingTime = '0000'
      this.$emit('switchCallUp', type, this.callData.resultExploreCustomerId)
      this.resetData()
    },
    resetData () {
      this.customerFormData = {
        name: '',
        telephone: '',
        gender: null,
        mark: '',
        region: '',
        remark: ''
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
        telephone: this.callData.telephone,
        resultExploreCustomerId: this.callData.resultExploreCustomerId,
        batchId: this.batchId,
        demo: this.callData.demo
      }
      callUp(callData).then(res => {
        this.communicate = true
        this.$emit('handleCallUp')
        this.callTime = Date.now()
        this.timer = setInterval(() => {
          const time = Date.now()
          const subTimestamp = time - this.callTime
          const minute = Math.floor(subTimestamp / 1000 / 60 % 60)
          const second = Math.floor(subTimestamp / 1000 % 60)
          this.callingTime = minute.toString().padStart(2, '0') + second.toString().padStart(2, '0')
        }, 1000)
        this.$on('handleCallClose', () => {
          this.timer && clearInterval(this.timer)
          this.callingTime = '0000'
        })

        queryCustomerTagOptions({ settingType: 'MARK' }).then(res => {
          this.customerOptions = res.data.options.map(item => {
            return {
              label: item.label,
              value: item.id
            }
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
        padding: 10px 25px;
        width: 630px;
        height: 115px;
        background: #FFFFFF;
        border: 1px solid #E0E0E0;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;

        .left-phone {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .calling {
            font-size: 18px;
            font-weight: bold;
            color: #555555;
          }

          .tip {
            font-size: 14px;
            font-weight: 400;
            color: #999999;
          }

          .tags {
            display: flex;
            .tag {
              margin-right: 8px;
              padding: 0 8px;
              height: 24px;
              line-height: 24px;
              border: 1px solid #E4AC2F;
              border-radius: 2px;
              font-size: 14px;
              font-weight: 400;
              color: #E4AC2F;
            }
          }
        }

        .right-phone {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          .EtmStatus--inactive {
            background-color: #E6A23C;
          }

          .not-communicate {
            width: 48px;
            height: 48px;
            cursor: pointer;
            background: url("../../../assets/images/call-up.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .main-content {
        margin-top: 15px;
        width: 100%;

        .customer-phone {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          .prev, .next {
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            cursor: pointer;
            &:hover {
              @include etm-color();
            }
          }

          .prev {
            margin-left: 16px;
          }

          .next {
            margin-right: 16px;
          }
        }

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
