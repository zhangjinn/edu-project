<template>
  <div class="upload-card clearfix">
    <el-upload
      ref="upload"
      class="avatar-uploader"
      v-bind="$attrs"
      action=""
      :multiple="selectMultiple"
      :limit="limitNumber"
      :show-file-list="false"
      :http-request="upLoad"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :on-error="handleError"
    >
      <div class="upLoadContent">
        <i class="el-icon-plus" />
        <span>{{ text }}</span>
      </div>
    </el-upload>
    <div
      v-for="(url,index) in previewSrcList"
      :key="index"
      class="imgItemList"
    >
      <div class="imgItem">
        <el-image
          :src="url"
          fit="cover"
          @click="onPreview(index)"
        />
      </div>
      <i
        class="el-icon-error delImg"
        @click="handleFileRemove(url,index)"
      />
    </div>
    <el-image-viewer
      v-if="showViewer && viewerImg.length>0"
      :on-close="closeViewer"
      :url-list="viewerImg"
    />
  </div>
</template>

<script>
import { uploadFile } from '@/api/base'

export default {
  name: 'UploadImg',
  components: {},
  props: {
    previewSrcList: { // 默认图片
      type: Array,
      required: true,
      default: () => []
    },
    previewSrcKey: {
      type: Array,
      default: () => []
    },
    resourceName: { // 资源名字
      type: String,
      required: true
    },
    mediaType: { // 资源类型
      type: String,
      default () {
        return 'image'
      },
      validator (val) {
        return ['image', 'video'].includes(val)
      }
    },
    text: { // 上传图片默认样式显示的文字提示
      type: String,
      default: ''
    },
    limitSize: {
      type: Number,
      default: 0
    },
    limitType: {
      type: String,
      default: null
    },
    selectMultiple: {
      type: Boolean,
      default: false
    },
    limitNumber: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showViewer: false,
      viewerImg: []
    }
  },

  watch: {
    previewSrcList (val) {
      this.initImgList()
    }
  },

  methods: {
    // 初始化文件列表
    initImgList () {
      const fileArr = []
      if (this.previewSrcList.length > 0) {
        this.previewSrcList.forEach((item) => {
          fileArr.push({ name: item })
        })
      }
      this.$refs.upload.uploadFiles = fileArr
    },

    // 自定义上传图片
    upLoad (object) {
      const file = object.file
      const resourceName = this.resourceName
      const mediaType = this.mediaType

      const temp = {
        raw: object.file,
        name: object.file.name
      }
      uploadFile(temp, resourceName, mediaType).then(res => {
        let previewSrcList = []
        let previewSrcKey = []
        if (this.previewSrcList.length > 0) {
          previewSrcList = this.previewSrcList
        }
        if (this.previewSrcKey.length > 0) {
          previewSrcKey = this.previewSrcKey
        }
        const url = window.URL.createObjectURL(file)
        const key = res.data.key
        previewSrcList.push(url)
        previewSrcKey.push(key)
        this.$emit('getImgList', previewSrcList, previewSrcKey)
      })
    },

    // 删除上传图片
    handleFileRemove (url, index) {
      this.previewSrcList.splice(index, 1)
      this.previewSrcKey.splice(index, 1)
      this.$refs.upload.clearFiles()
      this.$emit('getImgList', this.previewSrcList, this.previewSrcKey)
    },

    // 文件超出个数限制
    handleExceed (file, fileList) {
      const limit = this.$refs.upload.limit
      // console.log(limit)
      this.$message.error('别贪心！最多只能上传' + limit + '个哦~')
    },

    // 使用 before-upload 限制用户上传的图片格式和大小。
    beforeAvatarUpload (file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isImage) {
        this.$message.error('上传文件只能是图片格式!')
        return false
      }
      if (this.limitType) {
        const str = this.limitType.toLowerCase()
        let text = ''
        let type = ''
        if (str.includes('jpg') || str.includes('jpeg')) {
          type = 'image/jpeg'
          text = 'JPG'
        } else if (str.includes('png')) {
          type = 'image/png'
          text = 'PNG'
        } else if (str.includes('gif')) {
          type = 'image/gif'
          text = 'GIF'
        }
        const isLimitType = file.type === type
        if (!isLimitType) {
          this.$message.error('只能上传' + text + '格式的图片!')
          return false
        }
      }
      if (this.limitSize) {
        const isLimitSize = file.size / 1024 / 1024 < this.limitSize
        if (!isLimitSize) {
          this.$message.error('上传的图片大小不能超过' + this.limitSize + 'MB!')
          return false
        }
      }
      return true
    },

    // 文件上传失败
    handleError () {
      this.$message.error('文件上传失败!')
    },

    // 图片预览
    onPreview (index) {
      const that = this
      const arr = []
      arr.push(this.previewSrcList[index])
      this.previewSrcList.map((val, idx) => {
        if (index !== idx) {
          arr.push(val)
        }
      })
      this.viewerImg = arr
      this.$nextTick(() => {
        that.showViewer = true
      })
    },

    // 关闭图片预览
    closeViewer () {
      this.showViewer = false
    }

  }
}
</script>

<style scoped lang="scss">

.upload-card {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
  width: 100%;

  ::v-deep .el-icon-circle-close {
    color: $white;
    font-size: 40px;
  }

  .avatar-uploader {
    float: left;
    height: 80px;
    margin: 8px;
    width: 80px;

    ::v-deep .el-upload {
      height: 100%;
      width: 100%;

      .upLoadContent {
        align-items: center;
        background: #fafafa;
        border: 1px dashed #e0e0e0;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        padding: 17px 0;
        width: 100%;

        i {
          color: #999;
          font-size: 25px;
        }

        span {
          color: #777;
          font-size: 14px;
          font-weight: 400;
          line-height: initial;
        }
      }
    }
  }

  .imgItemList {
    float: left;
    height: 80px;
    margin: 8px;
    position: relative;
    width: 80px;

    .imgItem {
      background: #f6f7fa;
      border-radius: 2px;
      height: 100%;
      overflow: hidden;
      width: 100%;

      .el-image {
        height: 100%;
        width: 100%;

      }
    }

    .delImg {
      color: #f5222d;
      font-size: 20px;
      position: absolute;
      right: -9px;
      top: -10px;
    }
  }

}
</style>
