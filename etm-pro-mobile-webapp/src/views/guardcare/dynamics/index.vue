<template>
  <div class="dynamics">

    <div class="classRoom">
      <setting-title :no-setting="true" @backTo="$router.push('/workBench')">
        <span class="menu">动态</span>
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
      v-if="!noDynamicsFlag && imgsArr.length !== 0"
      ref="content"
      class="content"
      :imgs-arr="imgsArr"
      :img-width="180"
      :max-cols="5"
      :mobile-gap="8"
      :loading-dot-style="{color:'#10C2C4'}"
      :reach-bottom-distance="100"
      :loading-dot-count="0"
      card-animation-class=""
      @scrollReachBottom="onLoad"
      @click="toDetail"
    >
      <div slot-scope="props">
        <div v-if="props.value.type === 'VIDEO'" slot="waterfall-head" class="desc-header">
          <span class="iconfont iconbofang" />
        </div>
        <div class="desc">
          {{ props.value.info }}
        </div>
        <div class="info">
          <div class="item">
            <van-image :src="likeIcon" width="16px" height="16px" />
            <span>{{ props.value.createBy }}</span>
          </div>
          <div class="item">
            <span class="iconfont iconlike" />
            <span>{{ props.value.numberOfLikes }}</span>
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
            max-count="30"
            :preview-image="true"
          >
            <van-image class="icon" :src="shotIconSrc" @click="showCamera('video')" />
            <span>拍摄</span>
          </van-uploader>
        </div>

        <div class="cancel" @click="cancelPostDynamic">
          <span class="iconfont iconout" />
        </div>
      </div>

    </van-overlay>
  </div>
</template>

<script>
import addDrag from './components/drag'
import { queryClassAuth, queryDynamic } from '@/service/guardcare/dynamic'
import vueWaterfallEasy from 'vue-waterfall-easy'
import settingTitle from './components/settingTitle'

export default {
  name: 'Index',
  components: {
    addDrag,
    vueWaterfallEasy,
    settingTitle
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
      classRoomId: null,
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
      noDynamics: require('@/assets/images/daycare/noDynamics.png'),
      noDynamicsFlag: false

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
        const content = res.data.data
        for (const grade of content) {
          for (const clazz of grade.clazzes) {
            // 将负责的班级名字插入
            this.classNameList.push(clazz.name)
            // 将负责的班级id插入
            this.classIdList.push(clazz.id)
            // 首先取第一个id作为查询
            this.classRoomId = this.classIdList[0]
            this.classRoom = this.classNameList[0]
          }
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
        name: 'guardcare_postDynamic',
        params: {
          file: file,
          type: this.uploadType
        }
      })
    },
    // 监听加载更多
    onLoad() {
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
      params.clazzId = this.classRoomId
      // console.log(params, '我是params')
      queryDynamic(params).then(res => {
        if (res.data.data.content.length === 0 && this.imgsArr.length === 0) {
          this.noDynamicsFlag = true
        }
        const content = res.data.data.content
        content.forEach((item) => {
          const obj = {}
          obj.dynamicsId = item.dynamicsId
          obj.createBy = item.createBy
          obj.type = item.type
          if (item.type === 'IMAGE') {
            obj.src = item.fileInfoList[0].url
          } else {
            obj.src = item.fileInfoList[0].coverUrl
          }
          obj.info = item.textContent
          obj.numberOfLikes = item.numberOfLikes
          this.imgsArr.push(obj)
          // this.imgsArr = []
        })
      })
    },
    toDetail(event, { value }) {
      console.log('111')
      this.$router.push({
        path: '/guardcare_dynamicsDetail?dynamicsId=' + value.dynamicsId,
        query: {
          clazzId: this.classRoomId
        }
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
      // console.log(value, index, 'index')
      this.pageNum = 1
      if (value) {
        this.classRoomId = this.classIdList[index]
        this.classRoom = this.classNameList[index]
        this.imgsArr = []
        // console.log(this.classRoom)
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
  position: relative;
  top: 40%;
  left: 40%;
  transform: translate(-40%, -40%);

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
  height: 100%;

  //.bar {
  //  background: red !important;
  //}
}

//蒙层样式
.postType {
  position: fixed;
  bottom: 26%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;

  .cancel {
    position: fixed;
    bottom: 19%;

    span {
      font-size: 16px;

      color: #999999;
    }
  }

  .postTypeItem {
    display: flex;
    flex-direction: column;

    .photo {
      visibility: visible;
    }

    span {
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
}

.blurClass {
  filter: blur(4px);
}

.overlay {
  background: rgba(255, 255, 255, 0.8);
}

.classRoom {
  font-size: 14px;
  text-align: center;
  background-color: #FFFDFD;
  //height: 45px;
  line-height: 45px;
  box-sizing: border-box;
  position: fixed;
  z-index: 999;
  width: 100%;

}

.content {
  box-sizing: border-box;
  //padding-top: 43px;
  //background: #e5e5e5;
  position: relative;
  top: 5%;

  .desc-header {
    position: absolute;
    display: inline-block;
    top: 4%;
    width: 20px;
    height: 20px;
    color: white;
    right: 6%;
  }

  .desc {
    font-size: 13px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0 10px 0 !important;
    font-weight: 500;
    box-sizing: border-box;
    color: #222222;
    text-align: left;
    padding: 0 6px;
    word-break: break-all;
  }

  .info {
    display: flex;
    justify-content: space-between;
    padding: 12px 10px 5px 10px !important;

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

/deep/ .vue-waterfall-easy-container > .loading.ball-beat > .dot {
  background-color: rgb(251, 160, 71) !important;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy > .img-box {

}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy a.img-wraper > img {
  border-radius: 6px 6px 0 0;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box {
  border-radius: 6px;
  background: white;
  box-shadow: none !important;
}

/deep/ .vue-waterfall-easy-container .vue-waterfall-easy-scroll {
  position: relative;
  top: 9%;
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
