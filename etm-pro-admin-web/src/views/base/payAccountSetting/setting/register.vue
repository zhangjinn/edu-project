<template>
  <div class="register">
    <etm-form :rules="rules" :model="registerForm">
      <etm-title :border="false">{{ $t('collectionManage.collRegisterPersonTitle') }}</etm-title>
      <el-form-item :label="$t('collectionManage.collRegisterName') + ':'" prop="name">
        <el-input v-model="registerForm.name" :placeholder="$t('collectionManage.collRegisterNamePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterIDCard') + ':'" prop="IDcard">
        <el-input v-model="registerForm.IDcard" :placeholder="$t('collectionManage.collRegisterIDCardPlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterIDExpireDate') + ':'" prop="IDExpireDate">
        <el-row class="rangeBox">
          <el-col :span="11">
            <el-date-picker
              v-model="registerForm.IDExpireDate.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('collectionManage.startDate')"
              :picker-options="IDStartOptions"
              :clearable="false"
              @change="confirmIDStart"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="registerForm.IDExpireDate.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('collectionManage.endDate')"
              :picker-options="IDEndOptions"
              @change="confirmIDEnd"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterFrontPhoto') + ':'" prop="frontSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="registerForm.frontSrc"
          :preview-src-key="registerForm.frontSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getFrontList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collRegisterFrontPhotoPlh') }}</p>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterReversePhoto') + ':'" prop="reverseSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="registerForm.reverseSrc"
          :preview-src-key="registerForm.reverseSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getReverseList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collRegisterReversePhotoPlh') }}</p>
      </el-form-item>
      <etm-title :border="false">{{ $t('collectionManage.collRegisterLicenseTitle') }}</etm-title>
      <el-form-item :label="$t('collectionManage.collRegisterLicenseName') + ':'" prop="licenseName">
        <el-input v-model="registerForm.licenseName" :placeholder="$t('collectionManage.collRegisterLicenseNamePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterLicenseCode') + ':'" prop="licenseCode">
        <el-input v-model="registerForm.licenseCode" :placeholder="$t('collectionManage.collRegisterLicenseCodePlh')" />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterLicenseAddress') + ':'" prop="licenseAddress">
        <el-input
          v-model="registerForm.licenseAddress"
          :placeholder="$t('collectionManage.collRegisterLicenseAddressPlh')"
        />
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterLicenseExpire') + ':'" prop="licenseExpireDate">
        <el-row class="rangeBox">
          <el-col :span="11">
            <el-date-picker
              v-model="registerForm.licenseExpireDate.startDate"
              type="date"
              :placeholder="$t('collectionManage.startDate')"
              :picker-options="LicStartOptions"
              :clearable="false"
              @change="confirmLicStart"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="registerForm.licenseExpireDate.endDate"
              type="date"
              :placeholder="$t('collectionManage.endDate')"
              :picker-options="LicEndOptions"
              @change="confirmLicEnd"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collRegisterLicensePhoto') + ':'" prop="licenseSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="registerForm.licenseSrc"
          :preview-src-key="registerForm.licenseSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getLicenseList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collRegisterLicensePhotoPlh') }}</p>
      </el-form-item>
      <etm-title :border="false">{{ $t('collectionManage.collRegisterWechatTitle') }}</etm-title>
      <el-form-item :label="$t('collectionManage.collRegisterWechatAPPID') + ':'" prop="wechatAppID">
        <el-input v-model="registerForm.wechatAppID" :placeholder="$t('collectionManage.collRegisterWechatAPPIDPlh')" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import etmUploadImg from '@/components/EtmUploadImg'
import { uploadSignPicture } from '@/api/collection'

export default {
  name: 'Register',
  components: {
    etmUploadImg
  },
  props: {
    registerForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: this.$t('collectionManage.collRegisterNameNullTips'), trigger: 'blur' }],
        IDcard: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value) {
              if (value.length === 15 || value.length === 18) {
                callback()
              } else {
                callback(new Error(this.$t('collectionManage.collRegisterIDCardErrorTips')))
              }
            } else {
              callback(new Error(this.$t('collectionManage.collRegisterIDCardNullTips')))
            }
          }
        }],
        IDExpireDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.startDate) {
              callback(new Error(this.$t('collectionManage.selectStartDate')))
            } else {
              callback()
            }
          }
        }],
        frontSrcKey: [{
          required: true,
          message: this.$t('collectionManage.collRegisterFrontPhotoNullTips'),
          trigger: 'change'
        }],
        reverseSrcKey: [{
          required: true,
          message: this.$t('collectionManage.collRegisterReversePhotoNullTips'),
          trigger: 'change'
        }],
        licenseName: [{
          required: true,
          message: this.$t('collectionManage.collRegisterLicenseNameNullTips'),
          trigger: 'blur'
        }],
        licenseCode: [{
          required: true,
          message: this.$t('collectionManage.collRegisterLicenseCodeNullTips'),
          trigger: 'blur'
        }],
        licenseAddress: [{
          required: true,
          message: this.$t('collectionManage.collRegisterLicenseAddressNullTips'),
          trigger: 'blur'
        }],
        licenseExpireDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.startDate) {
              callback(new Error(this.$t('collectionManage.selectStartDate')))
            } else {
              callback()
            }
          }
        }],
        licenseSrcKey: [{
          required: true,
          message: this.$t('collectionManage.collRegisterLicensePhotoNullTips'),
          trigger: 'change'
        }],
        wechatAppID: [{
          required: true,
          message: this.$t('collectionManage.collRegisterWechatAPPIDNullTips'),
          trigger: 'blur'
        }]
      },
      IDStartOptions: {},
      IDEndOptions: {},
      LicStartOptions: {},
      LicEndOptions: {}
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.registerForm.IDExpireDate.startDate) {
        this.confirmIDStart(this.registerForm.IDExpireDate.startDate)
      }
      if (this.registerForm.IDExpireDate.endDate) {
        this.confirmIDEnd(this.registerForm.IDExpireDate.endDate)
      }
      if (this.registerForm.licenseExpireDate.startDate) {
        this.confirmLicStart(this.registerForm.licenseExpireDate.startDate)
      }
      if (this.registerForm.licenseExpireDate.endDate) {
        this.confirmLicEnd(this.registerForm.licenseExpireDate.endDate)
      }
    }, 1000)
  },
  methods: {
    getFrontList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'ID_CARD_FRONT' // 身份证正面照片
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.registerForm.frontSrc = val
          this.registerForm.frontSrcKey = arr
        })
      } else {
        this.registerForm.frontSrc = val
        this.registerForm.frontSrcKey = arr
      }
    },
    getReverseList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'ID_CARD_BACK' // 身份证反面照片
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.registerForm.reverseSrc = val
          this.registerForm.reverseSrcKey = arr
        })
      } else {
        this.registerForm.reverseSrc = val
        this.registerForm.reverseSrcKey = arr
      }
    },
    getLicenseList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'BUSINESS_LICENSE' // 营业执照照片
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.registerForm.licenseSrc = val
          this.registerForm.licenseSrcKey = arr
        })
      } else {
        this.registerForm.licenseSrc = val
        this.registerForm.licenseSrcKey = arr
      }
    },
    confirmIDStart(date) {
      this.IDEndOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
    },
    confirmIDEnd(date) {
      this.IDStartOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
    },
    confirmLicStart(date) {
      this.LicEndOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
    },
    confirmLicEnd(date) {
      this.LicStartOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .register {
    .pictureTips {
      margin-top: 2px;
      font-size: 12px;
    }

    .rangeBox {
      .el-date-editor.el-input {
        width: 100%;
      }
    }

    .line {
      text-align: center;
    }
  }
</style>
