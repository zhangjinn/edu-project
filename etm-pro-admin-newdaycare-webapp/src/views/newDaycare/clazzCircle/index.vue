<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            setting
            setting-text="家长端设置"
            @setting="$router.push({name: 'cm_setting'})"
          >
            <el-tab-pane
              label="家园动态"
              name="dynamic"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
                @reset="handleReset"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  type="primary"
                  @click="addDynamic"
                >
                  发布动态
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              prop="orderNo"
              label="操作"
              fixed="right"
              min-width="120"
            >
              <template slot-scope="scope">
                <etm-text
                  type="primary"
                  @click="preview(scope.row.dynamicId)"
                >
                  预览
                </etm-text>
                <etm-text
                  type="danger"
                  @click="deleteDynamic(scope.row.dynamicId)"
                >
                  删除
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>

        <!--预览-->
        <etm-drawer
          :visible.sync="showSide"
        >
          <etm-layout-split>
            <etm-title
              size="big"
              :show-line="true"
              border
            >
              预览
            </etm-title>
            <div
              v-if="Object.keys(dynamicPreviewData).length !== 0"
              class="preview-box"
            >
              <div class="content">
                <div class="top-txt">
                  1/{{ dynamicPreviewData.urlList.length }}
                </div>
                <div class="middle-content">
                  <!--                  <el-image-->
                  <!--                    v-if="dynamicPreviewData.dynamicType === 'IMAGE'"-->
                  <!--                    :src="dynamicPreviewData.urlList[0].url"-->
                  <!--                    fit="contain"-->
                  <!--                  />-->
                  <img
                    v-if="dynamicPreviewData.dynamicType === 'IMAGE'"
                    :src="dynamicPreviewData.urlList[0].url"
                    alt=""
                  >
                  <video
                    v-else-if="dynamicPreviewData.dynamicType === 'VIDEO'"
                    :src="dynamicPreviewData.urlList[0].url"
                  />
                </div>
                <div class="bottom-txt">
                  <div class="avatar-name">
                    <el-avatar
                      size="small"
                      :src="dynamicPreviewData.createAvatar"
                    />
                    <div class="name">
                      {{ dynamicPreviewData.createName }}
                    </div>
                  </div>
                  <div class="content-txt">
                    {{ dynamicPreviewData.content }}
                  </div>
                </div>
              </div>
            </div>
          </etm-layout-split>
        </etm-drawer>
        <!--发布动态-->
        <etm-pop
          :visible="showPop"
          pop="complex"
          title="发布动态"
          confirm-btn="发布"
          cancel-btn="取消"
          :append-to-body="false"
          @close="popClose"
          @confirm="popConfirm"
          @cancel="popCancel"
        >
          <etm-form
            v-if="showPop"
            type="dialog"
          >
            <el-form-item label="发布内容">
              <el-input
                v-model="dynamicValue"
                v-in-focus
                type="textarea"
                placeholder="请输入动态内容"
              />
            </el-form-item>
            <el-form-item label="图片/视频">
              <el-radio-group v-model="radio">
                <el-radio label="image">
                  图片
                </el-radio>
                <el-radio label="video">
                  视频
                </el-radio>
              </el-radio-group>
              <div class="upload-img-video">
                <div class="flex-box">
                  <template v-if="radio === 'image'">
                    <div
                      v-for="(imgUrl, index) in imgUrls"
                      :key="index"
                      class="preview"
                    >
                      <img
                        :src="imgUrl"
                        alt=""
                      >
                      <i
                        class="el-icon-close"
                        @click="removeImage(index)"
                      />
                    </div>
                    <div
                      v-if="imgUrls.length < 30"
                      class="box-upload"
                      @click="chooseImageOrVideo"
                    >
                      <i class="el-icon-plus" />
                    </div>
                  </template>
                  <template v-if="radio === 'video'">
                    <div
                      v-if="videoUrl"
                      class="preview"
                    >
                      <video :src="videoUrl" />
                      <div class="overplay" />
                      <i class="el-icon-video-camera" />
                      <i
                        class="el-icon-close"
                        @click="removeVideo"
                      />
                    </div>
                    <div
                      v-else
                      class="box-upload"
                      @click="chooseImageOrVideo"
                    >
                      <i class="el-icon-plus" />
                    </div>
                  </template>
                </div>
                <span
                  v-if="radio==='image'"
                  class="tip-txt"
                >图片最多上传30张</span>
                <span
                  v-if="radio==='video'"
                  class="tip-txt"
                >视频最多上传1个</span>
              </div>
              <input
                ref="imageRef"
                type="file"
                multiple
                accept="image/*"
                style="display: none;"
                @change="chooseImage"
              >
              <input
                ref="videoRef"
                type="file"
                accept="video/*"
                style="display: none;"
                @change="chooseVideo"
              >
            </el-form-item>
            <el-form-item label="发布范围">
              <select-tree
                v-model="selectValue"
                :tree-data="treeData"
                :props="{
                  label: 'sourceName',
                  children: 'scopeOfAuthorizationList'
                }"
                width="300"
                clearable
                show-parent
                node-key="sourceId"
                placeholder="请选择发布范围"
              />
            </el-form-item>
          </etm-form>
        </etm-pop>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/5 9:39
 */
import { queryDynamicList, removeDynamic, queryAllLesson, createDynamic, queryPreviewDynamic } from '@/api/newDaycare/clazzCircle'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import selectTree from '@/views/newDaycare/cmNoticeManage/components/selectTree'
import treeRange from '@/views/newDaycare/cmNoticeManage/utils'
import { uploadFile } from '@/api/base'

export default {
  name: 'Index',
  components: {
    selectTree
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'dynamic',
      formData: [
        {
          type: 'input',
          label: '发布内容',
          value: '',
          prop: 'content',
          props: {
            placeholder: '请输入发布内容'
          }
        },
        {
          type: 'input',
          label: '发布人',
          value: '',
          prop: 'createName',
          props: {
            placeholder: '请输入发布人姓名'
          }
        }
      ],
      columns: [
        {
          label: '发布内容',
          prop: 'content'
        },
        {
          label: '发布范围',
          prop: 'releaseScope'
        },
        {
          label: '发布人',
          prop: 'createName'
        },
        {
          label: '发布时间',
          prop: 'createTime',
          sortable: true,
          sortBy: 'createTime'
        }
      ],
      tableData: {
        content: []
      },
      showSide: false,
      showPop: false,
      dynamicValue: '',
      treeData: [],
      selectValue: [],
      echoedKeys: [],
      radio: 'image',
      imgFiles: [],
      imgUrls: [],
      videoUrl: '',
      videoFile: '',
      dynamicPreviewData: {}
    }
  },
  computed: {},
  watch: {
    radio (newVal, oldVal) {
      if (newVal === 'video') {
        this.chooseVideo()
      }
      if (newVal === 'image') {
        this.imgFileToBlobUrl(this.imgFiles)
      }
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init (search = {}) {
      const result = Object.assign({}, search, this.pageInfo)
      queryDynamicList(result).then(res => {
        res.data.content.forEach(item => {
          item.createTime = parseTime(item.createTime, '')
        })
        this.tableData = res.data
      })
    },
    handleSearch () {
      const search = {
        content: this.getObjectByProp('content', this.formData).value,
        createName: this.getObjectByProp('createName', this.formData).value
      }
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.init(search)
    },
    handleReset () {
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
    },
    currentChange (pageNum, pageSize) {
      const search = {
        content: this.getObjectByProp('content', this.formData).value,
        createName: this.getObjectByProp('createName', this.formData).value
      }
      this.pageInfo = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      this.init(search)
    },
    addDynamic () {
      queryAllLesson().then(res => {
        res.data.forEach(item => {
          item.sourceId = item.authorizationType
          item.sourceName = treeRange.setSourceName(item.authorizationType)
          treeRange.recursion(item, item.authorizationType)
        })
        this.treeData = res.data
        this.showPop = true
      })
    },
    preview (dynamicId) {
      queryPreviewDynamic({ dynamicId }).then(res => {
        if (!res.data.createAvatar) {
          res.data.createAvatar = require('@/assets/images/moren.png')
        }
        this.dynamicPreviewData = res.data
        this.showSide = true
      })
    },
    deleteDynamic (dynamicId) {
      this.$etmTip.init({
        title: '确认删除动态？',
        content: '删除后，员工、家长将无法查看该条动态',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          removeDynamic({ dynamicId }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
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
    popClose () {
      this.resetData()
      this.showPop = false
    },
    resetData () {
      this.dynamicValue = ''
      this.treeData = []
      this.radio = 'image'
      this.imgFiles = []
      this.imgUrls = []
      this.videoUrl = ''
    },
    popConfirm () {
      if (!this.dynamicValue || !this.selectValue.length) {
        return this.$message({
          message: '发布内容、范围不能为空',
          type: 'error'
        })
      }
      if ((this.radio === 'image' && !this.imgFiles.length) || (this.radio === 'video' && !this.videoUrl)) {
        return this.$message({
          message: '至少选择一张图片或视频',
          type: 'error'
        })
      }
      // this.showPop = false
      const urlList = []
      if (this.radio === 'image') {
        this.imgFiles.forEach(file => {
          uploadFile(file, 'daycare/clazzCircle/dynamicImage', 'image').then(res => {
            urlList.push({
              name: file.name,
              url: res.data.key
            })
            if (urlList.length >= this.imgFiles.length) {
              this.requestFun(urlList)
            }
          })
        })
      } else if (this.radio === 'video') {
        const file = this.videoFile
        uploadFile(file, 'daycare/clazzCircle/dynamicImage', 'video').then(res => {
          urlList.push({
            name: file.name,
            url: res.data.key
          })
          this.requestFun(urlList)
        })
      }
    },
    requestFun (urlList) {
      const types = ['TEACH', 'TODDLER', 'CARE']
      const dynamicReleaseScopeDTOList = types.map(type => treeRange.getAuthorizationDTOList(type, this.selectValue, 'dynamic'))
      const requestParams = {
        content: this.dynamicValue,
        dynamicType: this.radio.toUpperCase(),
        urlList: urlList,
        dynamicReleaseScopeDTOList
      }
      createDynamic(requestParams).then(res => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.showPop = false
        this.init()
      })
    },
    popCancel () {
      this.resetData()
      this.showPop = false
    },
    chooseImageOrVideo () {
      if (this.radio === 'image') {
        this.$refs.imageRef.click()
      } else {
        this.$refs.videoRef.click()
      }
    },
    chooseImage (event) {
      // this.imgFiles = this.$refs.imageRef.files
      this.$refs.imageRef.files.forEach(file => {
        this.imgFiles.push(file)
      })
      if (this.imgFiles.length > 30) {
        this.imgFiles = this.imgFiles.splice(0, 30)
      }
      this.imgFileToBlobUrl(this.imgFiles)
      event.target.value = null
    },
    imgFileToBlobUrl (obj) {
      this.imgUrls = []
      obj.forEach(file => {
        if (file && file.type.includes('image')) {
          const imgUrl = URL.createObjectURL(file)
          this.imgUrls.push(imgUrl)
        }
      })
    },
    chooseVideo (event) {
      const file = this.$refs.videoRef.files[0]
      this.videoFile = file
      if (file && file.type.includes('video')) {
        const videoUrl = URL.createObjectURL(file)
        this.videoUrl = videoUrl
      }
      if (event) {
        event.target.value = null
      }
    },
    removeImage (ind) {
      this.imgFiles.splice(ind, 1)
      this.imgFileToBlobUrl(this.imgFiles)
    },
    removeVideo () {
      this.videoUrl = ''
      this.videoFile = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep.layout-default {
    display: flex;
    flex-direction: column;

    .preview-box {
      background: url('../../../assets/images/daycare/dynamic-preview.png') no-repeat center;
      display: flex;
      flex: 1;
      justify-content: center;

      .content {
        align-self: center;
        //background: #f00;
        color: #fff;
        display: flex;
        flex-direction: column;
        height: 604px;
        justify-content: space-between;
        padding: 30px 0 47px;
        width: 332px;

        .top-txt {
          align-self: center;
          font-size: 14px;
        }

        .middle-content {
          //height: 167px;
          background: #fff;
          margin: 0 auto;
          max-height: 400px;
          width: 312px;
          //.el-image {
          //  width: 100%;
          //  height: 100%;
          //}
          img {
            height: 100%;
            max-height: 100%;
            width: 100%;
            //object-fit: contain;
          }

          video {
            height: 100%;
            width: 100%;
          }
        }

        .bottom-txt {
          padding: 0 24px;

          .avatar-name {
            display: flex;

            ::v-deep.el-avatar--small {
              height: 32px;
              width: 32px;
            }

            .name {
              line-height: 32px;
              margin-left: 10px;
            }
          }

          .content-txt {
            /*box-orient: vertical;*/
            color: #ddd;
            /*display: box;*/
            font-size: 14px;
            font-weight: 400;
            -webkit-line-clamp: 2;
            line-height: 22px;
            margin-top: 17px;
            overflow: hidden;
            overflow-wrap: break-word;
            text-overflow: ellipsis;
            word-break: break-all;
          }
        }
      }
    }

    .upload-img-video {
      .flex-box {
        display: flex;
        flex-wrap: wrap;

        .preview {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          display: inline-block;
          height: 80px;
          line-height: 80px;
          margin: 0 16px 16px 0;
          position: relative;
          text-align: center;
          width: 80px !important;

          &:hover {
            //background: #000;
            .el-icon-close {
              display: block;
            }
          }

          .el-icon-close {
            display: none;
            font-size: 16px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;

            &:hover {
              cursor: pointer;
            }
          }

          img {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }

          video {
            height: 100%;
            width: 100%;
          }

          .el-icon-video-camera {
            color: #fff;
            font-size: 24px;
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
          }

          .overplay {
            background: rgba(0, 0, 0, 0.3);
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 1;
          }
        }

        .box-upload {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          display: inline-block;
          height: 80px;
          line-height: 80px;
          text-align: center;
          width: 80px !important;

          .el-icon-plus {
            font-size: 24px;
          }
        }
      }

      .tip-txt {
        //position: absolute;
        //bottom: 0;
        //margin-left: 10px;
        color: #999;
        font-size: 14px;
      }
    }

    .el-textarea__inner {
      max-height: 150px;
    }
  }
}
</style>
