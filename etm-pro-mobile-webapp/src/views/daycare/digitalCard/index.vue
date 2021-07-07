<template>
  <div class="digital-wrap">
    <setting-title class="setting" no-setting @backTo="$router.push('/mine')">
      <span>数字名片</span>
    </setting-title>

    <div class="card">
      <Card ref="card" :user-info="userInfo" :select-style="selectStyle" :select-area="selectArea" :is-edit="false" />
    </div>
    <div class="middle">
      <div class="title">介绍</div>
      <div class="desc">
        {{ userInfo.introduction }}
      </div>
    </div>

    <div class="btn-group">
      <div class="right" @click="download">生成图片</div>
      <div class="left" @click="$router.push('/digitalCardEdit')">编辑名片</div>

    </div>

    <van-overlay :show="showImgPanel" @click="showImgPanel = false">
      <setting-title no-setting @backTo="overlayBack">
        <span>数字名片</span>
      </setting-title>
      <div ref="imgPanel" class="imgPanel">
        <img ref="imgRef" class="imgRef" :src="generateImgSrc">

      </div>
    </van-overlay>

  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/11/23 13:45
 */
import settingTitle from './components/settingTitle'
import { queryDigitalCard, queryAreaInfoByAreaId } from '@/service/daycare/digitalCard'
import Card from './components/card'
import html2canvas from 'html2canvas'
import { Toast } from 'vant'

export default {
  name: 'Index',
  components: {
    settingTitle,
    Card
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      selectStyle: 1,
      Imageavatar: require('../../../assets/images/daycare/dailyDont_like.png'),
      userInfo: {},
      selectArea: '',
      showImgPanel: false,
      generateImgSrc: require('../../../assets/images/daycare/freshStyle.png'),
      generateFirstImgSrc: '',
      generateSecondImgSrc: require('../../../assets/images/daycare/businessStyle.png'),
      generateFourthImgSrc: require('../../../assets/images/daycare/freshStyle.png')

    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
    this.selectStyle = this.$route.query.selectStyle
    // console.log(this.selectStyle, ' select')
  },
  methods: {
    init() {
      this.getDigitalCardInfo()
    },
    async getDigitalCardInfo() {
      await queryDigitalCard().then(res => {
        // console.log(res, 'digitalInfo')
        const content = res.data.data
        for (const key in content) {
          if (content[key] === null) {
            content[key] = ''
          }
        }
        this.userInfo = content
      })
      this.queryArea(this.userInfo.organizationAddress)
    },
    queryArea(areaId) {
      queryAreaInfoByAreaId({ areaId }).then(res => {
        const area = res.data.data
        if (area.provinceName === area.cityName) {
          this.selectArea = `${area.provinceName}${area.countyName}`
        } else {
          this.selectArea = `${area.provinceName}${area.cityName}${area.countyName}`
        }
        // this.selectArea = `${area.provinceName}${area.cityName}${area.countyName}`
      })
    },
    download() {
      Toast.loading({
        message: '生成图片中....',
        duration: 0
      })
      const card = this.$refs.card.$refs.header
      this.showImgPanel = true
      setTimeout(() => {
        html2canvas(card, {
          useCORS: true,
          backgroundColor: null
        }).then((canvas) => {
          const img = this.$refs.imgRef
          console.log(this.$refs)
          img.width = '351px'
          img.height = '195px'
          this.generateImgSrc = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
          Toast.clear()
        })
      }, 500)
    },
    overlayBack() {
      this.showImgPanel = false
      this.$refs.imgRef.remove()
    }
  }
}
</script>
<style lang="scss" scoped>
.headerBackground {
  background-image: url("../../../assets/images/daycare/cardBg1.png");
}

.digital-wrap {
  height: 100vh;
  // 简洁风风格切换
  .header {
    width: 90%;
    height: 182px;
    margin: 16px auto 5px;
    border-radius: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .top-desc {
      display: flex;
      justify-content: space-around;

      //width: 90%;
      //margin: 0 auto;
      //border-radius: 15px;
      //height: 5px;

      .left-main {
        //z-index: 9999;
        display: flex;
        font-weight: 400;
        color: #ffffff;
        box-sizing: border-box;
        align-items: center;
        flex-basis: 50%;
        justify-content: flex-start;

        span {
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          //-webkit-line-clamp: 1;
          //line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

      }
    }

    .bottom {
      display: flex;
      justify-content: space-around;

      .bottom-right {
        display: flex;
        flex-direction: column;
        color: white;
        flex-basis: 25%;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;

        }

        .name {
          font-size: 24px;

        }

        .position {
          text-align: right;
          padding-right: 8px;
        }

      }
    }

    .right-main {
      img {
        width: 53px;
        height: 53px;
        border-radius: 50%;
      }
    }

    .bottom {
      display: flex;
      justify-content: flex-start;

      .bottom-left {
        flex-basis: 70%;
        padding-left: 18px;

        .left-desc {

          word-break: break-all;
          display: flex;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          margin-bottom: 5px;
          align-items: center;

          span {
            transform: scale(0.9);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          img {
            width: 18px;
            height: 18px;
            margin-right: 3px;
          }
        }
      }

    }
  }

  .middle {
    width: 350px;
    height: 246px;
    background: white;
    margin: 10px auto;
    padding: 13px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    flex-basis: 38%;
    border-radius: 10px;

    .title {
      padding-bottom: 8px;
      border-bottom: 1px solid #EEEEEE;
      text-align: left;
    }

    .desc {
      padding-top: 12px;
      word-break: break-all;
      overflow: scroll;
      height: 165px;
      text-align: left;
    }
  }

  .btn-group {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    display: flex;
    justify-content: space-around;
    padding: 15px 9.5px;

    div {
      width: 160px;
      height: 34px;
      border-radius: 34px;

      line-height: 34px;
    }

    .left {
      color: white;
      background: #10C2C4;

    }

    .right {
      color: #10C2C4;
      background: white;
      border: 1px solid #10C2C4;
    }
  }
}

.imgPanel {
  width: 382px;
  height: 209px;
  position: absolute;
  top: 24%;
}

.imgRef {
  width: 334px;
  height: 200px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
