<template>
  <div class="dynamics">

    <div class="classRoom">
      <setting-title class="setting" no-setting @backTo="$router.push('/workBench')">
        <span>动态</span>
      </setting-title>
      <span
        ref="spanTimeRef"
        class="triangle_down"
        @click="clickBtn"
      >{{ classRoom }}</span>
    </div>
    <div>
      <van-popup v-model="showClassRoom" position="bottom" @open="openPopup" @close="closePopup">
        <van-picker
          v-model="showClassRoom"
          show-toolbar
          title="课程/班级"
          :default-index="0"
          :columns="classNameList"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </div>
    <vue-waterfall-easy
      v-if="imgsArr.length !== 0"
      ref="content"
      class="content"
      :imgs-arr="imgsArr"
      :mobile-gap="12"
      :width="120"
      :loading-dot-style="{color:'#10C2C4'}"
      :loading-dot-count="0"
      card-animation-class=""
      @scrollReachBottom="loadmore"
      @click="toDetail"
    >
      <div slot-scope="props">
        <div v-if="props.value.type === 'VIDEO'" slot="waterfall-head" class="desc-header">
          <span class="iconfont iconbofang" />
        </div>
        <div class="desc">
          {{ props.value.content }}
        </div>
        <div class="info">
          <div class="item">
            <van-image :src="likeIcon" width="16px" height="16px" />
            <span>{{ props.value.createName }}</span>
          </div>
          <div class="item">
            <span class="iconfont iconlike" />
            <span>{{ props.value.count }}</span>
          </div>
        </div>

      </div>
      <div slot="waterfall-over">已经没有更多了</div>
    </vue-waterfall-easy>

    <div v-else class="noDynamics">
      <van-image :src="noDynamics" />
      <span>暂无动态信息</span>
    </div>

    <add-drag size="normal" @postDynamic="postDynamic" />
    <van-overlay :show="show" class-name="overlay">
      <div class="postType">
        <div class="postTypeItem">
          <van-uploader ref="album" v-model="fileList" :after-read="afterRead" multiple>
            <van-image class="icon" :src="albumIconSrc" @click="showAlbum('image')" />
            <span>相册</span>
          </van-uploader>
        </div>
        <div class="postTypeItem">
          <van-uploader
            ref="camera"
            v-model="fileList"
            accept="video/*"
            capture="camera"
            :after-read="afterRead"
            :preview-image="true"
          >
            <van-image class="icon" :src="shotIconSrc" @click="showCamera('video')" />
            <span>拍摄</span>
          </van-uploader>
        </div>
      </div>
      <div class="cancel" @click="cancelPostDynamic">
        <span class="iconfont iconout" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import addDrag from './components/drag'
import { queryClassAuth, queryDynamic } from '@/service/daycare/dynamic'
import vueWaterfallEasy from 'vue-waterfall-easy'
import SettingTitle from './components/settingTitle'
// import settingTitle from './components/settingTitle'
export default {
  name: 'Index',
  components: {
    SettingTitle,
    addDrag,
    vueWaterfallEasy
    // settingTitle
  },
  filters: {
    filterLikeNumber(value) {
      if (value > 9999) {
        return value / 10000 + '万'
      } else {
        return value
      }
    }
  },
  data() {
    return {
      blur: false,
      albumIconSrc: require('@/assets/images/guardcare/album.png'),
      shotIconSrc: require('@/assets/images/guardcare/shot.png'),
      show: false,
      classNameList: [], // 班级名字列表
      classIdList: [], // 班级id列表
      showClassRoom: false,
      isToggle: false,
      classRoom: '课程',
      classRoomItem: null,
      classList: [],
      addIcon: require('@/assets/images/daycare/ADD.png'),
      likeIcon: require('@/assets/images/defaultAvatar.png'),
      dynamicsContent: [],
      pageSize: 10,
      pageNum: 1,
      claszzId: 1,
      list: [],
      loading: true,
      fileList: [],
      imgsArr: [],
      uploadType: '',
      noDynamics: require('@/assets/images/daycare/noDynamics.png')
    }
  },
  computed: {
    itemWidth() {
      return (138 * 1.35 * (document.documentElement.clientWidth / 375))
    },
    gutterWidth() {
      return (9 * 0.25 * (document.documentElement.clientWidth / 375))
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.classAuth()
      this.getDynamicsList()
    },
    // 查询用户对应的课程班级列表
    async classAuth() {
      const params = {}
      await queryClassAuth(params).then(res => {
        this.classList = res.data.data
        // console.log(this.classList, 'cotnent')
        for (const clazz of this.classList) {
          // 将负责的班级名字插入
          this.classNameList.push(clazz.courseName)
          // 将负责的班级id插入
          this.classIdList.push(clazz.courseId)
          // 首先取第一个id作为查询
          this.classRoomItem = this.classList[0]
          this.classRoom = this.classNameList[0]
        }
        // console.log(this.classRoomId)
        // console.log(res.data.data, 'res')
        // console.log(this.classNameList, 'name')
        // console.log(this.classIdList, 'id')
      })
      // this.classList = this.classList.flat(Infinity)
    },
    // 显示相册uploader
    showAlbum(type) {
      this.uploadType = type
      this.$refs.album.chooseFile()
    },
    showCamera(type) {
      this.uploadType = type
      this.$refs.camera.chooseFile()
    },
    afterRead(file) {
      // console.log(file)
      this.$router.push({
        name: 'daycare_postDynamic',
        params: {
          file: file,
          type: this.uploadType
        }
      })
    },
    // 监听加载更多
    loadmore() {
      console.log('111')
      this.pageNum++
      this.getDynamicsList()
      // const container = this.$refs.content
      // container.scrollTop = container.scrollHeight
    },
    // 获取动态列表
    getDynamicsList() {
      const params = {}
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      params.clazzId = this.classRoomItem.clazzId
      params.teachOrCare = this.classRoomItem.courseType
      params.courseId = this.classRoomItem.courseId
      // console.log(params, '我是params')
      queryDynamic(params).then(res => {
        // console.log(res.data.data)
        const content = res.data.data.content
        // console.log(this.finished, 'finish')
        content.forEach((item) => {
          const obj = {}
          obj.dynamicId = item.dynamicId
          obj.createName = item.createName
          obj.type = item.dynamicType
          if (item.dynamicType === 'IMAGE') {
            obj.src = item.urlList[0].url
          } else {
            obj.src = item.dynamicCover
          }
          obj.content = item.content
          obj.count = item.count
          // 如果有了就不插入
          if (this.imgsArr.indexOf(obj) === -1) {
            // console.log(this.imgsArr.indexOf(obj) === -1)
            // this.imgsArr = []
            this.imgsArr.push(obj)
          }
        })
      })
    },
    toDetail(event, { value }) {
      // console.log(this.classRoomItem, 'value')
      this.$router.push({
        path: `/daycare_dynamicsDetail?dynamicId=${value.dynamicId}&clazzId=${this.classRoomItem.clazzId}&teachOrCare=${this.classRoomItem.courseType}&courseId=${this.classRoomItem.courseId}`
      })
    },
    // 显示蒙层（拍摄和相册）
    postDynamic(value) {
      this.show = value
      this.blur = true
    },
    // 取消发布动态蒙层
    cancelPostDynamic() {
      this.show = false
      this.blur = false
    },
    // 打开顶部课程筛选弹出层
    openPopup() {
      this.toggleClass()
    },
    // 关闭顶部课程筛选弹出层
    closePopup() {
      this.showPopup = this.isToggle = false
      this.toggleClass()
    },
    onConfirm(value, index) {
      this.pageNum = 1
      if (value) {
        // this.classRoomId = this.classIdList[index]
        this.classRoomItem = this.classList[index]
        this.classRoom = this.classNameList[index]

        this.imgsArr = []
        // console.log(value, 'value')
        this.getDynamicsList()
      }
      this.showClassRoom = false
    },
    onCancel() {
      this.showClassRoom = false
      this.isToggle = false
    },
    clickBtn() {
      this.showClassRoom = true
      this.isToggle = true
    },
    // 选择课程转换颜色
    toggleClass() {
      // 判断是否展开
      if (this.isToggle) {
        this.$refs.spanTimeRef.classList.remove('triangle_down')
        this.$refs.spanTimeRef.classList.add('triangle_up')
      } else {
        // 否则取反
        this.$refs.spanTimeRef.classList.remove('triangle_up')
        this.$refs.spanTimeRef.classList.add('triangle_down')
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.noDynamics {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  span:last-child {
    display: block;
    font-size: 14px;
    color: #999999;
  }
}

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

html,
body,
#app {
  height: 100%; // 父元素必须要有高度
  width: 100%; // 如果已经是block元素，则可以忽略
}

.dynamics {
  //height: 100%;
  //overflow: auto;

  .setting {

    span {
      color: white;
      margin-right: 9px;
    }
  }
}

//蒙层样式
.postType {
  position: fixed;
  bottom: 26%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;

}

.cancel {
  position: fixed;
  bottom: 19%;
  width: 100%;
  font-size: 16px;
  color: #999999;
}

.postTypeItem {
  display: flex;
  flex-direction: column;

  .photo {
    visibility: visible;
    //background-image: url('./src/assets/images/guardcare/album.png');
  }

  span {
    display: inline-block;
    margin-top: 10px;
    font-size: 13px;
    font-weight: 500;
    font-family: PingFang SC, serif;
    color: #222222;
  }
}

.icon {
  width: 50px;
  height: 50px;
  display: block;
  z-index: 999
}

.blurClass {
  filter: blur(4px);
}

.overlay {
  background: rgba(255, 255, 255, 0.8);
}

.classRoom {
  text-align: center;
  background-color: #FFFDFD;
  //height: 45px;
  line-height: 45px;
  font-size: 14px;
  box-sizing: border-box;
  position: fixed;
  z-index: 999;
  width: 100%;

}

.content {
  box-sizing: border-box;
  //background: #e5e5e5 !important;
  //padding-top: 85px;

  .content-item {
    background: #fff;
    border-radius: 6px 6px 0 0;

    img {
      border-radius: 6px 6px 0 0;
    }
  }

  .desc-header {
    position: absolute;
    display: inline-block;
    top: 4%;
    color: white;
    width: 20px;
    height: 20px;
    right: 6%;
  }

  .desc {
    font-size: 13px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-weight: 500;
    box-sizing: border-box;
    margin: 10px 0 20px 0 !important;
    color: #222222;
    text-align: left;
    padding: 0 6px;
    word-break: break-all;
  }

  .info {
    display: flex;
    justify-content: space-between;
    padding: 12px 10px 10px 10px !important;

    .item {
      display: flex;
      align-items: center;
      font-size: 11px;
      font-weight: 400;
      color: #666666;

      span {
        margin-left: 5px;
      }
    }
  }

  /deep/ .vue-waterfall-easy-container .vue-waterfall-easy a {
    //width: 150.5px;
    //height: 153px;
    margin: 0 auto;
  }
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy div {
  overflow: hidden;
}

/deep/ .vue-waterfall-easy-container {
  height: 100vh !important;
}

/deep/ .vue-waterfall-easy-container > .loading.ball-beat > .dot {
  background-color: rgb(251, 160, 71) !important;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy a.img-wraper > img {
  border-radius: 6px 6px 0 0;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box {
  border-radius: 6px;
  background: white;
  box-shadow: none !important;
}

/deep/ .vue-waterfall .vue-waterfall-column {
  padding: 3px;
}

//
///deep/ .vue-waterfall .vue-waterfall-column:first-child {
//  margin-left: 2px;
//}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy > .img-box {
  //margin-top: -13px;
  padding: 4px 6px !important;
}

/deep/ .vue-waterfall {
  overflow: auto !important;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy-scroll {
  position: relative;
  top: 12.7%;
  background: #e5e5e5;
}

.triangle_down {
  position: relative;

  &:after {
    position: absolute;
    top: 40%;
    right: -13px;
    content: '';
    width: 7px;
    height: 7px;
    border: 1px solid;
    border-left: 0;
    border-top: 0;
    transform: translateY(-50%) rotate(45deg);
  }
}

.triangle_up {
  position: relative;
  color: $theme;

  &:after {
    position: absolute;
    top: 60%;
    right: -13px;
    content: '';
    width: 7px;
    height: 7px;
    border: 1px solid;
    border-left: 0;
    border-top: 0;
    transform: translateY(-50%) rotate(-135deg);
  }
}
</style>
