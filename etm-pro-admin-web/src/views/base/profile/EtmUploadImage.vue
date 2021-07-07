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
          <img v-if="imgUrl" :src="imgUrl" alt="">
          <span v-else class="no-img">+</span>
        </div>
        <div class="upload-text">
          <el-button v-if="btnText" plain @click="trigger">{{ btnText }}</el-button>
          <!--<button v-if="btnText" class="btn-upload" @click="trigger">{{ btnText }}</button>-->
          <p>{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>/**
 * create by    dengShen
 * createTime   2020/3/17 19:44:09
 */

import { uploadFile } from '@/api/base'

// const imgDomain = 'http://q7d91tmj6.bkt.clouddn.com/'
export default {
  name: 'EtmUploadImage',
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
      this.imgUrl = val
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
      uploadFile(file, this.resourceName, this.mediaType).then(res => {
        const url = window.URL.createObjectURL(file)
        this.$emit('input', res.key)
        this.imgUrl = url
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
          width: 80px;
          height: 80px;
          overflow: hidden;

          border: 1px solid $control-color;
          cursor: pointer;
          &__circle{
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
          &__square{
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
          }

          .no-img {
            cursor: pointer;
            font-weight: 400;
            color: inherit;
            font-size: 100px;
            transform: scale(0.2);
          }
        }

        .upload-text {
          margin-left: 16px;
          color: #606266;
          text-align: left;

          .btn-upload {
            color: inherit;
            outline: none;
            border: 1px solid #eee;
            background: none;

            text-align: center;
            height: 40px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            cursor: pointer;

            &:hover, &:focus {
              color: #409EFF;
              border-color: #c6e2ff;
              background-color: #ecf5ff;
            }
          }
        }
      }

    }
  }
</style>
