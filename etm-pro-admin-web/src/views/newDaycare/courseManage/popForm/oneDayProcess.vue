<template>
  <div class="oneDayProcess">
    <etm-form ref="form" type="dialog" :model="formData" :rules="rules">
      <el-form-item label="业务类型">
        托育
      </el-form-item>
      <el-form-item label="日程内容名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入日程名称" />
      </el-form-item>
      <el-form-item label="日程内容简介">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入日程内容简介"
        />
      </el-form-item>
      <el-form-item label="上传展示图片">
        <etm-upload-img
          :resource-name="'daycare/courseManage/oneDayProcess'"
          :preview-src-list="formData.previewSrcLists"
          :preview-src-key="formData.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item v-show="showLast" label="是否开启">
        <el-switch v-model="formData.isOpen" />
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import etmUploadImg from '@/components/EtmUploadImg/index'
import { queryOneDayProcessDetail } from '@/api/newDaycare/courseManage'
import { getImgUrlRelativePath } from '@/utils'
export default {
  components: {
    etmUploadImg
  },
  props: {
    showLast: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: '',
        previewSrcLists: [],
        previewSrcKey: [],
        isOpen: false
      },
      rules: {
        name: [{
          required: true,
          message: '请输入日程名称'
        }]
      }
    }
  },
  methods: {
    getImgList(val, key) {
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    },
    resetForm() {
      this.$refs.form.$children[0].resetFields()
      this.formData.description = ''
      this.formData.previewSrcLists = []
      this.formData.previewSrcKey = []
    },
    getData(id) {
      queryOneDayProcessDetail(id).then(res => {
        const { data } = res
        const formData = {
          name: data.caeScheduleName,
          description: data.introduction,
          isOpen: data.enable
        }
        formData.previewSrcKey = []
        formData.previewSrcLists = []
        data.image.forEach(v => {
          formData.previewSrcLists.push(v.url)
          formData.previewSrcKey.push(getImgUrlRelativePath(v.url))
        })
        this.formData = formData
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
</style>
