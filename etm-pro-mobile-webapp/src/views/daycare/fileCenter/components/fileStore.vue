<template>
  <div class="fileStore file-boxs">
    <template v-if="fileLists.length">
      <file-item v-for="(item) in fileLists" :key="item.id" :item="item" @file="clickFile" />
    </template>
    <no-content v-else type="list" />

    <preview-image ref="zeroPhoto" />
  </div>
</template>

<script>
import fileItem from './fileItem'
import previewImage from '@/views/daycare/fileCenter/components/reviewFile/previewImage'
import noContent from '@/components/common/noContent'
import {
  deepClone
} from '@/views/daycare/courseTimeManage/utils'
export default {
  name: 'FileStore',
  components: {
    fileItem,
    noContent,
    previewImage
  },
  props: {
    filter: {
      type: String,
      default: 'all'
    },
    sort: {
      type: String,
      default: 'name'
    },
    lists: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      fileLists: []
    }
  },
  watch: {
    filter: {
      handler(n) {
        this.fileTypeChange(n)
      }
    },
    sort: {
      // immediate: true,
      handler(n) {
        this.$nextTick(() => {
          this.sortFile()
        })
      }
    },
    lists: {
      immediate: true,
      deep: true,
      handler(n) {
        this.sortFile()
      }
    }
  },
  methods: {
    clickFile(e) {
      if (e.type === 'dir') {
        this.$emit('goNext', e)
      } else {
        this.$emit('click', e)
      }
      // switch (e.type) {
      // case 'image':
      //   break
      // case 'music' :
      //   // if (!this.musicLists.some(cur => {
      //   //   return cur.id === e.id
      //   // })) {
      //   //   this.musicLists.unshift(e)
      //   // } else {
      //   //   this.$message.warning('播放列表已存在该音频')
      //   // }
      //
      //   break
      // case 'dir' :
      //   // this.crumbs.push({
      //   //   name: e.name,
      //   //   id: e.id
      //   // })
      //   this.$emit('goNext', e)
      //   break
      // case 'video':
      //   // this.videoSrc = e.url
      //   // this.$nextTick(() => {
      //   //   this.$refs.previewVideo.show()
      //   // })
      //   break
      // case 'pdf' :
      //   // this.pdfSrc = e.url
      //   // this.$nextTick(() => {
      //   //   this.$refs.previewPdf.show()
      //   // })
      //   break
      // default :
      //   console.log('暂不支持该文件预览')
      //   // this.$message.warning('暂不支持该文件预览')
      // }
    },
    fileTypeChange(e) {
      const key = e.toLowerCase()
      if (key === 'all') {
        this.fileLists = deepClone(this.lists)
      } else if (key === 'word') {
        this.fileLists = this.lists.filter(cur => {
          return ['word', 'excel', 'ppt', 'pdf', 'txt'].includes(cur.type)
        })
      } else {
        this.fileLists = this.lists.filter(cur => {
          return cur.type === key
        })
      }
    },
    sortFile() {
      this.fileTypeChange(this.filter)

      const list = deepClone(this.fileLists)
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

      this.fileLists = list

      this.$nextTick(() => {
        // this.$refs.zeroPhoto.initPhotoSwipeFromDOM('.file-boxs')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fileStore{

}
</style>
