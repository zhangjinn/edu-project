<template>
  <div class="settle">
    <etm-form :rules="rules" :model="settleForm">
      <el-form-item :label="$t('collectionManage.collSettleCardName') + ':'" prop="cardName">
        <el-input v-model="settleForm.cardName" :placeholder="$t('collectionManage.collSettleCardNamePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collSettleCardCode') + ':'" prop="cardCode">
        <el-input v-model="settleForm.cardCode" :placeholder="$t('collectionManage.collSettleCardCodePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collSettleBankType') + ':'" prop="bankType">
        <el-select
          v-model="settleForm.bankType"
          filterable
          :placeholder="$t('collectionManage.collSettleBankTypePlh')"
          @change="changeBankType"
        >
          <el-option v-for="(bank, i) in bankList" :key="i" :label="bank" :value="bank" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collSettleCardArea') + ':'" prop="city">
        <div class="area">
          <el-select
            v-model="settleForm.province"
            :placeholder="$t('collectionManage.collSettleCardProvincePlh')"
            @change="getCity"
          >
            <el-option v-for="(province, i) in provinceList" :key="i" :label="province.name" :value="province.code" />
          </el-select>
          <el-select
            v-model="settleForm.city"
            :placeholder="$t('collectionManage.collSettleCardCityPlh')"
            @change="changeCity"
          >
            <el-option v-for="(city, i) in cityList" :key="i" :label="city.name" :value="city.code" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collSettleCardAddress') + ':'" prop="cardAddress">
        <el-select
          v-model="settleForm.cardAddress"
          value-key="bankContactLine"
          filterable
          :placeholder="$t('collectionManage.collSettleCardAddressPlh')"
        >
          <el-option
            v-for="address in addressList"
            :key="address.bankContactLine"
            :label="address.bankBranchName"
            :value="address"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collSettleCardPhone') + ':'" prop="cardPhone">
        <el-input v-model="settleForm.cardPhone" :placeholder="$t('collectionManage.collSettleCardPhonePlh')" />
      </el-form-item>
      <el-form-item
        v-if="accountType === 'PERSONAL_COMPANY'"
        required
        :label="$t('collectionManage.collSettleCardPic') + ':'"
      >
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="settleForm.cardSrc"
          :preview-src-key="settleForm.cardSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getInteriorList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collSettleCardPicPlh') }}</p>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'
import { getAreaByCode } from '@/api/area'
import { getBankList, getBankContactList, uploadSignPicture } from '@/api/collection'
import etmUploadImg from '@/components/EtmUploadImg'

export default {
  name: 'Settle',
  components: {
    etmUploadImg
  },
  props: {
    settleForm: {
      type: Object,
      default() {
        return {}
      }
    },
    provinceList: {
      type: Array,
      default() {
        return []
      }
    },
    accountType: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      rules: {
        cardName: [{
          required: true,
          message: this.$t('collectionManage.collSettleCardNameNullTips'),
          trigger: 'blur'
        }],
        cardCode: [{
          required: true,
          message: this.$t('collectionManage.collSettleCardCodeNullTips'),
          trigger: 'blur'
        }],
        bankType: [{
          required: true,
          message: this.$t('collectionManage.collSettleBankTypeNullTips'),
          trigger: 'change'
        }],
        city: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error(this.$t('collectionManage.collBasicMerCitySelectTips')))
            } else {
              callback()
            }
          }
        }],
        cardAddress: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.bankContactLine) {
              callback(new Error(this.$t('collectionManage.collSettleCardAddressNullTips')))
            } else {
              callback()
            }
          }
        }],
        cardPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              if (validPhoneNumber(value)) {
                callback()
              } else {
                callback(new Error(this.$t('collectionManage.collPhoneErrorTips')))
              }
            } else {
              callback(new Error(this.$t('collectionManage.collSettleCardPhoneNullTips')))
            }
          }
        }]
      },
      bankList: [],
      bankType: '',
      provinceCode: '',
      cityList: [],
      cityCode: '',
      addressList: []
    }
  },
  created() {
    this.getBank()
  },
  mounted() {
    setTimeout(() => {
      if (this.settleForm.bankType) {
        this.bankType = this.settleForm.bankType
      }
    }, 1000)
  },
  methods: {
    getBank() {
      getBankList().then(res => {
        this.bankList = res.data
      })
    },
    getContact() {
      const param = {
        bankName: this.bankType,
        cityCode: this.cityCode
      }
      getBankContactList(param).then(res => {
        this.addressList = res.data
      })
    },
    getCity(value) {
      if (this.provinceSelectCode !== value) {
        this.provinceSelectCode = value
        this.settleForm.city = ''
        this.cityCode = ''
        this.addressList = []
        if (this.settleForm.cardAddress.bankContactLine) {
          this.settleForm.cardAddress = {}
        }
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          const data = res.data
          this.cityList = data
        })
      }
    },
    changeBankType(value) {
      if (this.bankType !== value) {
        this.bankType = value
        if (this.cityCode) {
          if (this.settleForm.cardAddress.bankContactLine) {
            this.settleForm.cardAddress = {}
          }
          this.getContact()
        }
      }
    },
    changeCity(value) {
      if (this.cityCode !== value) {
        this.cityCode = value
        if (this.bankType) {
          if (this.settleForm.cardAddress.bankContactLine) {
            this.settleForm.cardAddress = {}
          }
          this.getContact()
        }
      }
    },
    getInteriorList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'BANK_CARD' // 银行卡照
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.settleForm.cardSrc = val
          this.settleForm.cardSrcKey = arr
        })
      } else {
        this.settleForm.cardSrc = val
        this.settleForm.cardSrcKey = arr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .settle {
    .area {
      font-size: 0;

      /deep/ .el-select {
        width: 32%;

        &:not(:last-child) {
          margin-right: 2%;
        }
      }

      /deep/ .el-input + .el-input {
        margin-left: 0;
      }

      i {
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
</style>
