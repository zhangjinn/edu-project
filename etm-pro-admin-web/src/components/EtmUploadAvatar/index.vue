<template>
  <div class="EtmUploadImage-wrap" :value="value">
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
          <span v-else class="no-img"><i class="iconfont" :class="uploadType === 'organization' ? 'icondangqianqiye' : 'iconmorentouxiang'" /></span>
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

import { uploadFile } from '@/api/base'

// const imgDomain = 'http://q7d91tmj6.bkt.clouddn.com/'
const imgDomain = ''
export default {
  name: 'EtmUploadImage',
  props: {
    uploadType: {
      type: String,
      default() {
        return 'avatar'
      }
    },
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
      uploadFile(temp, this.resourceName, this.mediaType).then(res => {
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

<style lang="scss" scoped>
  .EtmUploadImage-wrap {
    display: flex;
    .etm-upload {
      display: inline-block;

      .etm-upload-box {
        display: flex;
        align-items: flex-start;
        justify-content: center;

        .upload-input {
          color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 40px;
          height: 40px;
          overflow: hidden;
          /*          background: $control-color;
                    border: 1px solid $control-color;*/
          cursor: pointer;
          &:hover{
            .uploadBtn{
              display: block;
            }
          }

          .uploadBtn{
            position: absolute;
            bottom: 0;
            left: 0;
            display: none;
            width: 100%;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            text-align: center;
            @include c_white();
            background-color: rgba(22, 22, 22, .4);
          }

          &__circle {
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            background: $control-color;
          }

          &__square {
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            border: 1px dashed $control-color;
          }

          input[type=file] {
            display: none;
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .no-img {
            display: flex;
            cursor: pointer;
            font-weight: 400;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #fff;

            > i {
              font-size: 40px;
              flex: 1;
              color: #C1C4CC;
            }
          }
        }

        .upload-text {
          margin-left: 16px;
          color: #606266;
          text-align: left;

          .btn-upload {
            background-color: #fff !important;
            @include bc_control_color();
            color: $title-color !important;
          }

          .upload-tip {
            @include c_text_color();
            font-size: 12px;

          }
        }
      }

    }
  }
</style>
