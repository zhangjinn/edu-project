<template>
  <div class="photoData">
    <etm-form :rules="rules" :model="photoForm">
      <el-form-item :label="$t('collectionManage.collPhotoPermit') + ':'" prop="permitSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="photoForm.permitSrc"
          :preview-src-key="photoForm.permitSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getPermitList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collPhotoPermitPlh') }}</p>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collPhotoFacade') + ':'" prop="facadeSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="photoForm.facadeSrc"
          :preview-src-key="photoForm.facadeSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getFacadeList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collPhotoFacadePlh') }}</p>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collPhotoInterior') + ':'" prop="interiorSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="photoForm.interiorSrc"
          :preview-src-key="photoForm.interiorSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getInteriorList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collPhotoInteriorPlh') }}</p>
      </el-form-item>
      <el-form-item :label="$t('collectionManage.collPhotoCashierDesk') + ':'" prop="cashierDeskSrcKey">
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="photoForm.cashierDeskSrc"
          :preview-src-key="photoForm.cashierDeskSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getCashierList"
        />
        <p class="pictureTips">{{ $t('collectionManage.collPhotoCashierDeskPlh') }}</p>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import etmUploadImg from '@/components/EtmUploadImg'
import { uploadSignPicture } from '@/api/collection'

export default {
  name: 'PhotoData',
  components: {
    etmUploadImg
  },
  props: {
    photoForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        permitSrcKey: [{ required: true, message: this.$t('collectionManage.collPhotoPermitPlh'), trigger: 'blur' }],
        facadeSrcKey: [{ required: true, message: this.$t('collectionManage.collPhotoFacadePlh'), trigger: 'blur' }],
        interiorSrcKey: [{
          required: true,
          message: this.$t('collectionManage.collPhotoInteriorPlh'),
          trigger: 'blur'
        }],
        cashierDeskSrcKey: [{
          required: true,
          message: this.$t('collectionManage.collPhotoCashierDeskPlh'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    getPermitList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'OPEN_ACCOUNT_LICENSE' // 开户许可证照片
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.photoForm.permitSrc = val
          this.photoForm.permitSrcKey = arr
        })
      } else {
        this.photoForm.permitSrc = val
        this.photoForm.permitSrcKey = key
      }
    },
    getFacadeList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'BUSINESS_PLACE_DOOR_HEAD' // 门头照
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.photoForm.facadeSrc = val
          this.photoForm.facadeSrcKey = arr
        })
      } else {
        this.photoForm.facadeSrc = val
        this.photoForm.facadeSrcKey = arr
      }
    },
    getInteriorList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'BUSINESS_PLACE_INTERIOR' // 内景照
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.photoForm.interiorSrc = val
          this.photoForm.interiorSrcKey = arr
        })
      } else {
        this.photoForm.interiorSrc = val
        this.photoForm.interiorSrcKey = arr
      }
    },
    getCashierList(val, key) {
      const arr = []
      if (val.length && key.length) {
        const param = {
          imageUrl: key[0],
          imageType: 'BUSINESS_PLACE_CASHIER_DESK' // 经营场所收银台照
        }
        uploadSignPicture(param).then(res => {
          const data = res.data
          arr.push(data.url)
          this.photoForm.cashierDeskSrc = val
          this.photoForm.cashierDeskSrcKey = arr
        })
      } else {
        this.photoForm.cashierDeskSrc = val
        this.photoForm.cashierDeskSrcKey = arr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .photoData {
    .pictureTips {
      margin-top: 2px;
      font-size: 12px;
    }
  }
</style>
