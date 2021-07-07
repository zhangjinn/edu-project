<template>
  <div class="CloudDisk">
    <div class="tabsTools">
      <div class="tabsToolsItem" @click="space = true">
        <i class="iconfont iconyunpankongjian" />
        云盘空间
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane name="my" label="我的文件" />
        <el-tab-pane name="share" label="我的共享" />
        <el-tab-pane name="shareMe" label="共享给我" />
      </el-tabs>
    </div>

    <!--    文件列表-->
    <file-store
      ref="fileStore"
      :sort="sortType"
      :search="true"
      :file-lists="myFiles"
      @crumbsEvent="crumbsEvent"
      @goNext="goNext"
      @choice="fileChoice"
    >
      <template v-slot:left="row">
        <template v-if="activeName === 'my'">
          <el-button icon="iconfont iconxinjianwenjianjia" @click="componentShow('createDir')">创建文件夹</el-button>
          <el-button type="primary" icon="iconfont iconshangchuan" @click="componentShow('uploadFile', 'resetSize')">
            上传文件
          </el-button>
          <el-button v-if="treasureBook.enable" slot="right" type="primary" @click.stop="openBook">
            {{ treasureBook.treasuredBookName }}
          </el-button>
          <el-button-group v-if="row.data.choiceNumber">
            <el-button icon="iconfont icongongxiang" @click="componentShow('shareFile')">共享</el-button>
            <el-button icon="iconfont iconxiazai" @click="download">下载</el-button>
            <el-button
              icon="iconfont iconzhongmingming"
              :disabled="row.data.choiceNumber !== 1"
              @click="componentShow('rename')"
            >重命名
            </el-button>
            <el-button icon="iconfont iconshanchu2" @click="deleteFile">删除</el-button>
          </el-button-group>
        </template>
        <template v-else-if="activeName === 'share'">
          <el-button
            :disabled="row.data.choiceNumber !== 1"
            plain
            icon="iconfont icongongxiang"
            @click="componentShow('editShare')"
          >编辑共享
          </el-button>
          <el-button v-if="treasureBook.enable" slot="right" type="primary" @click.stop="openBook">
            {{ treasureBook.treasuredBookName }}
          </el-button>
        </template>
        <template v-else>
          <el-button plain :disabled="row.data.choiceNumber < 1" icon="iconfont iconxiazai" @click="download">
            下载
          </el-button>
          <el-button v-if="treasureBook.enable" slot="right" type="primary" @click.stop="openBook">
            {{ treasureBook.treasuredBookName }}
          </el-button>
        </template>

      </template>
      <template slot="right">
        <div class="search-tools">
          <div class="file-search-box">
            <el-input v-model="keywords" placeholder="搜索您的文件" @change="search" />
            <i class="iconfont iconsousuo" />
          </div>

          <el-dropdown>
            <p><i class="iconfont iconpaixu1" /></p>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="changeSort('name')">文件名称</span></el-dropdown-item>
              <el-dropdown-item><span @click="changeSort('time')">上传时间</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </file-store>

    <!--    重命名-->
    <rename ref="rename" :document="choiceFiles[0]" @success="init" />

    <!--   创建文件夹-->
    <create-dir ref="createDir" :parent-id="documentId" @success="init" />

    <!--    上传文件-->
    <upload-file
      ref="uploadFile"
      :size="`${diskCapacity.remainingSpace + diskCapacity.remainingSpaceUnit}`"
      :parent-id="documentId"
      @success="init"
    />

    <!--    共享文件-->
    <share ref="shareFile" :choice="choiceFiles" @success="init" />

    <!--    编辑共享-->
    <edit-share ref="editShare" :document="choiceFiles[0]" @success="init" />

    <!--    网盘空间-->
    <etm-pop
      title="云盘空间"
      :visible="space"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="space = false"
    >

      <div class="total-box">
        <div class="box-left">
          <el-progress
            type="circle"
            stroke-linecap="butt"
            :stroke-width="15"
            :width="140"
            :show-text="false"
            :percentage="percentage"
          />
          <div class="box-info">
            <p>总空间</p>
            <p>{{ (diskCapacity.totalSpace || 0).toFixed(2) }}{{ diskCapacity.totalSpaceUnit }}</p>
          </div>
        </div>
        <div class="box-right">
          <div class="pop-space">
            <p>可用空间</p>
            <div>
              <etm-text>{{ (diskCapacity.remainingSpace || 0).toFixed(2) }}</etm-text>
              {{ diskCapacity.remainingSpaceUnit }}</div>
          </div>
          <div class="pop-space">
            <p>已用空间</p>
            <div>
              <etm-text>{{ (use || 0).toFixed(2) }}</etm-text>
              {{ diskCapacity.remainingSpaceUnit }}
            </div>
          </div>
        </div>
      </div>

    </etm-pop>
    <treasure-book :show-book="showBook" :book-data="treasureBook" @close="closeBook" />
  </div>
</template>

<script>
import fileStore from '@/views/base/cloudDisk/components/fileStore'
import rename from '@/views/base/cloudDisk/components/pops/rename'
import createDir from '@/views/base/cloudDisk/components/pops/createDir'
import uploadFile from '@/views/base/cloudDisk/components/pops/uploadFile'
import share from '@/views/base/cloudDisk/components/pops/share'
import editShare from '@/views/base/cloudDisk/components/pops/editShare'
import DownloadJs from 'downloadjs'
import {
  queryFileLists,
  removeFolder,
  queryShareMe,
  // queryDownload,
  queryDownloadMap,
  queryShare,
  queryDiskCapacity
} from '@/api/base/cloudDisk'
// import { downloadFileForUrl } from '@/utils/file'
import TreasureBook from '@/components/TreasuredBook'
import { queryTreasuredBook } from '@/api/base/treasuredBook'
import { Loading } from 'element-ui-etm'
import JSZip from 'jszip'
import axios from 'axios'

let uploadLoading
export default {
  name: 'CloudDisk',
  components: {
    fileStore,
    rename,
    createDir,
    uploadFile,
    editShare,
    share,
    TreasureBook
  },
  data() {
    return {
      // folderId: null,
      activeName: 'my',
      sortType: 'name',
      space: false,
      choiceFiles: [],
      diskCapacity: {},
      documentId: null,
      keywords: '',
      listApi: {
        my: queryFileLists,
        share: queryShare,
        shareMe: queryShareMe
      },
      shareId: null,
      // 我的文件文件列表
      myFiles: [],
      treasureBook: {},
      showBook: false
    }
  },
  computed: {
    percentage() {
      const use = this.diskCapacity.totalSpace - this.diskCapacity.remainingSpace
      // console.log(Math.ceil(use / this.diskCapacity.totalSpace * 100))
      // console.log(Math.ceil((this.diskCapacity.totalSpace - this.diskCapacity.remainingSpace) / this.diskCapacity.totalSpace) * 100)
      return Math.ceil(use / this.diskCapacity.totalSpace) || 0
    },
    use() {
      return (this.diskCapacity.totalSpace - this.diskCapacity.remainingSpace)
    }
  },
  watch: {
    space: {
      immediate: true,
      handler(n) {
        if (n) {
          this.$nextTick(() => {
            this.resetSize()
          })
        }
      }
    },
    activeName: {
      handler(n) {
        this.cancelCacheData()
        this.$refs['fileStore'].initData()
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created() {
    this.init()
    this.getTreasureBook()
  },
  methods: {

    getTreasureBook() {
      const param = {
        coding: 'ziliaoku'
      }
      queryTreasuredBook(param).then(res => {
        this.treasureBook = res.data
      })
    },
    openBook() {
      this.showBook = true
    },
    closeBook() {
      this.showBook = false
    },
    // 清空缓存数据
    cancelCacheData() {
      // this.folderId = null
      this.documentId = null
      this.choiceFiles = []
      this.keywords = ''
      this.shareId = null
    },
    // 进入下一层目录
    goNext(e) {
      this.documentId = e.id
      this.shareId = e.shareId
      this.choiceFiles = []

      this.$nextTick(() => {
        this.init()
      })
    },
    init() {
      if (this.$refs['fileStore']) {
        this.$refs['fileStore'].cancelChoiceData()
      }

      const params = {
        documentId: this.documentId,
        documentName: this.keywords || null
      }

      if (this.activeName !== 'my') {
        params.sharedId = this.shareId
      }

      this.listApi[this.activeName](params).then(res => {
        this.myFiles = (res.data || []).map(cur => {
          return {
            name: cur.documentName,
            time: cur.createTime,
            url: cur.filePath,
            type: cur.type === 'DIRECTORY' ? 'dir' : cur.fileType.toLocaleLowerCase(),
            id: cur.documentId || cur.fileId,
            shareId: cur.sharedId || null,
            download: cur.download || false,
            longTime: cur.longTime || false,
            sharedEndItem: cur.sharedEndItem || null,
            sharedStartItem: cur.sharedStartItem || null,
            sharePersonIds: cur.sharePersonIds || [],
            disable: this.activeName === 'shareMe' ? cur.download === false : false
          }
        })
      })
    },
    changeSort(type) {
      this.sortType = type
    },
    componentShow(ref, fn) {
      this.$refs[ref].show()
      if (fn) {
        this[fn]()
      }
    },
    resetSize() {
      queryDiskCapacity().then(res => {
        this.diskCapacity = res.data
      })
    },
    // 删除文件
    deleteFile() {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除选择的文件？',
        content: ``,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          const _arg = this.choiceFiles.map(cur => {
            return cur.id
          })
          removeFolder(_arg).then(res => {
            this.$message.success('删除文件成功')
            this.init()
          })

          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // 关键字搜索
    search(e) {
      this.$nextTick(() => {
        this.init()
      })
    },
    fileChoice(e) {
      this.choiceFiles = e
    },

    // 面包屑点击事件
    crumbsEvent({ item }) {
      this.choiceFiles = []
      this.documentId = item.id
      this.$nextTick(() => {
        this.init()
      })
    },

    // 下载文件
    download() {
      this.$etmTip.init({
        type: 'warn',
        title: `确认要下载选择的${this.choiceFiles.length}个文件？`,
        content: ``,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          if (this.choiceFiles.length === 1 && this.choiceFiles[0].type !== 'dir') {
            DownloadJs(this.choiceFiles[0].url)
          } else {
            uploadLoading = Loading.service({
              fullscreen: true,
              lock: true,
              text: '正在下载文件...',
              background: 'rgba(0,0,0,.1)'
            })

            const ids = []
            this.choiceFiles.forEach(cur => {
              if (cur.isChoice) {
                ids.push(cur.id)
              }
            })
            // 多文件下载后端处理
            // queryDownload(ids.join(',')).then(res => {
            //   if (res.fileName === 'unknown') {
            //     this.$message.warning('该文件夹没有可下载文件')
            //   } else {
            //     this.$message.success('文件下载成功')
            //     downloadFileForUrl(res)
            //   }
            //   uploadLoading.close()
            // })

            // 多文件下载前端处理
            queryDownloadMap(ids.join(',')).then(res => {
              const zip = new JSZip()
              const folderMap = {}
              const allFile = []

              if (res.data.countSize > (1024 * 1024 * 100)) {
                this.$message.warning('多文件下载大小不能大于100M')
                uploadLoading.close()
                return
              }

              res.data.fileDetailsItems.forEach(function(obj, index) {
                allFile[index] = new Promise((resolve, reject) => {
                  if (!folderMap[obj.path]) {
                    folderMap[obj.path] = zip.folder(obj.path)
                  }
                  const pf = folderMap[obj.path]
                  // 第三个参数必须设置，否则下载的文件将产生错误
                  // zip.file(obj.filename, obj.url, obj.path)
                  axios({
                    url: obj.url,
                    responseType: 'blob'
                  }).then(res => {
                    pf.file(obj.fileName, res.data, obj.path)
                    resolve()
                  }).catch(() => {
                    reject()
                  })
                })
              })

              Promise.all(allFile).then(res => {
                // 生成zip文件并下载
                zip.generateAsync({
                  type: 'blob'
                }).then(function(content) {
                  // 下载的文件名
                  const filename = `合并文件-${new Date().getTime()}.zip`
                  // 创建隐藏的可下载链接
                  const eleLink = document.createElement('a')
                  eleLink.download = filename
                  eleLink.style.display = 'none'
                  // 下载内容转变成blob地址
                  eleLink.href = URL.createObjectURL(content)
                  // 触发点击
                  document.body.appendChild(eleLink)

                  eleLink.click()
                  // 然后移除
                  document.body.removeChild(eleLink)
                  uploadLoading.close()
                }).catch(() => {
                  uploadLoading.close()
                  this.$message.error('文件下载失败')
                })
              }).catch(() => {
                uploadLoading.close()
                this.$message.error('文件下载失败')
              })
            })
          }

          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }

  }
}
</script>

<style scoped lang="scss">

/**
 * svg边框颜色
 */
@mixin etm-stroke {
  @each $key, $value in $themes {
    .#{$key} & {
      stroke: map_get($value, 'color');
    }
  }
}

.el-dialog__body {
  .total-box{
    display: flex;
    padding: 6px 0 2px;
    justify-content: center;
    align-items: center;
    width: 340px;
    margin: 0 auto;

    ::v-deep{
      .el-progress-circle__track{
        stroke : #e2e2e2
      }
      .el-progress-circle__path{
        @include etm-stroke;
      }
    }

    .box-left{
      width: 140px;
      height: 140px;
      position: relative;

      .box-info{
        width: 110px;
        height: 110px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: absolute;
        top: 15px;
        left: 15px;

        p{
          line-height: 20px;
        }
      }
    }

    .box-right{
      flex: 1;
      margin-left: 30px;

      .pop-space {
        display: flex;
        height: 36px;
        line-height: 36px;
        justify-content: space-between;
        align-items: center;

        p:before{
          content: '';
          width: 12px;
          height: 12px;
          margin-top: -2px;
          border-radius: 2px;
          margin-right: 10px;
          display: inline-block;
          background: #E2E2E2;
          vertical-align: middle;
        }

        &:first-child{
          p:before{
            @include etm-bgc;
          }
        }

        ::v-deep {
          .EtmText-wrap {
            margin-right: 2px;
          }
        }

      }
    }
  }
}

::v-deep {
  .etm-pink .el-tabs__content,
  .el-tabs__content {
    overflow: unset !important;
  }
}

.CloudDisk {

  height: calc(100% - 32px);
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding: 0 16px 16px;

  .tabsTools {
    position: relative;

    .tabsToolsItem {
      height: 56px;
      position: absolute;
      top: 0;
      font-size: 14px;
      cursor: pointer;
      color: #030303;
      line-height: 56px;
      padding-right: 6px;
      z-index: 100;
      cursor: pointer;
      right: 0;

      i {
        color: #999999;
      }

      &:hover {
        @include etm-color();

        i {
          @include etm-color();
        }
      }
    }
  }

  .search-tools {
    display: flex;

    p {
      margin-left: 10px;

      i {
        font-size: 20px;
        color: #555;
      }
    }
  }

  .file-search-box {
    width: 314px;
    height: 34px;
    overflow: hidden;
    position: relative;

    ::v-deep {
      .el-input {
        height: 100%;
        width: 100%;
        background: transparent;

        input {
          display: block;
          padding: 0 16px;
          width: 100%;
          height: 100%;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          line-height: 32px;

          &:hover{
            @include etm-bdc;
          }
        }
      }
    }

    i {
      top: 50%;
      transform: translate(0, -50%);
      position: absolute;
      right: 10px;
      font-size: 14px;
      color: #697277;

      &:hover{
        @include etm-color;
      }
    }
  }

  ::v-deep {

    .file-tools-left {
      .el-button {
        display: block;
      }

      .el-button-group {
        margin-left: 8px;
      }

      & > .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>
