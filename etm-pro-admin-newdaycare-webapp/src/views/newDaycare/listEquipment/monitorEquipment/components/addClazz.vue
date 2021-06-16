<template>
  <etm-form
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="教室名称"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        placeholder="请输入教室名称"
      />
    </el-form-item>
    <el-form-item
      label="备注"
      prop="remark"
    >
      <el-input
        v-model="form.remark"
        type="text"
        placeholder="请输入备注，最多20个字"
        maxlength="10"
      />
    </el-form-item>
    <el-form-item
      label="教室详情"
      prop="detail"
    >
      <el-input
        v-model="form.detail"
        type="textarea"
        placeholder="请输入教室详情"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="上传展示图片"
      prop="pictures"
    >
      <etm-upload-img
        :resource-name="'daycare/monitorEquipment/addClazz'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        @getImgList="getImgList"
      />
    </el-form-item>
  </etm-form>
</template>
<script>
import etmUploadImg from '@/components/EtmUploadImg'

export default {
  components: {
    etmUploadImg
  },
  data () {
    return {
      form: {
        name: '',
        remark: '',
        detail: '',
        previewSrcLists: [],
        previewSrcKey: []
      }
    }
  },
  computed: {
  },
  methods: {
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    }
  }
}
</script>

<style scoped>
</style>
