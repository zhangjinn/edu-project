<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="left" class="mockup">
          <div class="box-wrap">
            <etm-title :show-line="false">{{ previewData.notificationTitle }}</etm-title>
            <div class="time-and-author">
              <span class="time">{{ previewData.createDateTime }}</span>
              <span class="author">来源：{{ previewData.sourceName || AuthorName }}</span>
            </div>
            <div class="preview-content" v-html="previewData.notificationContent" />
          </div>
        </div>
        <div slot="right">
          <div class="editor-title">
            <el-input
              v-model="previewData.notificationTitle"
              placeholder="请输入标题"
              size="medium"
              maxlength="30"
              show-word-limit
            />
          </div>
          <rich-text
            ref="richText"
            :content="previewData.notificationContent"
            @richTextChange="richTextChange"
          />
          <etm-form type="dialog">
            <el-form-item label="发布范围">
              <select-tree
                :tree-data="treeData"
                :default-checked-keys="defaultCheckedKeys"
                placeholder="请选择发布范围"
                @value-change="valueChange"
              />
            </el-form-item>
          </etm-form>
          <etm-form-foot save-btn="发布" cancel-btn="保存" @save="publicNotification" @cancel="saveNotification" />
          <input ref="file" class="file-image" style="display: none" accept="image/*,video/*" type="file" @change="imageChange">
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/3 10:12
 */
import { uploadFile, getUploadFilePrefix } from '@/api/base'
import { queryAllLesson, getNotification, updateNotificationEdit, queryIsNotification } from '@/api/newDaycare/cmNoticeManage'

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
      imageUrl: '',
      treeDataTmp: [
        {
          id: 'all',
          label: '全部课程',
          children: [
            {
              id: 'daycare',
              label: '早托课程',
              children: []
            },
            {
              id: 'guardcare',
              label: '托育班级',
              children: []
            }
          ]
        }
      ],
      treeData: [],
      defaultCheckedKeys: [],
      choose: '',
      previewData: {},
      selectValue: []
    }
  },
  computed: {
    AuthorName() {
      return JSON.parse(localStorage.getItem('account')).name
    }
  },
  watch: {
    $route(to) {
      if (to.path.includes('daycare_editNotification')) {
        this.init()
      }
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const noticeId = this.$route.query.noticeId
      if (noticeId) {
        queryIsNotification({ noticeId }).then(res => {
          if (res.data === 'PUBLISHED') {
            this.$message({
              message: '该通知已经发布过了，不能再次编辑',
              type: 'error'
            })
            this.$router.push('/newdaycare_listFamlily/newdaycare_cmNoticeManage')
          } else {
            queryAllLesson().then(res => {
              if (res.message === '成功') {
                this.treeDataTmp[0].children[0].children = []
                this.treeDataTmp[0].children[1].children = []
                res.data.forEach(item => {
                  if (item.teachOrCare === 'TEACH') {
                    item.courseDTOList.forEach(course => {
                      this.treeDataTmp[0].children[0].children.push({
                        id: 'TEACH-' + course.courseId,
                        label: course.courseName,
                        parent: '早教课程'
                      })
                    })
                  } else {
                    item.courseDTOList.forEach(course => {
                      this.treeDataTmp[0].children[1].children.push({
                        id: 'CARE-' + course.courseId,
                        label: course.courseName,
                        parent: '托育班级'
                      })
                    })
                  }
                })
                this.treeData = this.treeDataTmp

                const noticeId = this.$route.query.noticeId
                getNotification({ noticeId }).then(res => {
                  this.defaultCheckedKeys = []
                  if (res.message === '成功') {
                    res.data.createDateTime = parseTime(res.data.createDateTime, '')
                    this.previewData = res.data
                    res.data.dynamicReleaseScopeDTOList.forEach(item => {
                      item.courseIdList.forEach(course => {
                        this.defaultCheckedKeys.push(item.teachOrCare + '-' + course)
                      })
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        this.$message({
          message: '通知id不能为空',
          type: 'error'
        })
        this.$router.push('/newdaycare_listFamlily/newdaycare_cmNoticeManage')
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
    checkBox(value, obj) {
      this.choose = obj.checkedNodes.reduce((prevVal, nextVal) => {
        if (!nextVal.children) {
          return prevVal + nextVal.label + '/'
        } else {
          return prevVal
        }
      }, '')
      this.choose = this.choose.replace(/\/$/, '')
    },
    saveNotification() {
      const obj = {
        title: this.previewData.notificationTitle.trim(),
        content: this.previewData.notificationContent.trim()
      }
      if (!obj.title) {
        this.$message({
          message: '标题不能为空',
          type: 'error'
        })
      } else if (!obj.content) {
        this.$message({
          message: '内容不能为空',
          type: 'error'
        })
      } else if (this.selectValue.TEACH.length === 0 && this.selectValue.CARE.length === 0) {
        this.$message({
          message: '发布范围不能为空',
          type: 'error'
        })
      } else {
        const noticeId = this.$route.query.noticeId
        const obj = {
          noticeId,
          notificationTitle: this.previewData.notificationTitle,
          notificationContent: this.previewData.notificationContent,
          dynamicReleaseScopeDTOList: this.choose,
          postStatus: 'UNPUBLISHED'
        }
        updateNotificationEdit(obj).then(res => {
          if (res.message === '成功') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.push('/newdaycare_listFamlily/newdaycare_cmNoticeManage')
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            })
          }
        })
      }
    },
    publicNotification() {
      const obj = {
        title: this.previewData.notificationTitle.trim(),
        content: this.previewData.notificationContent.trim()
      }
      if (!obj.title) {
        this.$message({
          message: '标题不能为空',
          type: 'error'
        })
      } else if (!obj.content) {
        this.$message({
          message: '内容不能为空',
          type: 'error'
        })
      } else if (this.selectValue.TEACH.length === 0 && this.selectValue.CARE.length === 0) {
        this.$message({
          message: '发布范围不能为空',
          type: 'error'
        })
      } else {
        const noticeId = this.$route.query.noticeId
        const obj = {
          noticeId,
          notificationTitle: this.previewData.notificationTitle,
          notificationContent: this.previewData.notificationContent,
          dynamicReleaseScopeDTOList: this.choose,
          postStatus: 'PUBLISHED'
        }
        updateNotificationEdit(obj).then(res => {
          if (res.message === '成功') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.push('/newdaycare_listFamlily/newdaycare_cmNoticeManage')
          } else {
            this.$message({
              message: '发布失败',
              type: 'error'
            })
          }
        })
      }
    },
    valueChange(val) {
      this.selectValue = val
      const care = val.CARE.map(item => {
        return item.split('-')[1]
      })
      const teach = val.TEACH.map(item => {
        return item.split('-')[1]
      })
      this.choose = [
        {
          teachOrCare: 'TEACH',
          courseIdList: teach
        },
        {
          teachOrCare: 'CARE',
          courseIdList: care
        }
      ]
    },
    richTextChange(val) {
      this.previewData.notificationContent = val
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  /deep/.EtmLayoutSplit-wrap {
    margin-top: 16px;
    .layout-left {
      min-width: 375px;
      max-width: 375px;
      height: 625px;
    }
    .layout-right {
      height: 625px;
    }
  }
  .quill-editor {
    margin-bottom: 16px;
    /deep/.ql-toolbar.ql-snow {
      border: none;
      background: #EEF1F5;
    }
    /deep/.ql-toolbar.ql-snow + .ql-container.ql-snow {
      //height: 180px; // 富文本的编辑区自适应高度
      border: none;
    }
  }
  .editor-title {
    margin-bottom: 16px;
    /deep/.el-input__inner {
      font-weight: 700;
      border: none;
    }
  }
  .mockup {
    padding: 55px 20px 25px 15px;
    height: 100%;
    background: url("~@/assets/images/daycare/mockup.png") no-repeat;
    background-size: 100% auto;
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
        /deep/img {
          width: 100%!important;
        }
      }
    }
  }

  /deep/.etm-main-body .content {
    margin: 0;
  }
}
</style>
