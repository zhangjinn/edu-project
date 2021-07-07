<template>
  <div class="basic">
    <etm-form :rules="rules" :model="basicForm">
      <etm-title :border="false">{{ $t('collectionManage.collBasicMerTitle') }}</etm-title>
      <el-form-item :label="$t('collectionManage.collBasicMerType') + ':'" prop="merchantType">
        <el-select v-model="basicForm.merchantType" :placeholder="$t('collectionManage.collBasicMerTypePlh')">
          <el-option v-for="(list, i) in merchantTypeList" :key="i" :label="list.label" :value="list.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicMerName') + ':'" prop="merchantName">
        <el-input
          v-model="basicForm.merchantName"
          :placeholder="$t('collectionManage.collBasicMerNamePlh')"
          :disabled="configFinished"
        />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicMerAbbreviation') + ':'" prop="merchantAbbreviation">
        <el-input
          v-model="basicForm.merchantAbbreviation"
          :placeholder="$t('collectionManage.collBasicMerAbbreviationPlh')"
          :disabled="configFinished"
        />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicMerPhone') + ':'" prop="merchantPhone">
        <el-input
          v-model="basicForm.merchantPhone"
          :placeholder="$t('collectionManage.collBasicMerPhonePlh')"
          :disabled="configFinished"
        />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicMerArea') + ':'" prop="area">
        <div class="area">
          <el-select
            v-model="basicForm.area.province"
            :placeholder="$t('collectionManage.collBasicMerProvincePlh')"
            @change="getCity($event, 'change')"
          >
            <el-option v-for="(province, i) in provinceList" :key="i" :label="province.name" :value="province.code" />
          </el-select>
          <el-select
            v-model="basicForm.area.city"
            :placeholder="$t('collectionManage.collBasicMerCityPlh')"
            @change="getRegion($event, 'change')"
          >
            <el-option v-for="(city, i) in cityList" :key="i" :label="city.name" :value="city.code" />
          </el-select>
          <el-select v-model="basicForm.area.region" :placeholder="$t('collectionManage.collBasicMerRegionPlh')">
            <el-option v-for="(region, i) in regionList" :key="i" :label="region.name" :value="region.code" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicMerAddress') + ':'" prop="address">
        <el-input v-model="basicForm.address" :placeholder="$t('collectionManage.collBasicMerAddressPlh')" />
      </el-form-item>
      <etm-title :border="false">{{ $t('collectionManage.collBasicContactTitle') }}</etm-title>
      <el-form-item :label="$t('collectionManage.collBasicContactName') + ':'" prop="name">
        <el-input v-model="basicForm.name" :placeholder="$t('collectionManage.collBasicContactNamePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicContactPosition') + ':'" prop="position">
        <el-input v-model="basicForm.position" :placeholder="$t('collectionManage.collBasicContactPositionPlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicContactPhone') + ':'" prop="phone">
        <el-input v-model="basicForm.phone" :placeholder="$t('collectionManage.collBasicContactPhonePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collBasicContactEmail') + ':'" prop="email">
        <el-input v-model="basicForm.email" :placeholder="$t('collectionManage.collBasicContactEmailPlh')" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'
import { getAreaByCode } from '@/api/area'
import { validEmail } from '@/utils/validate'

export default {
  name: 'Basic',
  props: {
    basicForm: {
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
    configFinished: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      rules: {
        merchantType: [{
          required: true,
          message: this.$t('collectionManage.collBasicMerTypeNullTips'),
          trigger: 'change'
        }],
        merchantName: [{
          required: true,
          message: this.$t('collectionManage.collBasicMerNameNullTips'),
          trigger: 'blur'
        }],
        merchantAbbreviation: [{
          required: true,
          message: this.$t('collectionManage.collBasicMerAbbNullTips'),
          trigger: 'blur'
        }],
        merchantPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              if (validPhoneNumber(value)) {
                callback()
              } else {
                callback(new Error(this.$t('collectionManage.collPhoneErrorTips')))
              }
            } else {
              callback(new Error(this.$t('collectionManage.collBasicMerPhoneNullTips')))
            }
          }
        }],
        area: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.province && !value.city && !value.region) {
              callback(new Error(this.$t('collectionManage.collBasicMerAreaNullTips')))
            } else if (!value.city && !value.region) {
              callback(new Error(this.$t('collectionManage.collBasicMerCitySelectTips')))
            } else if (!value.region) {
              callback(new Error(this.$t('collectionManage.collBasicMerRegionSelectTips')))
            } else {
              callback()
            }
          }
        }],
        address: [{
          required: true,
          message: this.$t('collectionManage.collBasicMerAddressNullTips'),
          trigger: 'blur'
        }],
        name: [{ required: true, message: this.$t('collectionManage.collBasicContNameNullTips'), trigger: 'blur' }],
        position: [{
          required: true,
          message: this.$t('collectionManage.collBasicContPositionNullTips'),
          trigger: 'blur'
        }],
        phone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              if (validPhoneNumber(value)) {
                callback()
              } else {
                callback(new Error(this.$t('collectionManage.collPhoneErrorTips')))
              }
            } else {
              callback(new Error(this.$t('collectionManage.collBasicContPhoneNullTips')))
            }
          }
        }],
        email: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              if (validEmail(value)) {
                callback()
              } else {
                callback(new Error(this.$t('collectionManage.collBasicContEmailErrorTips')))
              }
            } else {
              callback(new Error(this.$t('collectionManage.collBasicContEmailNullTips')))
            }
          }
        }]
      },
      merchantTypeList: [
        {
          label: this.$t('collectionManage.publicAccount'),
          value: 'COMPANY'
        },
        {
          label: this.$t('collectionManage.privateAccount'),
          value: 'PERSONAL_COMPANY'
        }
      ],
      provinceSelectCode: '',
      cityList: [],
      citySelectCode: '',
      regionList: []
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.basicForm.area.city) {
        this.getCity(this.basicForm.area.province, 'load')
      }
      if (this.basicForm.area.region) {
        this.getRegion(this.basicForm.area.city, 'load')
      }
    }, 1000)
  },
  methods: {
    getCity(value, type) {
      if (this.provinceSelectCode !== value) {
        this.provinceSelectCode = value
        if (type === 'change') {
          this.basicForm.area.city = ''
          this.basicForm.area.region = ''
          this.regionList = []
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
    getRegion(value, type) {
      if (this.citySelectCode !== value) {
        this.citySelectCode = value
        if (type === 'change') {
          this.basicForm.area.region = ''
        }
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          const data = res.data
          this.regionList = data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic {
    .area {
      font-size: 0;

      /deep/ .el-select {
        width: 32%;

        &:not(:last-child) {
          margin-right: 2%;
        }
      }
    }
  }
</style>
