<template>
  <div
    class="EtmUploadImage-wrap"
    :value="value"
  >
    <div class="etm-upload">
      <div class="etm-upload-box">
        <div
          class="upload-input"
          :class="[
            'upload-input__'+ shape
          ]"
          @click="trigger"
        >
          <input
            class="file"
            type="file"
            @change="onchange"
          >
          <img
            v-if="imgUrl && imgUrl !== 'null'"
            :src="imgUrl"
            alt=""
          >
          <span
            v-else
            class="no-img"
          ><i
            class="iconfont"
            :class="uploadType === 'organization' ? 'icondangqianqiye' : 'iconmorentouxiang'"
          /></span>
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
      default () {
        return 'avatar'
      }
    },
    value: {
      type: String,
      required: false,
      default () {
        return ''
      }
    },
    btnText: {
      type: String,
      required: false,
      default () {
        return '更换头像'
      }
    },
    description: {
      type: String,
      required: false,
      default () {
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
      default () {
        return 'image'
      },
      validator (val) {
        return ['image', 'video'].includes(val)
      }
    },
    type: {
      type: Array,
      required: false,
      default () {
        return ['jpeg', 'jpg', 'png']
      },
      validator (val) {
        return val.some(item => {
          return ['jpeg', 'jpg', 'png'].includes(item)
        })
      }
    },
    shape: {
      type: String,
      default () {
        return 'circle'
      },
      validator (val) {
        return ['circle', 'square'].includes(val)
      }
    }
  },
  data () {
    return {
      imgUrl: this.value
    }
  },
  computed: {},
  watch: {
    'value' (val) {
      this.imgUrl = imgDomain + val
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    trigger () {
      document.querySelector('.upload-input').querySelector('input').click()
    },
    onchange (e) {
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
    upload (hash, key, url) {
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
        align-items: flex-start;
        display: flex;
        justify-content: center;

        .upload-input {
          align-items: center;
          color: #ddd;
          /*          background: $control-color;
                    border: 1px solid $control-color;*/
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          overflow: hidden;
          position: relative;
          width: 40px;

          &:hover {
            .uploadBtn {
              display: block;
            }
          }

          .uploadBtn {
            @include c_white();
            background-color: rgba(22, 22, 22, 0.4);
            bottom: 0;
            display: none;
            font-size: 12px;
            height: 16px;
            left: 0;
            line-height: 16px;
            position: absolute;
            text-align: center;
            width: 100%;
          }

          &__circle {
            background: $color-control;
            border-radius: 50%;
          }

          &__square {
            border: 1px dashed $color-control;
            border-radius: 2px;
          }

          .file {
            display: none;
          }

          img {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }

          .no-img {
            align-items: center;
            background-color: #fff;
            cursor: pointer;
            display: flex;
            font-weight: 400;
            height: 40px;
            justify-content: center;
            width: 40px;

            > i {
              color: #c1c4cc;
              flex: 1;
              font-size: 40px;
            }
          }
        }

        .upload-text {
          color: #606266;
          margin-left: 16px;
          text-align: left;

          .btn-upload {
            @include bc_control_color();
            background-color: #fff !important;
            color: $color-title !important;
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
