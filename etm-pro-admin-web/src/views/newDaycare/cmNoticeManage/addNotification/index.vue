<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="left" class="mockup">
          <div class="box-wrap">
            <etm-title :show-line="false">{{ title }}</etm-title>
            <div v-if="title && content" class="time-and-author">
              <span class="time">{{ nowTime }}</span>
              <span class="author">来源：{{ author || authorName }}</span>
            </div>
            <div class="preview-content" v-html="content" />
          </div>
        </div>
        <div slot="right">
          <div class="editor-title">
            <el-input
              v-model="title"
              placeholder="请输入标题"
              size="medium"
              maxlength="30"
              show-word-limit
            />
          </div>
          <div class="main-content">
            <rich-text ref="richText" :content="content" @richTextChange="richTextChange" />
            <etm-form type="dialog">
              <el-form-item label="发布范围">
                <select-tree
                  v-model="selectValue"
                  :tree-data="treeData"
                  :props="{
                    label: 'sourceName',
                    children: 'scopeOfAuthorizationList'
                  }"
                  :echoed-keys="echoedKeys"
                  width="300"
                  clearable
                  show-parent
                  node-key="sourceId"
                  placeholder="请选择发布范围"
                />
              </el-form-item>
            </etm-form>
          </div>
          <etm-form-foot save-btn="发布" cancel-btn="保存" @save="submitNotification('PUBLISHED')" @cancel="submitNotification('UNPUBLISHED')" />
          <input ref="file" class="file-image" style="display: none" accept="image/*,video/*" type="file" @change="imageChange">
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/3 10:22
 */
import { uploadFile, getUploadFilePrefix } from '@/api/base'
import {
  queryAllLesson,
  createNewNotification,
  queryIsNotification,
  getNotification
} from '@/api/newDaycare/cmNoticeManage'
import treeRange from '@/views/newDaycare/cmNoticeManage/utils'

import { parseTime } from '@/utils'
import selectTree from '../components/selectTree'
import richText from '../components/richText'
export default {
  name: 'Index',
  components: {
    richText,
    selectTree
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      title: '',
      content: '',
      nowTime: '',
      author: '',
      treeData: [],
      selectValue: [],
      echoedKeys: []
    }
  },
  computed: {
    authorName() {
      return JSON.parse(localStorage.getItem('account')).name
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  // deactivated() {
  //   this.resetData()
  //   console.log('deactivated', this.treeData)
  // },
  methods: {
    init() {
      queryAllLesson().then(res => {
        res.data.forEach(item => {
          item.sourceId = item.authorizationType
          item.sourceName = treeRange.setSourceName(item.authorizationType)
          treeRange.recursion(item, item.authorizationType)
        })
        this.treeData = res.data
      })
      const noticeId = this.$route.query.noticeId
      if (!noticeId) {
        this.nowTime = parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        queryIsNotification({ noticeId }).then(res => {
          if (res.data === 'PUBLISHED') {
            this.$message({
              message: '该通知已经发布过了，不能再次编辑',
              type: 'error'
            })
            this.$router.push({ name: 'newdaycare_cmNoticeManage' })
          } else {
            getNotification({ noticeId }).then(res => {
              // 回显id
              this.echoedKeys = res.data.dynamicReleaseScopeDTOList.map(item => item.courseIdStrList.map(id => `${item.teachOrCare}/${id}`)).flat()
              this.title = res.data.notificationTitle
              this.content = res.data.notificationContent
              this.nowTime = parseTime(res.data.createDateTime, '{y}-{m}-{d} {h}:{i}:{s}')
              this.author = res.data.sourceName
            })
          }
        })
      }
    },
    imageChange(event) {
      const file = this.$refs.file.files[0]
      if (file && file.type.includes('image')) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          uploadFile(file, 'daycare/cmNoticeManage/puclicNotification', 'image').then(async res => {
            const key = res.data.key
            const prefix = await getUploadFilePrefix()
            const imgUrl = prefix + key
            this.insertUrlEditor('image', imgUrl)
            event.target.value = null
          })
        }
      } else if (file && file.type.includes('video')) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          uploadFile(file, 'daycare/cmNoticeManage/puclicNotification', 'video').then(async res => {
            const key = res.data.key
            const prefix = await getUploadFilePrefix()
            const videoUrl = prefix + key
            const videoObj = {
              url: videoUrl,
              width: '100%',
              height: '140'
            }
            this.insertUrlEditor('video', videoObj)
            event.target.value = null
          })
        }
      }
    },
    insertUrlEditor(type, url) {
      const quill = this.$refs.richText.$refs.myQuillEditor.quill
      const length = quill.getSelection().index
      quill.insertEmbed(length, type, url)
    },
    submitNotification(type) {
      if (!this.title.trim() || !this.content.trim() || !this.selectValue.length) {
        this.$message({
          message: '标题、内容和发布范围不能为空',
          type: 'error'
        })
      } else {
        const types = ['TEACH', 'TODDLER', 'CARE']
        const authorizationDTOList = types.map(type => treeRange.getAuthorizationDTOList(type, this.selectValue))
        const obj = {
          notificationTitle: this.title,
          notificationContent: this.content,
          authorizationDTOList,
          postStatus: type
        }
        createNewNotification(obj).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.resetData()
          this.$router.push('/newdaycare/newdaycare_cmNoticeManage')
        })
      }
    },
    richTextChange(val) {
      this.content = val
    },
    resetData() {
      this.title = ''
      this.content = ''
      this.echoedKeys = []
      // this.selectValue = []
      this.treeData = []
      this.author = ''
      this.nowTime = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep.EtmLayoutSplit-wrap {
    margin-top: 16px;
    .layout-left {
      padding-bottom: 16px;
      min-width: 375px;
      max-width: 375px;
      height: calc(100vh - 128px);
    }
    .layout-right {
      position: relative;
      height: calc(100vh - 128px);
      .main-content {
        max-height: calc(100vh - 280px);
        overflow-y: auto;
        padding-bottom: 100px;
      }
      .EtmFormFoot-wrap {
        position: absolute;
        bottom: 16px;
        width: 100%;
        border-top: 1px solid #EEEEEE;
        .content {
          margin-left: 0!important;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .quill-editor {
    margin-bottom: 16px;
    ::v-deep.ql-toolbar.ql-snow {
      border: none;
      background: #EEF1F5;
    }
    ::v-deep.ql-toolbar.ql-snow + .ql-container.ql-snow {
      //height: 180px; // 富文本的编辑区自适应高度
      border: none;
    }
  }
  .editor-title {
    margin-bottom: 16px;
    ::v-deep.el-input__inner {
      font-weight: 700;
      border: none;
    }
  }
  .mockup {
    padding: 55px 20px 25px 15px;
    height: 100%;
    background: url("../../../../assets/images/daycare/mockup.png") no-repeat;
    background-size: 100% 100%;
    .box-wrap {
      padding: 0 14px;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      word-wrap:break-word;
      &::-webkit-scrollbar {display:none}
      .EtmTitle-wrap {
        padding-bottom: 0!important;
        font-weight: 700;
      }
      .time-and-author {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        //.author {
        //  margin-right: 10px;
        //}
      }
      .preview-content {
        ::v-deep img {
          width: 100%!important;
        }
      }
    }
  }

  ::v-deep.etm-main-body .content {
    margin: 0;
  }
}
</style>
