<template>
  <div class="header-wrap">
    <div v-if="selectStyle === 1" ref="header" class="header headerBackground">
      <div class="top-desc">
        <div class="left-main">
          <span>{{ userInfo.organizationName }}</span>
        </div>
        <div class="right-main">
          <img :src="userInfo.avatar">
        </div>

      </div>
      <div class="bottom">
        <div class="bottom-top">
          <div class="bottom-left">
            <div class="left-desc">
              <img src="../../../../assets/images/daycare/phone.png">
              <span>{{ userInfo.telephone }}</span>
            </div>
            <div class="left-desc">
              <img src="../../../../assets/images/daycare/wechat.png">
              <span>{{ userInfo.wechatNumber }}</span>
            </div>
          </div>
          <div class="bottom-right">
            <span class="name">{{ userInfo.businessCardName }}</span>
            <span class="position">{{ userInfo.position }}</span>
          </div>
        </div>
        <div class="bottom-address">
          <div class="left-desc">
            <img src="../../../../assets/images/daycare/location.png">
            <span>{{ `${selectArea}${userInfo.organizationDetailedAddress}` }}</span>
          </div>
        </div>
      </div>

    </div>
    <div v-if="selectStyle === 2" ref="header" class="header headerBackground2">
      <div class="title2">
        {{ userInfo.organizationName }}
      </div>

      <div class="desc2">
        <div class="desc2-left">
          <img :src="userInfo.avatar">
        </div>
        <div class="desc2-right">
          <span>{{ userInfo.businessCardName }}</span>
          <span>{{ userInfo.position }}</span>
        </div>
      </div>

      <div class="footer2">
        <div class="footer2-top">
          <div class="footer2-left">
            <div class="left-desc">
              <img src="../../../../assets/images/daycare/phone.png">
              <span>{{ userInfo.telephone }}</span>
            </div>
          </div>
          <div class="footer-right">
            <div class="right-desc">
              <img src="../../../../assets/images/daycare/wechat.png">
              <span class="spanOverFlow">{{ userInfo.wechatNumber }}</span>
            </div>
          </div>
        </div>

        <div class="footer2-bottom">
          <div class="left-desc">
            <img src="../../../../assets/images/daycare/location.png">
            <span>{{ `${selectArea}${userInfo.organizationDetailedAddress}` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectStyle === 3" ref="header" class="header headerBackground3">
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
          <img :src="userInfo.avatar">
        </div>
      </div>
      <div class="bottom">
        <div class="footer2">
          <div class="footer2-left">
            <div class="left-desc">
              <img src="../../../../assets/images/daycare/phone.png">
              <!--              <span>{{ userInfo.phone }}</span>-->
              <span>{{ userInfo.telephone }}</span>
            </div>
          </div>
          <div class="footer-right">
            <div class="right-desc">
              <img src="../../../../assets/images/daycare/wechat.png">
              <!--              <span>{{ userInfo.wechat }}</span>-->
              <span>{{ userInfo.wechatNumber }}</span>
            </div>
            <!--          </div>-->
          </div>
        </div>

        <div class="address-footer">
          <div class="left-desc">
            <img src="../../../../assets/images/daycare/location.png">
            <!--          <span>{{ userInfo.detailAddress }}</span>-->
            <span>{{ `${selectArea}${userInfo.organizationDetailedAddress}` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectStyle === 4" ref="header" class="header headerBackground4">
      <div class="left">
        <div class="top">
          {{ userInfo.organizationName }}
        </div>
        <div class="bottom">
          <!--          <span>{{ userInfo.phone }}</span>-->
          <div class="bottom-desc">
            <img src="../../../../assets/images/daycare/phone.png">
            <span>{{ userInfo.telephone }}</span>
          </div>
          <div class="bottom-desc">
            <img src="../../../../assets/images/daycare/wechat.png">
            <span>{{ userInfo.wechatNumber }}</span>
          </div>
          <!--          <span>{{ userInfo.detailAddress }}</span>-->
          <div class="bottom-desc">
            <img src="../../../../assets/images/daycare/location.png">
            <span>{{ `${selectArea}${userInfo.organizationDetailedAddress}` }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <span>{{ userInfo.businessCardName }}</span>
          <span>{{ userInfo.position }}</span>
        </div>
        <div class="bottom">
          <img :src="userInfo.avatar">
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * header create by Administrator
 * createTime 2020/11/20 17:13
 */
export default {
  name: 'Header',
  components: {},
  filters: {},
  mixins: [],
  props: {
    selectStyle: {
      type: Number,
      default: () => {
        return 1
      }
    },
    userInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectArea: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
.spanOverFlow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header-wrap {
  .headerBackground {
    width: 334px;
    height: 215px;
    background-size: cover;
    background-image: url("../../../../assets/images/daycare/digitalBackground.png");
  }

  .headerBackground2 {
    width: 334px;
    //height: 186px;
    height: 215px;
    background-size: cover;
    background-image: url("../../../../assets/images/daycare/businessStyle.png");
  }

  .headerBackground3 {
    width: 334px;
    height: 215px;
    background-size: cover;
    background-image: url("../../../../assets/images/daycare/officeStyle.png");

    //background: #2C2829;
  }

  .headerBackground4 {
    width: 334px;
    height: 215px;
    background-size: cover;
    background-image: url("../../../../assets/images/daycare/freshStyle.png");
  }

  // 简洁风风格切换
  .header {
    //width: 90%;
    //height: 182px;
    margin: 50px auto 5px;
    border-radius: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .top-desc {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      //width: 90%;
      //margin: 0 auto;
      //border-radius: 15px;
      //height: 5px;

      .left-main {
        z-index: 9999;
        display: flex;
        justify-content: flex-start;
        font-weight: 400;
        color: #ffffff;
        box-sizing: border-box;
        align-items: center;
        flex-basis: 50%;

        span {
          font-size: 18px;
          //display: -webkit-box;
          //-webkit-line-clamp: 1;
          //line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }

      }
    }

    .bottom {
      display: flex;
      justify-content: space-around;
      flex-direction: column;

      .bottom-top {
        display: flex;
      }

      .bottom-address {
        padding: 0 16px;
        color: white;

        .left-desc {
          display: flex;

          img {
            width: 18px;
            height: 18px;
            margin-right: 3px;
          }

          span {
            margin-left: 8px;
            height: 40px;
            overflow: hidden;
          }
        }
      }

      .bottom-right {
        display: flex;
        flex-direction: column;
        color: white;
        flex-basis: 25%;

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
          display: flex;
          justify-content: flex-end;
        }

        .position {
          //font-size: 12px;
          text-align: right;

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
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-top: 10px;

        .left-desc {

          word-break: break-all;
          display: flex;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          margin-bottom: 5px;
          align-items: center;

          span {
            color: white;
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
            margin-right: 3px;
          }
        }
      }

    }
  }
}

//商务风风格样式
.headerBackground2 {
  color: #F8CA7D;
  display: flex;
  flex-direction: column;

  .title2 {
    font-size: 14px;
    font-weight: 400;
    flex-basis: 15%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: 12px;
    line-height: 18px;
  }

  .desc2 {
    display: flex;
    justify-content: space-evenly;
    width: 85%;
    margin: 0 auto;
    padding-top: 10px;
    flex-basis: 40%;
    align-items: center;
    //padding-bottom: 17px;
    padding-right: 20px;

    img {
      border-radius: 50%;
      width: 57px;
      height: 57px;
    }

    .desc2-right {
      font-size: 24px;
      display: flex;
      align-items: baseline;
    }

    span:first-child {

      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: 400;

    }

    span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 72px;
      display: inline-block;
      margin-left: 5px;
    }
  }

  .footer2 {
    display: flex;
    box-sizing: border-box;
    padding: 13px 11px 0;
    flex-direction: column;

    .footer2-top {
      display: flex;
    }

    .footer2-bottom {
      margin-top: 2px;

      .left-desc {
        padding: 0 7px;

        span {
          width: auto;
          //text-overflow: ellipsis;
          //overflow: hidden;
          //white-space: nowrap;
          max-height: 40px;
          overflow: hidden;
        }
      }
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
        align-items: center;

        span {
          padding-left: 3px;
          overflow: hidden;
          width: 150px;
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
}

// 办公风格样式
.headerBackground3 {
  background-color: #F1ECE9;
  margin: 0 auto;
  border-radius: 10px;
  width: 334px;
  height: 186px;
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

        span:first-child {
          font-size: 24px !important;
        }

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
      display: flex;
      align-items: flex-end;
      padding-bottom: 5px;

      img {
        width: 57px;
        height: 57px;
        border-radius: 50%;
      }
    }

  }

  .bottom {
    //padding-bottom: 14px;
    margin-top: 14px;
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
          max-height: 40px;
          //overflow: hidden;
          //white-space: nowrap;
          //text-overflow: ellipsis;
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

  .left {
    display: flex;
    flex-direction: column;
    justify-content: inherit;
    padding: 19px 0 10px 19px;
    flex-basis: 100%;

    .bottom {
      display: flex;
      flex-direction: column;

      .bottom-desc {
        display: flex;
        margin-bottom: 3px;

        img {
          width: 18px;
          height: 18px;
          margin-right: 3px;
        }
      }

      .bottom-desc:last-of-type {
        span {
          height: 40px;
          overflow: hidden;
        }
      }
    }
  }

  .right {
    display: flex;
    width: 290px;
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

      img {
        width: 57px;
        height: 57px;
        border-radius: 50%;
      }
    }
  }
}

</style>
