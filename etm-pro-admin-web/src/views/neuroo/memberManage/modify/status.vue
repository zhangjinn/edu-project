<template>
  <div class="status">
    <etm-form ref="studentStatusInfo" :model="studentStatusInfo" :rules="rules" label-width="calc(50% - 260px)">
      <el-form-item :label="$t('memberManage.statusFormLabelCertificate') + ':'" prop="certificate">
        <div class="certificate">
          <el-select v-model="studentStatusInfo.certificate.cardType" :placeholder="$t('memberManage.statusFormCertificateTypePlaceHolderText')">
            <el-option :label="$t('memberManage.statusFormLabelIdentityCard')" value="ID_CARD" />
          </el-select>
          <el-input v-model="studentStatusInfo.certificate.cardNumber" style="width: 368px!important;" :placeholder="$t('memberManage.statusFormCertificateNumberPlaceHolderText')" />
        </div>
      </el-form-item>

      <el-form-item :label="$t('memberManage.statusFormLabelGuardian') + ':'" prop="guardian">
        <div class="guardian">
          <el-input v-model.trim="studentStatusInfo.guardian.name" :placeholder="$t('memberManage.statusFormNamePlaceHolderText')" />
          <el-select v-model="studentStatusInfo.guardian.cardType" :placeholder="$t('memberManage.statusFormCertificateTypePlaceHolderText')">
            <el-option :label="$t('memberManage.statusFormLabelIdentityCard')" value="ID_CARD" />
          </el-select>
          <el-input v-model="studentStatusInfo.guardian.cardNumber" :placeholder="$t('memberManage.statusFormCertificateNumberPlaceHolderText')" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.statusFormLabelPickUpPeople') + ':'" prop="pickUpPeoples">
        <div v-for="(item, index) in studentStatusInfo.pickUpPeoples" :key="index" class="receiver">
          <el-select v-model="item.contactTypeId" :placeholder="$t('memberManage.statusFormContactTypePlaceHolderText')">
            <el-option v-for="(caller, i) in content" :key="i" :label="caller.value" :value="caller.id" />
          </el-select>
          <el-input v-model="item.name" :placeholder="$t('memberManage.statusFormContactNamePlaceHolderText')" />
          <el-select v-model="item.cardType" :placeholder="$t('memberManage.statusFormCertificateTypePlaceHolderText')">
            <el-option :label="$t('memberManage.statusFormLabelIdentityCard')" value="ID_CARD" />
          </el-select>
          <el-input v-model="item.cardNumber" :placeholder="$t('memberManage.statusFormCardNumberPlaceHolderText')" />
          <EtmFontIcon :name="index === 0 ? 'plus' : 'minus'" @click.native.stop="handleReceiver(index)" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.statusFormLabelTrusteeshipType') + ':'" prop="trusteeshipType">
        <el-select v-model="studentStatusInfo.trusteeshipType" :placeholder="$t('memberManage.statusFormTrusteeshipTypePlaceHolderText')">
          <el-option :label="$t('memberManage.statusFormLabelFull')" value="FULL" />
          <el-option :label="$t('memberManage.statusFormLabelHalf')" value="HALF" />
          <el-option :label="$t('memberManage.statusFormLabelHour')" value="HOUR" />
          <el-option :label="$t('memberManage.statusFormLabelTemporary')" value="TEMPORARY" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('memberManage.statusFormLabelBloodGroup') + ':'" prop="bloodGroup">
        <el-radio-group v-model="studentStatusInfo.bloodGroup" :placeholder="$t('memberManage.statusFormBloodGroupPlaceHolderText')">
          <el-radio label="A">{{ $t('memberManage.statusFormLabelA') }}</el-radio>
          <el-radio label="B">{{ $t('memberManage.statusFormLabelB') }}</el-radio>
          <el-radio label="O">{{ $t('memberManage.statusFormLabelO') }}</el-radio>
          <el-radio label="AB">{{ $t('memberManage.statusFormLabelAB') }}</el-radio>
          <el-radio label="RH_A">{{ $t('memberManage.statusFormLabelRH_A') }}</el-radio>
          <el-radio label="RH_B">{{ $t('memberManage.statusFormLabelRH_B') }}</el-radio>
          <el-radio label="OTHER">{{ $t('memberManage.statusFormLabelOther') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('memberManage.statusFormLabelHouseholdRegistration') + ':'" prop="householdRegistration">
        <el-input v-model="studentStatusInfo.householdRegistration" :placeholder="$t('memberManage.statusFormHouseholdRegistrationPlaceHolderText')" />
      </el-form-item>
      <el-form-item label="籍贯:" prop="nativePlace">
        <el-select v-model="studentStatusInfo.nativePlace" placeholder="请选择籍贯">
          <el-option label="上海市" value="SH" />
          <el-option label="广州市" value="GZ" />
        </el-select>
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import EtmFontIcon from '@/components/EtmFontIcon/index'
export default {
  components: {
    EtmFontIcon
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Array
    },
    modify: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const _this = this
    return {
      studentStatusInfo: {
        bloodGroup: '',
        certificate: {
          cardType: '',
          cardNumber: ''
        },
        trusteeshipType: '',
        householdRegistration: '',
        nativePlace: '',
        guardian: {
          name: '',
          cardType: '',
          cardNumber: ''
        },
        pickUpPeoples: [
          {
            name: '',
            contactTypeId: '',
            contactTypeName: '',
            cardType: '',
            cardNumber: ''
          }
        ]
      },
      rules: {
        trusteeshipType: [
          { required: true, message: _this.$t('memberManage.statusFormTrusteeshipTypePlaceHolderText'), trigger: 'blur' }
        ],
        certificate: [
          { required: true, trigger: 'blur', validator: function(rule, value, callback) {
            if (value.cardType && value.cardNumber) {
              if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value.cardNumber.trim())) {
                callback()
              } else {
                callback(new Error(_this.$t('memberManage.completeCardNumberTip')))
              }
            } else {
              callback(new Error(_this.$t('memberManage.completeCardInfoTip')))
            }
          } }
        ],
        guardian: [
          { required: true, trigger: 'blur', validator: function(rule, value, callback) {
            if (value.name && value.cardType && value.cardNumber) {
              if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value.cardNumber.trim())) {
                callback()
              } else {
                callback(new Error(_this.$t('memberManage.completeCardNumberTip')))
              }
            } else {
              callback(new Error(_this.$t('memberManage.completeGuardianInfoTip')))
            }
          } }
        ],
        pickUpPeoples: [
          { required: true, trigger: 'blur', validator: function(rule, value, callback) {
            value.forEach(v => {
              // eslint-disable-next-line no-empty
              if (v.contactTypeId && v.name && v.cardNumber && v.cardType) {
                if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v.cardNumber.trim())) {
                  callback()
                } else {
                  callback(new Error(_this.$t('memberManage.completeCardNumberTip')))
                }
              } else {
                callback(new Error(_this.$t('memberManage.completePickUpPeopleInfoTip')))
              }
            })
          } }
        ]
      }
    }
  },
  watch: {
    studentStatusInfo: {
      handler() {
        this.$refs.studentStatusInfo.$children[0].validate(valid => {
          this.$store.commit('memberManageNeuroo/SET_STATUS', valid)
        })
      },
      deep: true
    },
    modify: {
      handler(v) {
        for (const key in v) {
          if (v.hasOwnProperty(key)) {
            if (key === 'cardType') {
              this.studentStatusInfo.certificate.cardType = v[key]
            } else if (key === 'cardNumber') {
              this.studentStatusInfo.certificate.cardNumber = v[key]
            } else {
              this.studentStatusInfo[key] = v[key] || ''
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleReceiver(index) {
      if (index) {
        // 删除对应接送人
        this.studentStatusInfo.pickUpPeoples.splice(index, 1)
      } else {
        // 增加接送人
        this.studentStatusInfo.pickUpPeoples.push({
          name: '',
          contactTypeId: '',
          contactTypeName: '',
          cardType: '',
          cardNumber: ''
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.status {
  /*height: calc(100vh - 234px);*/
  /*overflow-y: auto;*/
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
  & >>> .el-radio {
    margin-right: 25px;
  }
  .certificate {
    font-size: 0;
    & >>> .el-input {
      width: 176px!important;
      margin-right: 16px;
    }
  }
  .guardian {
    font-size: 0;
    & >>> .el-input {
      width: 176px!important;
      margin-right: 16px;
    }
  }
  .receiver {
    font-size: 0;
    & >>> .el-input {
      width: 128px!important;
      margin-right: 16px;
    }
    i {
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
