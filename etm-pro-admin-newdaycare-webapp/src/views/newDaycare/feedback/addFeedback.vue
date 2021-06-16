<template>
  <etm-form
    ref="form"
    :model="formData"
    type="dialog"
    :rules="rules"
  >
    <el-form-item
      label="问题和意见"
      prop="content"
    >
      <el-input
        v-model="formData.content"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item
      label="上传图片"
      prop="images"
    >
      <etm-upload-img
        :resource-name="'newdaycare/feedback/addFeedback'"
        :preview-src-list="formData.previewSrcLists"
        :preview-src-key="formData.previewSrcKey"
        @getImgList="getImgList"
      />
    </el-form-item>
    <el-form-item
      label="发送对象"
      prop="target"
    >
      <el-checkbox-group v-model="formData.target">
        <el-checkbox
          v-if="enterpriseType"
          label="GARDEN"
        >
          园所
        </el-checkbox>
        <el-checkbox
          v-if="enterpriseType === 'GARDEN'"
          label="AREA"
        >
          区域
        </el-checkbox>
        <el-checkbox
          v-if="enterpriseType === 'GARDEN' || enterpriseType === 'AREA'"
          label="HEADQUARTERS"
        >
          总部
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import etmUploadImg from '@/components/EtmUploadImg'
import { queryFeedbackDetail, queryEnterpriseType } from '@/api/newDaycare/feedb'
export default {
  components: {
    etmUploadImg
  },
  props: {
    id: {
      type: [String, Number],
      default: undefined
    }
  },
  data () {
    return {
      formData: {
        content: '',
        target: [],
        previewSrcLists: [],
        previewSrcKey: []
      },
      rules: {
        content: [
          { required: true, message: '请输入内容' }
        ]
      },
      enterpriseType: ''
    }
  },
  methods: {
    init () {
      this.formData = {
        content: '',
        target: [],
        previewSrcLists: [],
        previewSrcKey: []
      }
      queryEnterpriseType().then(res => {
        this.enterpriseType = res.data || ''
      })
      if (this.id) {
        queryFeedbackDetail({ feedbackId: this.id }).then(res => {
          const { opinion, areaObjectList, imageList } = res.data
          this.formData.content = opinion
          this.formData.target = areaObjectList
          imageList.forEach(v => {
            this.formData.previewSrcLists.push(v.url)
            this.formData.previewSrcKey.push(v.url)
          })
        })
      }
    },
    getImgList (val, key) {
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    }
  }
}
</script>

<style>

</style>
