<template>
  <div class="header-wrap">
    <div
      v-if="selectStyle === 1"
      ref="header"
      class="header headerBackground"
    >
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
    <div
      v-if="selectStyle === 2"
      ref="header"
      class="header headerBackground2"
    >
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

    <div
      v-if="selectStyle === 3"
      ref="header"
      class="header headerBackground3"
    >
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

    <div
      v-if="selectStyle === 4"
      ref="header"
      class="header headerBackground4"
    >
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
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    }
  }
}
</script>
<style lang="scss" scoped>
.spanOverFlow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-wrap {
  .headerBackground {
    background-image: url('../../../../assets/images/daycare/digitalBackground.png');
    background-size: cover;
    height: 215px;
    width: 334px;
  }

  .headerBackground2 {
    background-image: url('../../../../assets/images/daycare/businessStyle.png');
    background-size: cover;
    //height: 186px;
    height: 215px;
    width: 334px;
  }

  .headerBackground3 {
    background-image: url('../../../../assets/images/daycare/officeStyle.png');
    background-size: cover;
    height: 215px;
    width: 334px;

    //background: #2C2829;
  }

  .headerBackground4 {
    background-image: url('../../../../assets/images/daycare/freshStyle.png');
    background-size: cover;
    height: 215px;
    width: 334px;
  }

  // 简洁风风格切换
  .header {
    border-radius: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    //width: 90%;
    //height: 182px;
    margin: 50px auto 5px;

    .top-desc {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      //width: 90%;
      //margin: 0 auto;
      //border-radius: 15px;
      //height: 5px;

      .left-main {
        align-items: center;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        flex-basis: 50%;
        font-weight: 400;
        justify-content: flex-start;
        z-index: 9999;

        span {
          //display: -webkit-box;
          //-webkit-line-clamp: 1;
          //line-clamp: 2;
          /*box-orient: vertical;*/
          display: inline-block;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 180px;
          word-break: break-all;
        }

      }
    }

    .right-main {
      img {
        border-radius: 50%;
        height: 53px;
        width: 53px;
      }
    }

    .bottom {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .bottom-left {
        display: flex;
        flex-basis: 70%;
        flex-direction: column;
        justify-content: flex-end;
        padding-left: 18px;
        padding-top: 10px;

        .left-desc {
          align-items: center;
          color: #fff;
          display: flex;
          font-family: Microsoft YaHei;
          font-size: 12px;
          font-weight: 400;
          margin-bottom: 5px;

          word-break: break-all;

          span {
            /*box-orient: vertical;*/
            color: #fff;
            //display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            transform: scale(0.9);
          }

          img {
            height: 18px;
            margin-right: 3px;
            width: 18px;
          }
        }
      }

      .bottom-top {
        display: flex;
      }

      .bottom-address {
        color: #fff;
        padding: 0 16px;

        .left-desc {
          display: flex;

          img {
            height: 18px;
            margin-right: 3px;
            width: 18px;
          }

          span {
            height: 40px;
            margin-left: 8px;
            overflow: hidden;
          }
        }
      }

      .bottom-right {
        color: #fff;
        display: flex;
        flex-basis: 25%;
        flex-direction: column;

        span {
          /*box-orient: vertical;*/
          //display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;

        }

        .name {
          display: flex;
          font-size: 24px;
          justify-content: flex-end;
        }

        .position {
          //font-size: 12px;
          text-align: right;

        }

      }

    }
  }
}

//商务风风格样式
.headerBackground2 {
  color: #f8ca7d;
  display: flex;
  flex-direction: column;

  .title2 {
    align-items: flex-end;
    display: flex;
    flex-basis: 15%;
    font-size: 14px;
    font-weight: 400;
    justify-content: flex-end;
    line-height: 18px;
    padding-right: 12px;
  }

  .desc2 {
    align-items: center;
    display: flex;
    flex-basis: 40%;
    justify-content: space-evenly;
    margin: 0 auto;
    //padding-bottom: 17px;
    padding-right: 20px;
    padding-top: 10px;
    width: 85%;

    img {
      border-radius: 50%;
      height: 57px;
      width: 57px;
    }

    .desc2-right {
      align-items: baseline;
      display: flex;
      font-size: 24px;
    }

    span:first-child {
      font-family: Microsoft YaHei;

      font-size: 24px;
      font-weight: 400;

    }

    span:last-child {
      display: inline-block;
      margin-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 72px;
    }
  }

  .footer2 {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 13px 11px 0;

    .footer2-top {
      display: flex;
    }

    .footer2-bottom {
      margin-top: 2px;

      .left-desc {
        padding: 0 7px;

        span {
          //text-overflow: ellipsis;
          //overflow: hidden;
          //white-space: nowrap;
          max-height: 40px;
          overflow: hidden;
          width: auto;
        }
      }
    }

    .footer2-left {
      flex-basis: 50%;
      padding-left: 8px;

      .left-desc {
        align-items: center;
        /*box-orient: vertical;*/
        display: flex;
        line-height: 26px;
        white-space: nowrap;

        span {

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 125px;
        }
      }
    }

    .footer-right {
      padding-top: 3px;

      .right-desc {
        //padding-bottom: 22px;
        align-items: center;
        /*box-orient: vertical;*/
        display: flex;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          overflow: hidden;
          padding-left: 3px;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 150px;
        }
      }
    }

    .left-desc {
      align-items: center;
      display: flex;

      span {
        padding-left: 3px;
        width: 130px;
      }
    }
  }
}

// 办公风格样式
.headerBackground3 {
  background-color: #f1ece9;
  border-radius: 10px;
  color: #222;
  //background: #2C2829;
  display: flex;
  flex-direction: column !important;
  font-weight: bold;
  height: 186px;
  justify-content: flex-start !important;
  margin: 0 auto;
  width: 334px;

  .topLine {
    background: #c41f26;
    border-radius: 15px;
    height: 5px;
    margin: 23px auto 0;
    width: 90%;
    //height: 5px;
  }

  .content {
    display: flex;
    flex-basis: 68%;
    height: 88px;
    justify-content: space-between;
    margin: 0;
    padding: 10px 33px 0 16px;

    .left {
      display: flex;
      flex-direction: column;

      .left3-bottom {
        font-size: 24px;
        margin-top: 47px;
        padding-left: 10px;
        text-align: left;

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
      align-items: flex-end;
      display: flex;
      padding-bottom: 5px;

      img {
        border-radius: 50%;
        height: 57px;
        width: 57px;
      }
    }

  }

  .bottom {
    font-weight: normal;
    margin-bottom: 10px;
    //padding-bottom: 14px;
    margin-top: 14px;

    .footer2 {
      box-sizing: border-box;
      display: flex;
      margin-bottom: 4px;
      padding: 0 11px;

      img {
        height: 18px;
        width: 18px;
      }

      .footer2-left {
        flex-basis: 50%;
        padding-left: 8px;

        .left-desc {
          align-items: center;
          /*box-orient: vertical;*/
          display: flex;
          line-height: 26px;
          white-space: nowrap;

          span {
            font-size: 13px;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 125px;
          }
        }
      }

      .footer-right {
        padding-top: 3px;

        .right-desc {
          //padding-bottom: 22px;
          align-items: flex-end;
          /*box-orient: vertical;*/
          display: flex;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          text-overflow: ellipsis;
          white-space: nowrap;

          span {
            font-size: 13px;
            margin-left: 3px;
            overflow: hidden;
            padding-left: 3px;
            text-align: left;

            text-overflow: ellipsis;

            white-space: nowrap;
          }
        }
      }

      .left-desc {
        align-items: center;
        display: flex;

        span {
          padding-left: 3px;
          width: 130px;
        }
      }
    }

    .address-footer {
      padding: 0 18px;

      img {
        height: 18px;
        width: 18px;
      }

      .left-desc {
        align-items: center;
        display: flex;

        span {
          //width: 130px;
          font-size: 13px;
          max-height: 40px;
          overflow: hidden;
          padding-left: 3px;
          text-align: left;
          width: 100%;
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
  color: #222;
  display: flex;
  flex-direction: row !important;
  justify-content: space-between !important;

  .left {
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    justify-content: inherit;
    padding: 19px 0 10px 19px;

    .bottom {
      display: flex;
      flex-direction: column;

      .bottom-desc {
        display: flex;
        margin-bottom: 3px;

        img {
          height: 18px;
          margin-right: 3px;
          width: 18px;
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
    //justify-content: space-around;
    flex-basis: 40%;
    flex-direction: column;
    justify-content: space-evenly;
    //justify-content: inherit;
    padding: 19px 19px 19px 0;
    width: 290px;

    .top {
      align-items: flex-end;
      display: flex;
      flex-basis: 40%;
      flex-direction: column;
      font-size: 14px;
      padding-bottom: 12px;

      span:first-child {
        font-size: 24px;
      }
    }

    .bottom {
      align-items: flex-end;
      justify-content: flex-end;

      img {
        border-radius: 50%;
        height: 57px;
        width: 57px;
      }
    }
  }
}

</style>
