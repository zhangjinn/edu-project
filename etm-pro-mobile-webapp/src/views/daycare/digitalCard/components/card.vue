<template>
  <div class="card-wrap">
    <div v-if="selectStyle === 1 || selectStyle === '1'" ref="header" class="header headerBackground">
      <div class="top-desc">
        <div class="left-main">
          <span>{{ userInfo.organizationName }}</span>
        </div>
        <div class="right-main">
          <!--          {{ userInfo.avatar }}-->
          <van-uploader v-if="isEdit" v-model="filelist" :after-read="afterRead" :preview-image="false">
            <img v-if="userInfo.avatar" ref="avatar" :src="userInfo.avatar">
            <img v-else :src="Imageavatar">
          </van-uploader>
          <img v-else :src="userInfo.avatar">
          <!--          <slot></slot>-->
        </div>

      </div>
      <div class="bottom">
        <div class="bottom1-top">
          <div class="bottom-left">
            <div class="left-desc">
              <img v-if="userInfo.telephone" :src="phoneIcon">
              <span>{{ userInfo.telephone }}</span>
            </div>
            <div class="left-desc">
              <img v-if="userInfo.wechatNumber" :src="wechatIcon">
              <span>{{ userInfo.wechatNumber }}</span>
            </div>
          </div>
          <div class="bottom-right">
            <span class="name">{{ userInfo.businessCardName }}</span>
            <span class="position">{{ userInfo.position }}</span>
          </div>
        </div>

        <div class="bottom1-bottom">
          <div class="left-desc">
            <img v-if="selectArea" :src="locationIcon">
            <span>{{ `${ selectArea }${ userInfo.organizationDetailedAddress }` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectStyle === 2 || selectStyle === '2'" ref="header" class="header headerBackground2">
      <div class="title2">
        <!--          {{ userInfo.organizationName }}-->
        {{ userInfo.organizationName }}
      </div>

      <div class="desc2">
        <div class="desc2-left">
          <van-uploader v-if="isEdit" v-model="filelist" :after-read="afterRead" :preview-image="false">
            <img v-if="userInfo.avatar" ref="avatar" :src="userInfo.avatar">
            <img v-else :src="Imageavatar">
          </van-uploader>
          <img v-else :src="userInfo.avatar">
        </div>
        <div class="desc2-right">
          <!--            <span>{{ userInfo.username }}</span>-->
          <span>{{ userInfo.businessCardName }}</span>
          <span>{{ userInfo.position }}</span>
          <!--            <span>{{ userInfo.position }}</span>-->
        </div>
      </div>

      <div class="bottom">
        <div class="footer2">
          <div class="footer2-left">
            <div class="left-desc">
              <img v-if="userInfo.telephone" :src="phoneIcon">
              <!--              <span>{{ userInfo.phone }}</span>-->
              <span>{{ userInfo.telephone }}</span>
            </div>
          </div>
          <div class="footer-right">
            <div class="right-desc">
              <img v-if="userInfo.wechatNumber" :src="wechatIcon">
              <!--              <span>{{ userInfo.wechat }}</span>-->
              <span>{{ userInfo.wechatNumber }}</span>
            </div>
            <!--          </div>-->
          </div>
        </div>

        <div class="address-footer">
          <div class="left-desc">
            <img v-if="selectArea" :src="locationIcon">
            <!--          <span>{{ userInfo.detailAddress }}</span>-->
            <span>{{ `${ selectArea }${ userInfo.organizationDetailedAddress }` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectStyle === 3 || selectStyle === '3'" ref="header" class="header headerBackground3">
      <!--      <div class="topLine" />-->
      <div class="content">
        <div class="left">
          <div class="left3-top">
            {{ userInfo.organizationName }}
          </div>
          <div class="left3-bottom">
            <span>{{ userInfo.businessCardName }}</span>
            <span>{{ userInfo.position }}</span>
          </div>
        </div>
        <div class="right">
          <van-uploader v-if="isEdit" v-model="filelist" :after-read="afterRead" :preview-image="false">
            <img v-if="userInfo.avatar" ref="avatar" :src="userInfo.avatar">
            <img v-else :src="Imageavatar">
          </van-uploader>
          <img v-else :src="userInfo.avatar">
        </div>
      </div>
      <div class="bottom">
        <div class="footer2">
          <div class="footer2-left">
            <div class="left-desc">
              <img v-if="userInfo.telephone" :src="phoneIcon">
              <!--              <span>{{ userInfo.phone }}</span>-->
              <span>{{ userInfo.telephone }}</span>
            </div>
          </div>
          <div class="footer-right">
            <div class="right-desc">
              <img v-if="userInfo.wechatNumber" :src="wechatIcon">
              <!--              <span>{{ userInfo.wechat }}</span>-->
              <span>{{ userInfo.wechatNumber }}</span>
            </div>
            <!--          </div>-->
          </div>
        </div>

        <div class="address-footer">
          <div class="left-desc">
            <img v-if="selectArea" :src="locationIcon">
            <!--          <span>{{ userInfo.detailAddress }}</span>-->
            <span>{{ `${ selectArea }${ userInfo.organizationDetailedAddress }` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectStyle === 4 || selectStyle === '4'" ref="header" class="header headerBackground4">
      <div class="left">
        <div class="top">
          {{ userInfo.organizationName }}
        </div>
        <div class="bottom">
          <!--          <span>{{ userInfo.phone }}</span>-->
          <div class="bottom-desc">
            <img v-if="userInfo.telephone" src="../../../../assets/images/daycare/phone.png">
            <span>{{ userInfo.telephone }}</span>
          </div>
          <div class="bottom-desc">
            <img v-if="userInfo.wechatNumber" src="../../../../assets/images/daycare/wechat.png">
            <span>{{ userInfo.wechatNumber }}</span>
          </div>
          <!--          <span>{{ userInfo.detailAddress }}</span>-->
          <div class="bottom-desc">
            <img
              v-if="selectArea"
              src="../../../../assets/images/daycare/location.png"
            >
            <span class="last">{{ `${ selectArea }${ userInfo.organizationDetailedAddress }` }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <span>{{ userInfo.businessCardName }}</span>
          <span>{{ userInfo.position }}</span>
        </div>
        <div class="bottom">
          <van-uploader v-if="isEdit" v-model="filelist" :after-read="afterRead" :preview-image="false">
            <img v-if="userInfo.avatar" ref="avatar" :src="userInfo.avatar">
            <img v-else :src="Imageavatar">
          </van-uploader>
          <img v-else :src="userInfo.avatar">
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { uploadFile } from '@/service/upload'
import { Toast } from 'vant'
import { getUploadFilePrefix } from '@/service/base/basic'

/**
 * header create by Administrator
 * createTime 2020/11/24 13:40
 */
export default {
  name: 'Header',
  components: {},
  filters: {},
  mixins: [],
  props: {
    selectStyle: {
      type: [Number, String],
      default: () => {
        return 1
      }
    },
    userInfo: {
      type: Object,
      default: () => {
        return null
      }
    },
    selectArea: {
      type: String,
      default: () => {
        return ''
      }
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      filelist: [],
      Imageavatar: require('../../../../assets/images/daycare/dailyDont_like.png'),
      phoneIcon: require('../../../../assets/images/daycare/phone.png'),
      wechatIcon: require('../../../../assets/images/daycare/wechat.png'),
      locationIcon: require('../../../../assets/images/daycare/location.png')
    }
  },
  computed: {
    avatar() {
      const qiniuUrl = 'http://qiniu.etmpro.etmcn.com/'
      // console.log(qiniuUrl + this.userInfo.avatar, '111')
      return qiniuUrl + this.userInfo.avatar
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    afterRead(file) {
      uploadFile(file.file, 'dayacare/digitalCard/edit', 'image').then(async res => {
        // const qiniuUrl = 'http://qiniu.etmpro.etmcn.com/'
        const { data } = await getUploadFilePrefix() || {}
        this.userInfo.avatar = data + res.data.key
        // this.avatar = file.content
        // this.putInfo()
      }).then(() => {
        Toast.clear()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.headerBackground {
  background-image: url("../../../../assets/images/daycare/cardBg1.png");
}

.card-wrap {
  margin: 10px auto;
}

// 简洁风风格切换
.headerBackground {
  background-size: cover;
  width: 351px;
  height: 215px;
  margin: 0 auto 5px;
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
      flex-basis: 55%;
      text-align: left;
      justify-content: flex-start;

      span {
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        //display: -webkit-box;
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
      padding-top: 7px;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        //display: -webkit-box;
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
        padding-right: 6px;
        font-size: 14px;

        transform: scale(0.8) !important;
        //padding-right: 0;

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
    flex-direction: column;

    .left-desc {
      font-size: 14px;
      word-break: break-all;
      display: flex;
      //font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
      margin-bottom: 5px;
      align-items: center;

      span {
        width: 200px;
        padding-left: 3px;
        text-align: left;
        transform: scale(0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        //display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      img {
        width: 18px;
        height: 18px;
        //margin-right: 3px;
      }
    }

    .bottom1-top {
      display: flex;

      .bottom-left {
        flex-basis: 70%;
        padding-left: 18px;
        padding-top: 10px;
      }
    }

    .bottom1-bottom {
      display: flex;
      padding: 0 18px;

      span {
        width: 300px;
        text-align: left;
        //transform: scale(0.8);
        padding-left: 0 !important;
        text-overflow: ellipsis;
        overflow: hidden;
        max-height: 40px;
        //white-space: nowrap;
      }

      .left-desc {
        display: flex;
        align-items: stretch;
        margin-top: 5px;
      }

      //img {
      //  margin-right: 3px;
      //}
    }

  }
}

//商务风风格样式
.headerBackground2 {
  color: #F8CA7D;
  display: flex;
  flex-direction: column;
  width: 351px;
  height: 215px;
  background-image: url("../../../../assets/images/daycare/businessStyle.png");
  margin: 10px auto;
  justify-content: space-between;
  background-size: cover;
  border-radius: 10px;

  .title2 {
    margin-top: 3px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    flex-basis: 15%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: 18px;
    line-height: 18px;
  }

  .desc2 {
    display: flex;
    justify-content: center;
    width: 85%;
    margin: 0 auto;
    flex-basis: 40%;
    align-items: center;
    padding-bottom: 10px;
    padding-right: 20px;

    img {
      margin-right: 13px;
      border-radius: 50%;
      width: 53px;
      height: 53px;
    }

    .desc2-right {
      font-size: 12px;
      margin-left: 12px;

      span:last-child {
        margin-left: 10px;
      }

      span:first-child {

        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;

      }
    }

  }

  .bottom {
    margin-bottom: 10px;

    .footer2 {
      display: flex;
      box-sizing: border-box;
      padding: 0 11px;
      margin-bottom: 3px;

      img {
        width: 18px;
        height: 18px;
      }

      .footer2-left {
        flex-basis: 50%;
        padding-left: 8px;

        .left-desc {
          display: flex;
          align-items: center;
          line-height: 26px;
          -webkit-box-orient: vertical;
          white-space: nowrap;

          span {
            text-align: left;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 125px;
            white-space: nowrap;
          }
        }
      }

      .footer-right {
        padding-top: 3px;

        .right-desc {
          display: flex;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          //padding-bottom: 22px;
          align-items: flex-end;

          span {
            margin-left: 3px;
            text-align: left;
            font-size: 13px;
            padding-left: 3px;
            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;
          }
        }
      }

      .left-desc {
        display: flex;
        align-items: center;

        span {
          padding-left: 3px;
          width: 130px;
        }
      }
    }

    .address-footer {
      padding: 0 18px;

      img {
        width: 18px;
        height: 18px;
      }

      .left-desc {
        display: flex;
        align-items: center;

        span {
          padding-left: 3px;
          //width: 130px;
          font-size: 13px;
          width: 100%;
          text-align: left;
          overflow: hidden;
          max-height: 35px;
          //white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

// 办公风格样式
.headerBackground3 {
  background-image: url("../../../../assets/images/daycare/officeStyle.png");
  background-size: cover;
  //background-color: #F1ECE9;
  margin: 0 auto;
  border-radius: 10px;
  width: 351px;
  height: 215px;
  //background: #2C2829;
  display: flex;
  flex-direction: column !important;
  justify-content: flex-start !important;
  color: #222222;
  font-weight: bold;

  .topLine {
    width: 90%;
    height: 5px;
    background: #C41F26;
    margin: 23px auto 0;
    border-radius: 15px;
    //height: 5px;
  }

  .content {
    display: flex;
    justify-content: space-between;
    margin: 0;
    height: 88px;
    padding: 10px 33px 0 16px;
    flex-basis: 68%;

    .left {
      display: flex;
      flex-direction: column;

      .left3-bottom {
        text-align: left;
        margin-top: 47px;
        padding-left: 10px;
        font-size: 24px;

        span {
          display: inline-block;
        }

        span:last-of-type {
          font-size: 12px;
          margin-left: 5px;
        }
      }
    }

    .right {
      padding-bottom: 13px;
      display: flex;
      align-items: flex-end;

      img {
        width: 57px;
        height: 57px;
        border-radius: 50%;
      }
    }

  }

  .bottom {
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: normal;

    .footer2 {
      display: flex;
      margin-bottom: 4px;
      box-sizing: border-box;
      padding: 0 11px;

      img {
        width: 18px;
        height: 18px;
      }

      .footer2-left {
        flex-basis: 50%;
        padding-left: 8px;

        .left-desc {
          display: flex;
          align-items: center;
          line-height: 26px;
          -webkit-box-orient: vertical;
          white-space: nowrap;

          span {
            text-align: left;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 125px;
            white-space: nowrap;
          }
        }
      }

      .footer-right {
        padding-top: 3px;

        .right-desc {
          display: flex;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          //padding-bottom: 22px;
          align-items: flex-end;

          span {
            margin-left: 3px;
            text-align: left;
            font-size: 13px;
            padding-left: 3px;
            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;
          }
        }
      }

      .left-desc {
        display: flex;
        align-items: center;

        span {
          padding-left: 3px;
          width: 130px;
        }
      }
    }

    .address-footer {
      padding: 0 18px;

      img {
        width: 18px;
        height: 18px;
      }

      .left-desc {
        display: flex;
        align-items: center;

        span {
          padding-left: 3px;
          //width: 130px;
          font-size: 13px;
          width: 100%;
          text-align: left;
          overflow: hidden;
          //white-space: nowrap;
          max-height: 35px;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

// 清新风风格样式
.headerBackground4 {
  display: flex;
  flex-direction: row !important;
  justify-content: space-between !important;
  color: #222222;
  width: 351px;
  height: 215px;
  background-image: url("../../../../assets/images/daycare/freshStyle.png");
  margin: 0 auto;
  font-size: 14px;
  background-size: cover;

  .left {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: inherit;
    padding: 19px 0 10px 19px;

    .top {
      font-size: 14px;
      text-align: left;
    }

    .bottom {
      display: flex;
      flex-direction: column;

      .bottom-desc {
        display: flex;
        margin-bottom: 3px;
        align-items: center;

        img {
          width: 18px;
          height: 18px;
          margin-right: 6px;
        }
      }
    }
  }

  .last {
    text-align: left;
    max-height: 40px;
    overflow: hidden;

  }

  .right {
    display: flex;
    flex-direction: column;
    //justify-content: inherit;
    padding: 19px 19px 19px 0;
    justify-content: space-evenly;
    //justify-content: space-around;
    flex-basis: 40%;

    .top {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      flex-basis: 40%;
      align-items: flex-end;
      padding-bottom: 12px;

      span:first-child {
        font-size: 24px;
      }
    }

    .bottom {
      justify-content: flex-end;
      align-items: flex-end;
      display: flex;

      img {
        width: 57px;
        height: 57px;
        border-radius: 50%;
      }

    }
  }

}
</style>
