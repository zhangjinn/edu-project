<template>
  <div class="fileItem" @click="clickFile">

    <!--    <div v-if="item.type === 'image'" class="fileBox-left">-->
    <!--      <figure class="prevImg">-->
    <!--        <a :href="item.url" :data-size="imgSize">-->
    <!--          <img :src="require(`@/assets/images/fileCenter/image.png`)" alt="">-->
    <!--        </a>-->
    <!--      </figure>-->
    <!--      <div class="fileBox-title">-->
    <!--        <h3>{{ item.name }}</h3>-->
    <!--        <p>{{ item.employeeName }} {{ item.time }}</p>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="fileBox-left">
      <img :src="require(`@/assets/images/fileCenter/${item.type}.png`)" alt="">
      <div class="fileBox-title">
        <h3>{{ item.name }}</h3>
        <p>{{ item.employeeName }} {{ item.time }}</p>
      </div>
    </div>
    <div class="fileBox-right">
      {{ item.size | size }}

      <i v-if="item.type === 'dir'" class="iconfont iconright1" />
      <i v-else class="iconfont iconxiazai" :class="[item.download ? '' : 'noDownload']" @click.stop="downloadFile(item)" />
    </div>
  </div>
</template>

<script>
import { queryDownload } from '@/service/base/fileCenter'
import { Notify } from 'vant'
import { downloadFileForUrl } from '@/js/common'

export default {
  name: 'FileItem',
  filters: {
    size(n) {
      const mb = 1024 * 1024
      const gb = mb * 1024
      if (!n && n !== 0) {
        return ''
      } else {
        if (n > gb) {
          return (n / gb).toFixed(2) + 'GB'
        } else {
          return (n / mb).toFixed(2) + 'MB'
        }
      }
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imgSize: '0x0'
    }
  },
  created() {
    if (this.item.type === 'image') {
      const img = new Image()
      img.src = this.item.url

      img.onload = () => {
        this.imgSize = `${img.width}x${img.height}`
      }
    }
  },
  methods: {
    downloadFile(item) {
      if (!item.download) {
        Notify({
          type: 'warning',
          message: '该文件不可下载'
        })
        return false
      }
      queryDownload(item.id).then(res => {
        if (res.fileName === 'unknown') {
          Notify({ type: 'danger', message: '该文件夹没有可下载文件' })
        } else {
          Notify({ type: 'success', message: '文件下载成功' })
          downloadFileForUrl(res)
        }
      })
    },
    clickFile() {
      // clearTimeout(timer)
      // timer = setTimeout(() => {
      this.$emit('file', Object.assign({}, this.item))
      // }, 240)
    }
  }
}
</script>

<style scoped lang="scss">
.fileItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  .fileBox-right {
    font-size: 14px;
    color: #999;

    .noDownload{
      opacity: .2;
    }
  }

  .fileBox-left{
    display: flex;
    flex: 1;
    align-items: center;
    .fileBox-title{
      text-align: left;
      font-size: 13px;
      color: #999;
      h3{
        font-size: 15px;
        color: #222222;
        font-weight: 500;
        line-height: 1;
        margin-bottom: 8px;
      }
    }
    img {
      width: 30px;
      height: 30px;
      display: block;
      margin-right: 14px;
    }
  }
}
</style>
