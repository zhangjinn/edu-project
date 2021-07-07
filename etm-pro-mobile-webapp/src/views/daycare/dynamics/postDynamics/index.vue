<template>
  <div class="postDynamics">
    <setting-title :no-setting="true" @backTo="backTo">
      <span class="menu">编辑</span>
    </setting-title>

    <div class="content">
      <div class="header">
        <div class="input">
          <van-field
            v-model="textContent"
            rows="4"
            type="textarea"
            class="field"
            placeholder="请输入发布内容..."
            maxlength="60"
            autosize
            show-word-limit
          />
        </div>

        <div class="upload">
          <!--          如果是上传图片使用uploader，如果是上传视频使用video v-if="uploadType === 'image'"-->
          <van-uploader
            v-if="uploadType === 'image'"
            v-model="fileInfoList"
            class="uploader"
            multiple="true"
            :after-read="afterRead"
            :preview-image="true"
            :max-count="30"
            @delete="deleteUpload"
          />

          <video
            v-if="uploadType === 'video' && fileInfoList"
            ref="video"
            width="150"
            height="150"
            class="video"
            poster
            :src="videoSrc"
            controls="controls"
          />
        </div>

        <div class="comment">
          <div class="comment-left">
            <span class="bigFont">发布课程</span>
          </div>
          <div class="comment-right basis" @click="showSelectPopup">
            <span v-if="classAuthLen <= 1 && classList[0].courseDTOList" class="smallFont">{{
              classList[0].courseDTOList[0].courseName
            }}</span>

            <span
              v-else-if="subSelectClassIdList.length <= 3"
              class="smallFont"
            >{{ selectText !== '' ? selectText : '请选择课程' }}</span>
            <span v-else class="smallFont">{{ `${ selectText }...` }}</span>
          </div>
        </div>

        <div class="comment">
          <div class="comment-left">
            <span class="bigFont">评论</span>
            <span class="smallFont">（关闭后，该动态只允许进行点赞操作）</span>
          </div>
          <div class="comment-right">
            <van-switch v-model="allowComments" active-color="#10C2C4" size="20px" />
          </div>
        </div>
      </div>
    </div>

    <!--    <van-image :src="imgSrc" />-->
    <div class="footerPostBtn">
      <control-btn
        class="postBtn"
        :class="{disabled:fileInfoList.length === 0}"
        :disabled="fileInfoList.length === 0"
        type="primary"
        text="发布"
        @click.native="postDynamics"
      />
    </div>

    <van-popup v-model="selectPopup" class="selectClass" position="bottom" :style="{height:'80%'}" @closed="cancel">
      <div class="header">
        <span>选择课程</span>
        <span @click="cancel">x</span>
      </div>

      <div class="content">
        <van-collapse v-model="selectClassName">
          <van-checkbox-group v-model="selectClassList">
            <van-collapse-item
              v-for="grade in classList"
              :key="grade.gradeName"
              :title="grade.gradeName"
              :name="grade.gradeName "
            >
              <template #title>
                <div>
                  {{ grade.gradeName }}
                </div>
              </template>
              <van-checkbox-group v-model="subSelectClassIdList">
                <div v-for="(subClazz) in grade.courseDTOList" :key="subClazz.courseId">
                  <van-checkbox
                    v-model="subClazz.subCheck"
                    :name="subClazz.courseId"
                    :checked-color="checkColor"
                    @click="selelctSimpleClass(subClazz,grade,subClazz.subCheck)"
                  >
                    {{ subClazz.courseName }}
                  </van-checkbox>
                </div>
              </van-checkbox-group>
            </van-collapse-item>
          </van-checkbox-group>
        </van-collapse>
      </div>

      <div class="footer">
        <div>
          <van-checkbox v-model="selectAllClass" class="selectAll" :checked-color="checkColor" @change="selectAll">
            全选（已选 {{ subSelectClassIdList.length }}）
          </van-checkbox>
        </div>
        <control-btn
          class="postBtn"
          type="primary"
          text="确定"
          @click.native="sureClass"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import ControlBtn from '@/components/common/controlBtn'
import { createDynamic, queryClassAuthInPost } from '@/service/daycare/dynamic'
import { uploadFile } from '@/service/upload'
import settingTitle from '../components/settingTitle'
import { Dialog, Toast } from 'vant'

export default {
  name: 'Index',
  components: {
    ControlBtn,
    settingTitle
  },
  data() {
    return {
      inputLen: 0, // 输入长度
      maxInputLen: 60, // 最大输入长度
      formList: {
        reason: null,
        accountType: [],
        img: []
      },
      disabled: true, // 按钮是否置灰不可用
      selectPopup: false, // 显示班级选择弹出层
      result: [], // 班级多选
      checked: false,
      textContent: '', // 文本内容
      allowComments: true, // 是否允许评论
      uploadType: 'image', // 上传类型
      fileInfoList: [], // 上传文件列表,里面是一个个的File对象
      uploadList: [], // 传给后台的uploadList
      selectClassName: ['1', '2'], // 选择的班级列表
      classList: [
        {
          gradeName: '早教'
        },
        {
          gradeName: '托育'
        }
      ], // 班级课程列表
      selectClassList: [], // 一级班级课程列表（年级）
      subSelectClassIdList: [], // 二级班级课程列表（班级）
      subSelectItemList: [],
      selectText: '',
      selectAllClass: false,
      hasAllUpload: false,
      checkColor: '#10C2C4',
      name: '',
      videoCover: '',
      classAuthLen: 0,
      maskOverlay: true
    }
  },
  computed: {
    videoSrc() {
      // console.log(this.fileInfoList, 'content')
      return this.fileInfoList[0].content || undefined
    }
  },
  mounted() {
    this.queryClassList()
    if (this.$route.params.file) {
      this.fileInfoList.push(this.$route.params.file)
      this.fileInfoList = this.fileInfoList.flat(Infinity)
      // console.log(this.fileInfoList, 'fileInfoList红红火火恍恍惚惚')
    }
    if (this.$route.params.type) {
      this.uploadType = this.$route.params.type
    }
  },
  methods: {
    // 截取video的封面
    createCover() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // const imgWidth = 180
      // const imgHeight = 120
      ctx.drawImage(this.$refs.video, 0, 0)
      // 将canvas截图的图片转成file对象，uploadFile只接受file对象
      const imgSrc = canvas.toDataURL('image/png')
      const file = this.base64ToFile(imgSrc, `videoCover${Math.random()}`)
      // 生成video的封面
      uploadFile(file, 'daycare/matterList/dynamics', 'image').then(res => {
        this.videoCover = res.data.key
      })
    },
    // 回退操作
    backTo() {
      if (this.textContent !== '' || this.fileInfoList.length !== 0) {
        Dialog.confirm({
          message: '你已填写了内容,确定要退出吗?',
          confirmButtonColor: '#10C2C4'
        }).then(() => {
          this.$router.back()
        }).catch(() => {
          console.log('您取消了操作')
        })
      } else {
        this.$router.back()
      }
    },
    // 全选操作
    selectAll() {
      for (const grade of this.classList) {
        // console.log(this.selectAllClass, 'class')
        for (const clazz of grade.courseDTOList) {
          // 是否选中了全选操作
          clazz.teachOrCare = grade.teachOrCare
          if (this.selectAllClass) {
            clazz.subCheck = true
            this.subSelectClassIdList.push(clazz.courseId)
            this.subSelectItemList.push(clazz)
            this.subSelectClassIdList = [...new Set(this.subSelectClassIdList)]
            this.subSelectItemList = [...new Set(this.subSelectItemList)]
          } else {
            clazz.subCheck = false
            this.subSelectClassIdList = []
            this.subSelectItemList = []
            this.selectText = ''
          }
        }
      }
    },
    // 选择单个课程
    selelctSimpleClass(subClazz, grade, subCheck) {
      subClazz.subCheck = !subCheck
      subClazz.teachOrCare = grade.teachOrCare
      if (subClazz.subCheck) {
        // console.log('选择单个课程')
        this.subSelectClassIdList.push(subClazz.courseId)
        this.subSelectItemList.push(subClazz)
        this.subSelectClassIdList = [...new Set(this.subSelectClassIdList)]
        this.subSelectItemList = [...new Set(this.subSelectItemList)]
        // console.log(this.subSelectClassIdList, '新增')
      } else {
        this.subSelectClassIdList.forEach((item, index) => {
          if (item === subClazz.id) {
            console.log(this.selectText, 'select')
            this.subSelectClassIdList.splice(index, 1)
            this.subSelectItemList.splice(index, 1)
            this.subSelectClassIdList = [...new Set(this.subSelectClassIdList)]
            this.subSelectItemList = [...new Set(this.subSelectItemList)]
            this.selectText = ''
          }

          if (this.subSelectClassIdList.length === 0) {
            this.selectAllClass = false
          }
        })
      }
    },
    // 确认选中班级
    sureClass() {
      this.selectPopup = false
      this.selectText = ''
      this.subSelectItemList.forEach((item) => {
        this.subSelectClassIdList.forEach(id => {
          if (id === item.courseId) {
            this.selectText += `${item.courseName}、`
            // 去重操作
            const text = [...new Set(this.selectText.split('、'))].splice(0, 3)
            this.selectText = text
          }
        })
      })
      this.selectText = [...new Set(this.selectText[0].split(','))].splice(0, 3).join('、')
      this.subSelectClassIdList = [...new Set(this.subSelectClassIdList)]
      this.subSelectItemList = [...new Set(this.subSelectItemList)]
      // console.log(this.selectText, 'selectText')
      // console.log(this.subSelectClassIdList, '我是sub')
      // console.log(this.subSelectItemList, '我是item')
    },
    // 查询班级列表
    RecursionClass(classList) {
      classList.forEach((grade) => {
        grade.check = false

        if (grade.courseDTOList) {
          grade.courseDTOList.forEach(clazz => {
            // 将年级的id赋值给每个属于该班级中 方便判断
            // clazz.parentId = grade.id
            // 当年级被选中的时候,所有的班级都被选中
            // clazz.parentCheck = grade.check
            // 初始化班级是否选中 默认为false
            clazz.subCheck = false
          })
        }
      })
    },
    // 显示选择班级弹出层
    showSelectPopup() {
      if (this.classAuthLen <= 1) {
        return
      }
      this.selectPopup = true
      this.queryClassList()
    },
    async queryClassList() {
      const params = {}
      await queryClassAuthInPost(params).then(res => {
        // console.log(res.data.data)
        const content = res.data.data
        this.classAuthLen = content.length
        for (const grade of content) {
          if (grade.teachOrCare === 'TEACH') {
            Object.assign(this.classList[0], content[0])
          } else {
            Object.assign(this.classList[1], content[1])
          }
        }
        this.RecursionClass(this.classList)
      })
    },
    // 删除选中班级
    cancel() {
      this.selectPopup = false
    },
    // 发布动态请求函数
    createDyn() {
      // this.maskOverlay = true
      const dynamicReleaseScopeDTOList = [
        {
          teachOrCare: 'TEACH',
          courseIdList: []
        },
        {
          teachOrCare: 'CARE',
          courseIdList: []
        }
      ]
      const params = {}
      for (const subSelectItem of this.subSelectItemList) {
        if (subSelectItem.teachOrCare === dynamicReleaseScopeDTOList[0].teachOrCare) {
          dynamicReleaseScopeDTOList[0].courseIdList.push(subSelectItem.courseId)
        } else {
          dynamicReleaseScopeDTOList[1].courseIdList.push(subSelectItem.courseId)
        }
      }
      if (dynamicReleaseScopeDTOList[0].courseIdList.length === 0 && dynamicReleaseScopeDTOList[1].courseIdList.length === 0) {
        Toast.fail({
          message: '请选择想发布的课程~',
          duration: 1000
        })
        return
      }
      params.content = this.textContent
      params.canComment = (this.allowComments ? 'COMMENTABLE' : 'NOT_COMMENTABLE')
      // 上传图片列表
      params.urlList = this.uploadList
      // 发布范围
      params.dynamicReleaseScopeDTOList = dynamicReleaseScopeDTOList
      params.dynamicType = this.uploadType.toUpperCase()
      params.dynamicCover = this.videoCover
      // console.log(params, 'params')
      createDynamic(params).then(() => {
        this.hasAllUpload = true
        // this.maskOverlay = false
        Toast.success({
          message: '发布成功',
          forbidClick: true
        })
        setTimeout(() => {
          this.$router.push('/daycare_clazzPost')
        }, 200)
      })
    },

    // 将base64转换为文件对象
    base64ToFile(urlData, fileName) {
      const arr = urlData.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bytes = atob(arr[1]) // 解码base64
      let n = bytes.length
      const ia = new Uint8Array(n)
      while (n--) {
        ia[n] = bytes.charCodeAt(n)
      }
      return new File([ia], fileName, { type: mime })
    },
    // 点击发布触发方法
    async postDynamics() {
      if (this.fileInfoList.length === 0) {
        Toast.fail({
          message: '请填写图片或者视频内容'
        })
        return
      }
      setTimeout(() => {
        Toast.loading({
          message: '上传中',
          duration: 0
        })
      }, 500)
      this.upload(this.fileInfoList).then(res => {
        Toast.clear()
      })
    },
    // 上传文件到七牛云
    async upload(fileInfoList) {
      // 因为上传视频的时候会长时间，所以给个loading加载防止用户以为上传失败
      // 判断如果上传类型是video的话创建一个video的封面
      if (this.uploadType === 'video') {
        await this.createCover()
      }
      // 上传file数组上七牛云
      if (fileInfoList instanceof Array) {
        fileInfoList.map(async(item, index) => {
          await uploadFile(item.file, 'daycare/matterList/dynamics', this.uploadType).then((res) => {
            // 获取到的key值作为url,type上传类型,有封面上传封面
            const obj = {}
            obj.url = res.data.key
            obj.name = this.name
            // obj.dynamicCover = this.videoCover
            this.uploadList.push(obj)
            // Toast.loading({
            //   message: '12321s11111111111111111111111111',
            //   duration: 10000
            // })
            if (index >= this.fileInfoList.length - 1) {
              // console.log('2222222222222')
              // 等待uploadFile完全
              setTimeout(() => {
                this.createDyn()
              }, 2000)
            }
          })
        })
      }
    },

    // 使用vant的uploader读取文件后的操作
    afterRead() {
      this.disabled = false
    },
    // 删除文件后的操作
    deleteUpload(file) {
      if (this.fileInfoList.length === 0) {
        this.disabled = true
      }
      if (this.fileInfoList.indexOf(file) !== -1) {
        this.fileInfoList.splice(this.fileInfoList.indexOf(file), 1)
      }
    },
    removeField(file) {
      if (this.fileInfoList.indexOf(file) !== -1) {
        this.fileInfoList.splice(this.fileInfoList.indexOf(file), 1)
      }
    }
  }

}
</script>

<style scoped lang="scss">
.postDynamics {
  background: white !important;
  height: 100%;
}

.menu {
  background: $theme;
  height: 34px;

  span {
    color: white !important;
    line-height: 34px;
  }
}

.content {
  background: white;
  overflow: scroll;
  height: 80%;

  .upload {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    padding: 10px;

    .video {
      //width: 150px;
      //height: 150px;
    }

  }

  .comment {
    box-sizing: border-box;
    font-size: x-small;
    justify-content: space-between;
    padding: 10px;
    display: flex;

    .comment-left {
      align-self: center;
      //flex-basis: 45%;
      .bigFont {
        color: #222222;
        line-height: 12px;
        font-size: 15px;
      }

      .smallFont {
        font-size: 12px;
        color: #999999;
        line-height: 12px;
      }
    }

    .basis {
      flex-basis: 65%;
      text-align: right;

    }

    .comment-right {
      padding-right: 5px;

      .group {
        display: flex;

        .box {
          margin-right: 7px;
        }
      }

      .smallFont {
        margin-right: 3px;
        font-size: 12px;
        color: #999999;
        line-height: 12px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }

  .middle {
    border: none;
    //background: white;
  }
}

// 底部按钮
.footerPostBtn {
  width: 100%;
  background: white;
  position: absolute;
  left: 0;
  bottom: 0%;

  .postBtn {
    width: 95%;
    margin: 0 auto;
    padding: 10px 0;
  }

  .disable {
    filter: grayscale(100%);
  }
}

//上传图片
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

// 输入框样式
.input {
  position: relative;

  .van-cell::after {
    border: none !important;
  }

  .right-limit {
    position: absolute;
    display: inline-block;
    bottom: 1px;
    right: 14px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
  }
}

// 选择班级popup
.selectClass {
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    margin: 7px;

    span:first-child {
      margin: 8px;
      color: #222222;
      font-size: 16px;
    }

    span:last-child {
      margin: 8px;
      color: #BBBBBB;
      font-size: 15px;
      display: flex;
      align-items: flex-start;
    }
  }

  .content {
    height: 70%;
    overflow: scroll;

    /deep/ .van-checkbox__label {
      width: 100% !important;
      margin-left: 0 !important;
      border-radius: 2px;
      text-align: left;
      padding-left: 10px;
      font-size: 14px;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .postBtn {
      width: 95%;
      margin: 0 auto;
      padding: 10px 0;
    }

    .selectAll {
      padding: 0 10px;
    }
  }

  /deep/ .van-checkbox__icon {
    margin: 5px
  }

  /deep/ .van-collapse-item__title {
    border-radius: 4px;
    //background: #F5F5F5;
  }

}
</style>

