<template>
  <div class="more">
    <etm-form :model="formData">
      <el-form-item v-for="(item ,index) in formData.charger" :key="index" :label="index ? `次负责人${index}:` : '负责人:'" class="charger">
        <el-select v-model="item.name" placeholder="请选择负责人">
          <el-option label="薏米" value="YM" />
          <el-option label="西瓜" value="XG" />
        </el-select>
        <el-input v-model="item.point" placeholder="请输入业绩(%)" />
        <EtmFontIcon :name="index === 0 ? 'plus' : 'minus'" @click.native.stop="handleCharger(index)" />
      </el-form-item>
      <el-form-item label="上传图片:">
        <etm-upload-img
          resource-name="memberManageV2/more"
          :preview-src-list="previewSrcLists"
          :preview-src-key="previewSrcKey"
          :text="''"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="formData.remark" placeholder="请输入备注内容" type="textarea" />
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import EtmFontIcon from '@/components/EtmFontIcon/index'
import EtmUploadImg from '@/components/EtmUploadImg/index'
export default {
  components: {
    EtmFontIcon,
    EtmUploadImg
  },
  data() {
    return {
      formData: {
        charger: [
          {
            name: '',
            point: ''
          }
        ],
        remark: ''
      },
      previewSrcLists: [], // 上传图片的url
      previewSrcKey: [] // 提交的上传图片路径
    }
  },
  computed: {
  },
  methods: {
    handleCharger(i) {
      if (i) {
        this.formData.charger.splice(i, 1)
      } else {
        this.formData.charger.push({
          name: '',
          point: ''
        })
      }
    },
    // 获取上传图片列表
    getImgList(val, key) {
      this.previewSrcLists = val
      this.previewSrcKey = key
    }
  }
}
</script>

<style scoped lang="scss">
.more {
  min-width: 900px;
  & >>> .el-form {
    max-width: 80%!important;
  }
  & >>> .charger {
    .el-input, .el-select {
      width: 272px!important;
    }
    .el-select {
      margin-right: 10px;
    }
  }
  & >>> .el-textarea {
    width: 560px!important;
  }
}
</style>
