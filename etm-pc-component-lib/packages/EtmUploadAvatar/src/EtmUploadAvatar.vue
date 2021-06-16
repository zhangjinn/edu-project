<template>
  <div class="EtmUploadAvatar-wrap" :value="value">
    <div class="etm-upload">
      <div class="etm-upload-box">
        <div
          class="upload-input"
          :class="[
            'upload-input__'+ shape
          ]"
          @click="trigger"
        >
          <input type="file" @change="onchange">
          <img v-if="imgUrl && imgUrl !== 'null'" :src="imgUrl" alt="">
          <span v-else class="no-img"><i class="iconfont iconmorentouxiang" /></span>
          <span class="uploadBtn">{{ imgUrl && imgUrl !== 'null' ? '编辑' : '上传' }}</span>
        </div>
        <div class="upload-text">
          <!--          <el-button v-if="btnText" class="btn-upload" @click="trigger">{{ btnText }}</el-button>-->
          <!--          <div class="upload-tip">{{ description }}</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * create by    dengShen
 * createTime   2020/3/17 19:44:09
 */

const imgDomain = ''
export default {
  name: 'EtmUploadAvatar',
  props: {
    value: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    btnText: {
      type: String,
      required: false,
      default() {
        return '更换头像'
      }
    },
    description: {
      type: String,
      required: false,
      default() {
        return '仅支持.jpg/.png文件'
      }
    },
    resourceName: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      required: false,
      default() {
        return 'image'
      },
      validator(val) {
        return ['image', 'video'].includes(val)
      }
    },
    type: {
      type: Array,
      required: false,
      default() {
        return ['jpeg', 'jpg', 'png']
      },
      validator(val) {
        return val.some(item => {
          return ['jpeg', 'jpg', 'png'].includes(item)
        })
      }
    },
    shape: {
      type: String,
      default() {
        return 'circle'
      },
      validator(val) {
        return ['circle', 'square'].includes(val)
      }
    },
    uploadFile: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      imgUrl: this.value
    }
  },
  computed: {},
  watch: {
    'value'(val) {
      this.imgUrl = imgDomain + val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    trigger() {
      document.querySelector('.upload-input').querySelector('input').click()
    },
    onchange(e) {
      const file = e.target.files[0]
      const isIn = this.type.some(item => {
        return file.type.includes(item)
      })
      if (!isIn) {
        return this.$message.error('请上传' + this.type.toString() + '类型的图片')
      }
      const temp = {
        raw: file,
        name: file.name
      }
      this.uploadFile(temp, this.resourceName, this.mediaType).then(res => {
        const url = window.URL.createObjectURL(file)
        this.$emit('input', res.key)
        setTimeout(() => {
          this.imgUrl = url
        }, 500)
        this.upload(res.data.hash, res.data.key, url)
      })
    },
    upload(hash, key, url) {
      this.$emit('success', hash, key, url)
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/src/etm/uploadAvatar'
</style>
