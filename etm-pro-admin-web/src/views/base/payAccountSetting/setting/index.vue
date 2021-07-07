<template>
  <etm-layout-split>
    <div class="collectionSetting">
      <etm-title>{{ $t('collectionManage.breadCrumbTitleSetting') }}</etm-title>
      <el-steps :active="active">
        <el-step
          :title="$t('collectionManage.collSettingBasic')"
          :description="$t('collectionManage.collSettingBasicDescription')"
        />
        <el-step
          :title="$t('collectionManage.collSettingRegister')"
          :description="$t('collectionManage.collSettingRegisterDescription')"
        />
        <el-step
          :title="$t('collectionManage.collSettingSettle')"
          :description="$t('collectionManage.collSettingSettleDescription')"
        />
        <el-step
          :title="$t('collectionManage.collSettingPhoto')"
          :description="$t('collectionManage.collSettingPhotoDescription')"
        />
      </el-steps>
      <div ref="tableArea" class="tableArea">
        <basic
          v-show="active === 0"
          ref="basicForm"
          :basic-form="basicForm"
          :province-list="provinceList"
          :config-finished="configFinished"
        />
        <register v-show="active === 1" ref="registerForm" :register-form="registerForm" />
        <settle
          v-show="active === 2"
          ref="settleForm"
          :settle-form="settleForm"
          :province-list="provinceList"
          :account-type="basicForm.merchantType"
        />
        <photo-data v-show="active === 3" ref="photoForm" :photo-form="photoForm" />
      </div>
      <div class="footer">
        <div class="btn">
          <el-button v-if="active !== 3" type="primary" :disabled="disabled" @click.stop="next">
            {{ $t('collectionManage.nextStepBtnTexts') }}
          </el-button>
          <el-button v-else type="primary" :disabled="disabled" @click.stop="handleSubmit">
            {{ $t('collectionManage.submitToCheckBtnText') }}
          </el-button>
          <el-button v-if="active !== 0" plain @click.stop="last">{{ $t('collectionManage.lastStepsBtnText') }}</el-button>
        </div>
      </div>
    </div>
  </etm-layout-split>

</template>

<script>
import basic from './basic'
import register from './register'
import settle from './settle'
import photoData from './photoData'
import { getAreaByCode } from '@/api/area'
import { merchantConfig, getMerchantData, merchantSign } from '@/api/collection'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    basic,
    register,
    settle,
    photoData
  },
  data() {
    return {
      active: 0,
      disabled: true,
      basicForm: {
        merchantType: '', // 商户类型
        merchantName: '', // 商户名称
        merchantAbbreviation: '', // 商户简称
        merchantPhone: '', // 商户手机号码
        area: {
          province: '', // 省
          city: '', // 市
          region: '' // 区
        },
        address: '', // 详细地址
        name: '', // 日常联系人-姓名
        position: '', // 日常联系人-职务
        phone: '', // 日常联系人-手机号码
        email: '' // 日常联系人-邮箱
      },
      registerForm: {
        name: '', // 法人代表-姓名
        IDcard: '', // 身份证号码
        IDExpireDate: {
          startDate: '', // 身份证有效期开始日期
          endDate: '' // 身份证有效期结束日期
        },
        frontSrc: [], // 身份证正面照片
        frontSrcKey: [],
        reverseSrc: [], // 身份证反面照片
        reverseSrcKey: [],
        licenseName: '', // 营业执照信息-注册名称
        licenseCode: '', // 营业执照号
        licenseAddress: '', // 营业执照注册地址
        licenseExpireDate: {
          startDate: '', // 营业执照有效期开始日期
          endDate: '' // 营业执照有效期结束日期
        },
        licenseSrc: [], // 营业执照照片
        licenseSrcKey: [],
        wechatAppID: '' // 微信公众号APPID
      },
      settleForm: {
        cardName: '', // 银行卡户名
        cardCode: '', // 银行卡卡号
        bankType: '', // 开户行名称
        province: '', // 开户行所属省
        city: '', // 开户行所属市
        cardAddress: {}, // 开户行地址
        cardPhone: '', // 开户行预留手机号码
        cardSrc: [],
        cardSrcKey: []
      },
      photoForm: {
        permitSrc: [], // 开户许可证照片
        permitSrcKey: [],
        facadeSrc: [], // 门头照
        facadeSrcKey: [],
        interiorSrc: [], // 内景照
        interiorSrcKey: [],
        cashierDeskSrc: [], // 收银台照
        cashierDeskSrcKey: []
      },
      basicDone: false,
      registerDone: false,
      settleDone: false,
      photoDone: false,
      provinceList: [],
      configFinished: false
    }
  },
  watch: {
    basicForm: {
      handler(value) {
        const flag = this.judgeFlag(value)
        if (flag) {
          this.$nextTick(() => {
            this.$refs.basicForm.$children[0].$children[0].validate((valid) => {
              this.disabled = !valid
              this.basicDone = valid
            })
          })
        } else {
          this.disabled = true
          this.basicDone = false
        }
      },
      deep: true
    },
    registerForm: {
      handler(value) {
        const flag = this.judgeFlag(value)
        if (flag) {
          this.$nextTick(() => {
            this.$refs.registerForm.$children[0].$children[0].validate((valid) => {
              this.disabled = !valid
              this.registerDone = valid
            })
          })
        } else {
          this.disabled = true
          this.registerDone = false
        }
      },
      deep: true
    },
    settleForm: {
      handler(value) {
        const flag = this.judgeFlag(value)
        if (flag) {
          this.$nextTick(() => {
            this.$refs.settleForm.$children[0].$children[0].validate((valid) => {
              this.disabled = !valid
              this.settleDone = valid
            })
          })
        } else {
          this.disabled = true
          this.settleDone = false
        }
      },
      deep: true
    },
    photoForm: {
      handler(value) {
        const flag = this.judgeFlag(value)
        if (flag) {
          this.$nextTick(() => {
            this.$refs.photoForm.$children[0].$children[0].validate((valid) => {
              this.disabled = !valid
              this.photoDone = valid
            })
          })
        } else {
          this.disabled = true
          this.photoDone = false
        }
      },
      deep: true
    },
    active: {
      handler(value) {
        if (this.$refs.tableArea.scrollTop > 0) {
          this.$nextTick(() => {
            this.$refs.tableArea.scrollTo(0, 0)
          })
        }
        switch (value) {
          case 0:
            if (this.basicDone) {
              this.disabled = false
            } else {
              this.disabled = true
            }
            return
          case 1:
            if (this.registerDone) {
              this.disabled = false
            } else {
              this.disabled = true
            }
            return
          case 2:
            if (this.settleDone) {
              if (this.basicForm.merchantType === 'PERSONAL_COMPANY' && !this.settleForm.cardSrcKey.length) {
                this.disabled = true
              } else {
                this.disabled = false
              }
            } else {
              this.settleForm.cardSrcKey.push(1)
              this.settleForm.cardSrcKey.splice((this.settleForm.cardSrcKey.length - 1), 1)
              this.disabled = true
            }
            return
          case 3:
            if (this.photoDone) {
              this.disabled = false
            } else {
              this.disabled = true
            }
            return
        }
      },
      deep: true
    }
  },
  created() {
    this.getProvince()
    this.getSignData()
  },
  methods: {
    judgeFlag(data) {
      for (const i in data) {
        if (typeof data[i] === 'object') {
          if (data[i] instanceof Array) {
            if (i === 'cardSrc' || i === 'cardSrcKey') {
              if (this.basicForm.merchantType === 'PERSONAL_COMPANY') {
                if (!data[i].length) {
                  return false
                }
              }
            } else {
              if (!data[i].length) {
                return false
              }
            }
          } else {
            for (const n in data[i]) {
              if (n !== 'endDate') {
                if (!data[i][n]) {
                  return false
                }
              }
            }
          }
        } else if (!data[i]) {
          return false
        }
      }
      return true
    },
    getProvince() {
      getAreaByCode().then(res => {
        const data = res.data
        this.provinceList = data
      })
    },
    getSignData() {
      getMerchantData().then(res => {
        const data = res.data
        if (data) {
          this.configFinished = true
          this.setData(data)
        }
      })
    },
    setData(data) {
      this.basicForm = {
        merchantType: data.companyType,
        merchantName: data.merchantName,
        merchantAbbreviation: data.abbreviation,
        merchantPhone: data.userPhone,
        area: {
          province: data.provinceCode,
          city: data.cityCode,
          region: data.areaCode
        },
        address: data.businessAddress,
        name: data.contactInfo.name,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email
      }
      this.registerForm = {
        name: data.idCardLicense.licenseName,
        IDcard: data.idCardLicense.licenseNumber,
        IDExpireDate: {
          startDate: new Date(data.idCardLicense.beginTime),
          endDate: data.idCardLicense.endTime && data.idCardLicense.endTime !== 'NaN-NaN-NaN' ? new Date(data.idCardLicense.endTime) : ''
        },
        frontSrc: [],
        frontSrcKey: [],
        reverseSrc: [],
        reverseSrcKey: [],
        licenseName: data.businessLicense.licenseName,
        licenseCode: data.businessLicense.licenseNumber,
        licenseAddress: data.businessLicense.licenseAddress,
        licenseExpireDate: {
          startDate: new Date(data.businessLicense.beginTime),
          endDate: data.businessLicense.endTime && data.businessLicense.endTime !== 'NaN-NaN-NaN' ? new Date(data.businessLicense.endTime) : ''
        },
        licenseSrc: [],
        licenseSrcKey: [],
        wechatAppID: data.subscribeAppid
      }
      this.settleForm = {
        cardName: data.settlementInfo.openAccountName,
        cardCode: data.settlementInfo.bankAccountNumber,
        bankType: data.settlementInfo.branchBankName,
        province: '',
        city: '',
        cardAddress: {},
        cardPhone: data.settlementInfo.bankReservedMobile,
        cardSrc: [],
        cardSrcKey: []
      }
      data.images.forEach(item => {
        switch (item.imageType) {
          case 'ID_CARD_FRONT':
            this.registerForm.frontSrc.push(item.imageUrl)
            this.registerForm.frontSrcKey.push(item.imageUrl)
            break
          case 'ID_CARD_BACK':
            this.registerForm.reverseSrc.push(item.imageUrl)
            this.registerForm.reverseSrcKey.push(item.imageUrl)
            break
          case 'BUSINESS_LICENSE':
            this.registerForm.licenseSrc.push(item.imageUrl)
            this.registerForm.licenseSrcKey.push(item.imageUrl)
            break
          case 'BUSINESS_PLACE_DOOR_HEAD':
            this.photoForm.facadeSrc.push(item.imageUrl)
            this.photoForm.facadeSrcKey.push(item.imageUrl)
            break
          case 'BUSINESS_PLACE_INTERIOR':
            this.photoForm.interiorSrc.push(item.imageUrl)
            this.photoForm.interiorSrcKey.push(item.imageUrl)
            break
          case 'OPEN_ACCOUNT_LICENSE':
            this.photoForm.permitSrc.push(item.imageUrl)
            this.photoForm.permitSrcKey.push(item.imageUrl)
            break
          case 'BUSINESS_PLACE_CASHIER_DESK':
            this.photoForm.cashierDeskSrc.push(item.imageUrl)
            this.photoForm.cashierDeskSrcKey.push(item.imageUrl)
            break
          case 'BANK_CARD':
            this.settleForm.cardSrc.push(item.imageUrl)
            this.settleForm.cardSrcKey.push(item.imageUrl)
            break
        }
      })
    },
    next() {
      if (this.active === 0) {
        if (!this.configFinished) {
          const param = {
            merchantName: this.basicForm.merchantName,
            abbreviation: this.basicForm.merchantAbbreviation,
            userPhone: this.basicForm.merchantPhone
          }
          merchantConfig(param).then(() => {
            this.configFinished = true
            this.active++
          })
        } else {
          this.active++
        }
      } else {
        if (this.active < 4) this.active++
      }
    },
    last() {
      if (this.active > 0) this.active--
    },
    handleSubmit() {
      const param = {
        businessLicense: { // 营业执照
          licenseNumber: this.registerForm.licenseCode,
          licenseName: this.registerForm.licenseName,
          beginTime: parseTime(this.registerForm.licenseExpireDate.startDate, '{y}-{m}-{d}'),
          licenseAddress: this.registerForm.licenseAddress
        },
        images: [
          {
            imageUrl: this.registerForm.frontSrcKey[0],
            imageType: 'ID_CARD_FRONT' // 身份证正面照片
          },
          {
            imageUrl: this.registerForm.reverseSrcKey[0],
            imageType: 'ID_CARD_BACK' // 身份证反面照片
          },
          {
            imageUrl: this.registerForm.licenseSrcKey[0],
            imageType: 'BUSINESS_LICENSE' // 营业执照照片
          },
          {
            imageUrl: this.photoForm.facadeSrcKey[0],
            imageType: 'BUSINESS_PLACE_DOOR_HEAD' // 门头照
          },
          {
            imageUrl: this.photoForm.interiorSrcKey[0],
            imageType: 'BUSINESS_PLACE_INTERIOR' // 内景照
          },
          {
            imageUrl: this.photoForm.permitSrcKey[0],
            imageType: 'OPEN_ACCOUNT_LICENSE' // 开户许可证照片
          },
          {
            imageUrl: this.photoForm.cashierDeskSrcKey[0],
            imageType: 'BUSINESS_PLACE_CASHIER_DESK' // 经营场所收银台照
          }
        ],
        contactInfo: { // 联系人信息
          phone: this.basicForm.phone,
          name: this.basicForm.name,
          email: this.basicForm.email
        },
        companyType: this.basicForm.merchantType,
        organizationLicense: {
          licenseNumber: this.registerForm.licenseCode,
          licenseName: this.registerForm.licenseName
        },
        provinceCode: this.basicForm.area.province,
        cityCode: this.basicForm.area.city,
        areaCode: this.basicForm.area.region,
        userPhone: this.basicForm.merchantPhone,
        serviceTelephone: this.basicForm.phone,
        settlementInfo: { // 结算信息
          bankContactLine: this.settleForm.cardAddress.bankContactLine,
          bankReservedMobile: this.settleForm.cardPhone,
          openAccountName: this.settleForm.cardName,
          branchBankName: this.settleForm.bankType,
          bankAccountNumber: this.settleForm.cardCode,
          openAccountBank: this.settleForm.cardAddress.bankBranchName
        },
        abbreviation: this.basicForm.merchantAbbreviation,
        merchantName: this.basicForm.merchantName,
        subscribeAppid: this.registerForm.wechatAppID,
        businessAddress: this.basicForm.address,
        idCardLicense: { // 身份证信息
          licenseNumber: this.registerForm.IDcard,
          licenseName: this.registerForm.name,
          beginTime: parseTime(this.registerForm.IDExpireDate.startDate, '{y}-{m}-{d}')
        }
      }
      if (this.registerForm.licenseExpireDate.endDate) {
        param.businessLicense.endTime = parseTime(this.registerForm.licenseExpireDate.endDate, '{y}-{m}-{d}')
      }
      if (this.registerForm.IDExpireDate.endDate) {
        param.idCardLicense.endTime = parseTime(this.registerForm.IDExpireDate.endDate, '{y}-{m}-{d}')
      }

      if (this.basicForm.merchantType === 'COMPANY') {
        param.settlementInfo.bankAccountType = 'COMPANY'
      } else if (this.basicForm.merchantType === 'PERSONAL_COMPANY') {
        param.settlementInfo.bankAccountType = 'PERSON'
        param.images.push({
          imageUrl: this.settleForm.cardSrcKey[0],
          imageType: 'BANK_CARD' // 银行卡照
        })
      }
      this.sign(param)
    },
    sign(data) {
      merchantSign(data).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('collectionManage.submitSuccessText')
        })
        this.$emit('switch', { target: 'message', index: 0 })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .collectionSetting {
    position: relative;
    //@include bgc_white();
    //height: calc(100vh - 150px);
    /*padding-bottom: 68px;*/

    /deep/ .el-steps {
      margin: 25px 0 32px 150px;
      width: 800px;

      .el-step__main {
        transform: translateX(-15px);
      }

      .el-step__icon {
        width: 30px;
        height: 30px;
      }

      .el-step__head.is-process {
        @include bc_main_color();
        @include c_white();

        .el-step__icon.is-text {
          @include bgc_main_color();
        }

      }

      .el-step__head.is-success {
        @include c_main_color();
        @include bc_main_color();
      }

      .el-step__title.is-success {
        @include c_main_color();
      }

      .el-step__title.is-process {
        font-weight: 400;
      }

      .el-step.is-horizontal .el-step__line {
        top: 14px;
        right: 20px;
        left: 50px;
      }

    }

    .tableArea {
      /*height: calc(100vh - 412px);*/
      /*overflow-y: auto;*/

    }

    .footer {
      padding: 24px  0;

      .btn {
        display: flex;
        padding-left: 300px;
        & /deep/ .el-button + .el-button{
          margin-left: 16px;
        }

      }
    }

    /deep/ .upload-card {
      margin: 0 0 0 -8px;
    }
  }
</style>
