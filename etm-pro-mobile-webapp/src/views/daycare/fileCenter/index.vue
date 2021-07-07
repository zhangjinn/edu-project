<template>
  <div class="fileCenter">
    <!--    <div id="wrapper" style="width: 100vw; height: 100vh" />-->
    <setting-title :go-back="!prevDir.length">
      <div v-if="prevDir.length" slot="left">
        <i class="iconfont iconleft" @click.stop="goPrev" />
      </div>

      <div class="title-slot">
        <template v-if="prevDir.length">
          <span v-for="(item, index) in prevDir" :key="index">
            {{ item.name }}/
          </span>
          {{ currDir.name }}
        </template>
        <template v-else>{{ currDir.name }}</template>
      </div>
      <div slot="right">
        <i v-if="(active === 0 && currDir.pageType === 'preview') || (active !== 0 && currDir.download && currDir.pageType === 'preview')" class="iconfont iconxiazai" @click="downloadFile" />
      </div>
    </setting-title>

    <template v-if="currDir.pageType === 'page'">
      <div class="search-box">
        <i class="iconfont iconsousuo" />
        <input type="text" placeholder="请输入文件名称" @blur="search">
      </div>
      <div class="fileType-box">
        <div class="fileType-item" @click="typeChange('all')">
          <img :src="require('@/assets/images/fileCenter/typeOther.png')" alt="">
          <p>全部</p>
        </div>
        <div class="fileType-item" @click="typeChange('image')">
          <img :src="require('@/assets/images/fileCenter/typeImage.png')" alt="">
          <p>图片</p>
        </div>
        <div class="fileType-item" @click="typeChange('word')">
          <img :src="require('@/assets/images/fileCenter/typeWord.png')" alt="">
          <p>文档</p>
        </div>
        <div class="fileType-item" @click="typeChange('video')">
          <img :src="require('@/assets/images/fileCenter/typeVideo.png')" alt="">
          <p>视频</p>
        </div>
        <div class="fileType-item" @click="typeChange('music')">
          <img :src="require('@/assets/images/fileCenter/typeMusic.png')" alt="">
          <p>音频</p>
        </div>

      </div>
      <div class="fileList-box">
        <div class="fileList-tabbs">
          <van-tabs v-model="active" @change="tabberChange">
            <van-tab title="我的文件" />
            <van-tab title="我的共享" />
            <van-tab title="共享给我" />
          </van-tabs>
        </div>
        <div class="fileList-sort">
          排序
          <div @click="showPicker = true">
            按{{ sort }}排序
            <i class="iconfont iconarrow-down" />
          </div>
        </div>

        <div class="fileList-list">
          <file-store :lists="fileLists" :filter="filter" :sort="sort === '时间' ? 'time' : 'name'" @goNext="goNext" @click="fileClick" />
        </div>

        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
    </template>
    <template v-else>
      <div style="width: 100vw; height:calc(100vh - 34px);">
        <component :is="previewFile[currDir.fileType]" ref="previewFile" :item="currDir" />
      </div>
    </template>

  </div>
</template>

<script>
import fileStore from './components/fileStore'
import settingTitle from '@/views/daycare/courseTimeManage/components/settingTitle'
import { Notify } from 'vant'

import previewImage from '@/views/daycare/fileCenter/components/reviewFile/previewImage'
import previewVideo from '@/views/daycare/fileCenter/components/reviewFile/previewVideo'
import previewMusic from '@/views/daycare/fileCenter/components/reviewFile/previewMusic'
import previewPdf from '@/views/daycare/fileCenter/components/reviewFile/previewPdf'

import {
  queryFileLists,
  queryShare,
  queryShareMe,
  queryDownload
} from '@/service/base/fileCenter'
import { parseTime } from '@/utils/date'
import {
  downloadFileForUrl
} from '@/js/common'

export default {
  name: 'FileCenter',
  components: {
    fileStore,
    settingTitle
  },
  data() {
    return {
      keywords: '',
      sort: '文件名',
      filter: 'all',
      goBack: false,

      prevDir: [],
      currDir: {
        id: null,
        shareId: null,
        name: '根目录',
        pageType: 'page',
        download: false
      },
      previewFile: {
        video: previewVideo,
        image: previewImage,
        music: previewMusic,
        pdf: previewPdf
      },
      getListsApi: [queryFileLists, queryShare, queryShareMe],
      active: 0,
      fileLists: [],
      showPicker: false,
      columns: ['文件名', '时间']
    }
  },
  mounted() {

  },
  created() {
    this.init()
  },
  methods: {
    fileClick(e) {
      if (['image', 'video', 'music', 'pdf', 'dir'].includes(e.type)) {
        this.prevDir.push(this.currDir)
        this.currDir = {
          id: e.id,
          shareId: null,
          name: e.name,
          pageType: 'preview',
          fileType: e.type,
          url: e.url || null,
          download: e.download
        }
      } else {
        Notify({ type: 'warning', message: '该文件暂不支持预览' })
      }
    },

    downloadFile() {
      queryDownload(this.currDir.id).then(res => {
        if (res.fileName === 'unknown') {
          Notify({ type: 'danger', message: '该文件夹没有可下载文件' })
        } else {
          Notify({ type: 'success', message: '文件下载成功' })
          downloadFileForUrl(res)
        }
      })
    },
    goPrev() {
      this.currDir = this.prevDir[this.prevDir.length - 1]
      this.prevDir.pop()
      this.keywords = ''
      this.sort = '文件名'

      this.$nextTick(() => {
        this.init()
      })
    },
    goNext(e) {
      this.prevDir.push(this.currDir)
      console.log(e)
      this.currDir = {
        id: e.id,
        name: e.name,
        shareId: e.shareId || null,
        pageType: 'page'
      }
      this.keywords = ''
      this.sort = '文件名'

      this.$nextTick(() => {
        this.init()
      })
    },
    init() {
      this.getListsApi[this.active]({
        documentId: this.currDir.id,
        sharedId: this.currDir.shareId,
        documentName: this.keywords
      }).then(res => {
        this.fileLists = (res.data.data || []).map(cur => {
          return {
            name: cur.documentName,
            time: cur.createTime ? parseTime(cur.createTime, '{d}/{m}/{y}') : '',
            url: 'http://qiniu.etmpro.etmcn.com/' + cur.filePath,
            type: cur.type === 'DIRECTORY' ? 'dir' : cur.fileType.toLocaleLowerCase(),
            id: cur.documentId || cur.fileId,
            shareId: cur.sharedId || null,
            download: this.active === 0 ? true : (cur.download || false),
            longTime: cur.longTime || false,
            sharedEndItem: cur.sharedEndItem || null,
            sharedStartItem: cur.sharedStartItem || null,
            size: cur.size || false,
            employeeName: cur.employeeName,
            sharePersonIds: cur.sharePersonIds || [],
            disable: this.active === 2 ? cur.download === false : false
          }
        })
      })
    },
    typeChange(type) {
      this.filter = type
    },
    onConfirm(e) {
      this.sort = e
      this.showPicker = false

      // this.$nextTick(() => {
      //   this.init()
      // })
    },
    search(e) {
      this.keywords = e.target.value
      this.$nextTick(() => {
        this.init()
      })
    },
    tabberChange(e) {
      this.sort = '文件名'
      this.keywords = ''
      this.currDir.id = null
      this.currDir.shareId = null
      this.currDir.name = '根目录'
      this.prevDir = []

      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fileCenter{
  overflow: hidden;

  ::v-deep{

    .title-slot{
      color: #fff;
      span{
        color: #fff;
      }
    }

    .van-tabs__line{
      width: 28px !important;
      background: $theme;
    }

    .settingTitle{
      background: $theme;
      color: #fff;

      .iconfont{
        color: #fff;
      }

      .van-dropdown-menu.van-hairline--top-bottom {
        height: 100%;
        background: transparent;

        .van-ellipsis {
          color: #fff;
        }

        .van-dropdown-menu__title {
          &:after {
            border-color: transparent transparent #fff #fff
          }
        }
      }
    }
  }

  .search-box {
    width: 351px;
    height: 33px;
    border-radius: 4px;
    background: #fff;
    margin: 16px 12px 10px;
    padding-left: 34px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translate(0, -50%);
      color: #B5B5B5;
    }

    input {
      height: 33px;
      line-height: 33px;
      border: none;
      padding: 0 10px 0 0;
      font-size: 14px;
      display: block;
      color: #B5B5B5;
      width: 100%;
    }
  }

  .fileType-box{
    background: #fff;
    padding: 17px 0 18px;
    margin: 10px 12px 0;
    border-radius: 4px;
    display: flex;
    justify-content: space-around;

    .fileType-item{
      p{
        font-size: 13px;
        color: #222222;
        line-height: 1;
      }
      img {
        width: 40px;
        height: 40px;

      }
    }
  }

  .fileList-box{
    margin: 13px 12px 14px;
    border-radius: 4px;
    background: #fff;
    overflow:hidden;
    padding: 0 18px;

    .fileList-sort{
      font-size: 13px;
      color: #999;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      div{
        color: #222222;

        i{
          font-size: 12px;

          &::before{
            transform: scale(0.7);
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
