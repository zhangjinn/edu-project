<template>
  <div class="fileStore">
    <div v-if="search" class="file-filter">
      <p>快速筛选：</p>
      <el-radio-group v-model="filter" @change="fileTypeChange">
        <el-radio label="all">全部</el-radio>
        <el-radio label="image">图片</el-radio>
        <el-radio label="word">文档</el-radio>
        <el-radio label="music">音乐</el-radio>
        <el-radio label="video">视频</el-radio>
        <el-radio label="undefine">其他</el-radio>
      </el-radio-group>
    </div>

    <div v-if="$slots['left'] || $slots['right']" class="file-tools">
      <div class="file-tools-left">
        <slot name="left" :data="{choiceNumber, lists : watchChoiceLists}" />
      </div>
      <div class="file-tools-right">
        <slot name="right" :data="{choiceNumber, lists : watchChoiceLists}" />
      </div>
    </div>
    <div class="file-body">
      <div class="file-crumbs">
        <etm-text v-if="crumbs.length" @click="goOther(crumbs.length-2)">返回上一级</etm-text>
        <span v-if="crumbs.length" class="division" />

        <template v-if="!crumbs.length">
          <span class="file-crumbs-end">全部文件</span>
        </template>
        <template v-else>
          <etm-text @click="goOther(-1)">全部</etm-text>
          <template v-for="(item, index) in crumbs">
            <span v-if="index !== crumbs.length - 1" :key="index">
              <span class="file-to" />
              <span style="cursor: pointer" @click="goOther(index)">{{ item.name }}</span>
            </span>
            <span v-else :key="index">
              <span class="file-to" />
              <span class="file-crumbs-end">{{ item.name }}</span>
            </span>
          </template>
        </template>

      </div>
      <div v-if="lists.length" class="file-choice">
        <el-checkbox v-model="choiceAll" @change="checkboxChange" />
        {{ choiceNumber ? `已选中${choiceNumber}个文件/文件夹` : '全选文件' }}
      </div>
      <div v-if="lists.length" class="file-boxs">
        <template v-for="(item, index) in lists">
          <!--        文件组件-->
          <file-item :key="item.id" v-model="watchChoiceLists[index]" :disable="item.disable" :item="item" @choice="choiceFiles" @file="clickFile" />
        </template>
      </div>
      <etm-empty v-else empty-text="没有找到文件" />
    </div>

    <!--    视频组件-->
    <preview-video ref="previewVideo" :src="videoSrc" />

    <!--    pdf预览组件-->
    <preview-pdf v-if="pdfSrc" ref="previewPdf" :src="pdfSrc" />

    <!--    音频组件-->
    <preview-music v-if="musicLists.length" ref="previewMusic" :list="musicLists" @close="musicLists = []" />

    <!--    图片预览组件-->
    <preview-image ref="zeroPhoto" />

    <preview-txt ref="previewText" :src="txtSrc" />

    <!--    excel预览组件-->
    <!--    <preview-excel ref="previewExcel" />-->
  </div>
</template>

<script>
import { deepClone } from '@/views/newDaycare/contract/common'
import previewImage from '@/views/base/cloudDisk/components/readFile/previewImage'
import previewVideo from '@/views/base/cloudDisk/components/readFile/previewVideo'
import previewMusic from '@/views/base/cloudDisk/components/readFile/previewMusic'
import previewPdf from '@/views/base/cloudDisk/components/readFile/previewPdf'
import previewTxt from '@/views/base/cloudDisk/components/readFile/previewTxt'
// import previewExcel from '@/views/base/cloudDisk/components/readFile/previewExcel'

import fileItem from './fileItem'
export default {
  name: 'FileStore',
  components: {
    fileItem,
    previewImage,
    previewVideo,
    previewMusic,
    previewPdf,
    previewTxt
    // previewExcel
  },
  props: {
    search: {
      type: Boolean,
      default: false
    },
    fileLists: {
      type: Array,
      default() {
        return []
      }
    },
    sort: {
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      crumbs: [],
      videoSrc: '',
      pdfSrc: '',
      txtSrc: '',
      filter: 'all',
      choiceNumber: 0,
      lists: [],
      musicLists: [],
      choiceAll: false,
      watchChoiceLists: []
    }
  },
  watch: {
    sort(n) {
      this.sortFile()
    },
    fileLists: {
      deep: true,
      handler(n) {
        this.lists = deepClone(n)
        this.$nextTick(() => {
          this.fileTypeChange('all')
          this.sortFile()
        })
      }
    }
  },
  mounted() {
  },
  created() {
    // this.sortFile()
  },
  methods: {
    initData() {
      this.crumbs = []
      this.filter = 'all'
      // this.musicLists = []

      this.cancelChoiceData()
    },
    cancelChoiceData() {
      this.choiceNumber = 0
      this.choiceAll = false
      this.watchChoiceLists = []
    },
    fileTypeChange(e) {
      const key = e.toLowerCase()
      if (key === 'all') {
        this.lists = deepClone(this.fileLists)
      } else if (key === 'word') {
        this.lists = this.fileLists.filter(cur => {
          return ['word', 'excel', 'ppt', 'pdf', 'txt'].includes(cur.type)
        })
      } else {
        this.lists = this.fileLists.filter(cur => {
          return cur.type === key
        })
      }

      this.choiceNumber = 0
      this.choiceAll = false
      this.watchChoiceLists = this.lists.map(cur => {
        return Object.assign({}, cur, {
          isChoice: false
        })
      })
    },
    checkboxChange(e) {
      this.watchChoiceLists = this.watchChoiceLists.map(cur => {
        cur.isChoice = cur['disable'] === false ? e : false
        return cur
      })

      this.$emit('choice', this.watchChoiceLists.filter(cur => {
        return cur.isChoice
      }))

      // if (e) {
      //   this.watchChoiceLists = this.watchChoiceLists.map(cur => {
      //     cur.isChoice = true
      //     return cur
      //   })
      // } else {
      //   this.watchChoiceLists = this.watchChoiceLists.map(cur => {
      //     cur.isChoice = false
      //     return cur
      //   })
      // }
      this.$nextTick(() => {
        this.choiceFileNumber()
      })
    },
    choiceFiles(e) {
      this.$nextTick(() => {
        this.choiceFileNumber()

        this.$emit('choice', this.watchChoiceLists.filter(cur => {
          return cur.isChoice
        }))
      })
    },
    // 计算选中的文件数目
    choiceFileNumber() {
      this.choiceNumber = this.watchChoiceLists.reduce((prev, cur) => {
        let result = 0
        if (cur.isChoice) {
          result = 1
        }
        return prev + result
      }, 0)
    },
    // 面包屑跳转
    goOther(index) {
      const item = this.crumbs[index] || {
        id: null,
        name: ''
      }

      if (index === -1) {
        this.crumbs = []
      } else {
        this.crumbs = this.crumbs.slice(0, index + 1)
      }

      this.$nextTick(() => {
        this.$emit('crumbsEvent', { item, index })
      })
    },
    clickFile(e) {
      switch (e.type) {
        case 'image':
          break
        case 'music' :
          if (!this.musicLists.some(cur => {
            return cur.id === e.id
          })) {
            this.musicLists.unshift(e)
          } else {
            this.$message.warning('播放列表已存在该音频')
          }

          break
        // case 'txt':
          // this.txtSrc = e.url
          // this.$nextTick(() => {
          //   this.$refs['previewText'].show()
          // })
        //  break
        case 'dir' :
          this.crumbs.push({
            name: e.name,
            id: e.id
          })
          this.$emit('goNext', e)
          break
        case 'video':
          this.videoSrc = e.url
          this.$nextTick(() => {
            this.$refs.previewVideo.show()
          })
          break
        case 'pdf' :
          this.pdfSrc = e.url
          this.$nextTick(() => {
            this.$refs.previewPdf.show()
          })
          break
        default :
          this.$message.warning('暂不支持该文件预览')
      }
    },
    // 排序文件
    sortFile() {
      const list = deepClone(this.lists)
      const length = list.length
      let temp = ''

      for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
          switch (this.sort) {
            case 'time':
              temp = list[j]
              if (list[j].time - list[j + 1].time > 0) {
                list[j] = list[j + 1]
                list[j + 1] = temp
              }
              break
            case 'name':
              temp = list[j]
              if (list[j].name.charCodeAt(0) - list[j + 1].name.charCodeAt(0) > 0) {
                list[j] = list[j + 1]
                list[j + 1] = temp
              }
              break
          }
        }
      }

      this.lists = list
      this.watchChoiceLists = list.map(cur => {
        return Object.assign({}, cur, {
          isChoice: cur.isChoice || false
        })
      })
      this.$nextTick(() => {
        this.$refs.zeroPhoto.initPhotoSwipeFromDOM('.file-boxs')
      })
    }
  }
}
</script>

<style scoped lang="scss">

.fileStore{
  height: calc(100% - 68px);
  overflow-y: scroll;
  overflow-x: hidden;
  //margin-top: 22px;

  position: relative;

  .file-filter{
    margin-top: 22px;
    display: flex;
    align-items: center;

    ::v-deep{
      .el-radio{
        margin-right: 16px;
      }
    }
  }

  .file-tools{
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .file-tools-left,
    .file-tools-right{
      display: flex;
      align-items: center;
    }
  }

  .file-crumbs,
  .file-choice{
    margin-top: 24px;
    line-height: 1;
    font-size: 14px;
    //color: $pink;
    @include etm-color;
  }

  .file-crumbs{
    display: flex;
    align-items: center;
    line-height: 26px;

    .file-crumbs-end{
      color: #666;
    }

    .division {
      display: inline-block;
      width: 1px;
      height: 14px;
      margin: 0 10px;
      background: #eee;
    }

    .file-to{
      display: inline-block;
      width: 6px;
      height: 10px;
      color:#eee;
      position: relative;
      margin: 0 10px;
      &::after {
        display: block;
        content: '';
        width: 1px;
        height: 6px;
        background: #eee;
        position: absolute;
        left: 50%;
        top: 0;
        transform: rotate(-50deg);
      }

      &::before{
        display: block;
        content: '';
        width: 1px;
        height: 6px;
        background: #eee;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: rotate(50deg);
      }
    }

    ::v-deep{
      .EtmText-wrap{
        margin-right: 0;
      }
    }
  }

  .file-boxs{
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
