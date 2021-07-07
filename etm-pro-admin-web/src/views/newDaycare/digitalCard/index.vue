<template>
  <div class="digital-wrap">
    <etm-main-body>
      <EtmLayoutSplit class="split">
        <div slot="left" class="leftBox">
          <!--          <etm-title>电子名片</etm-title>-->
          <img :src="imgSrc">
          <!--          <div class="tips">页面效果</div>-->
          <div class="img">
            <div
              class="digitalCard-top"
            >
              <Header ref="digitalCard" :select-style="selectStyle" :user-info="userInfo" :select-area="selectArea" />
            </div>
            <div class="middle">
              <div class="title">介绍</div>
              <div class="desc">
                {{ userInfo.introduction }}
              </div>
            </div>
            <div class="footer-card">
              <div class="footer-title">
                切换名片样式
              </div>
              <div class="footer-card-item">
                <div class="footer-item">
                  <div class="img-box">
                    <img
                      src="../../../assets/images/daycare/firstType.png"
                      :class="{selectActive:selectStyle === 1}"
                      @click="switchStyle(1)"
                    >
                    <span v-if="selectStyle === 1" class="selectIcon iconfont iconxuanzhong1" />
                  </div>
                  <!--                  <span>简洁风</span>-->
                </div>
                <div class="footer-item">
                  <div class="img-box">
                    <img
                      src="../../../assets/images/daycare/secondType.png"
                      :class="{selectActive:selectStyle === 2}"
                      @click="switchStyle(2)"
                    >
                    <div v-if="selectStyle === 2" class="selectIcon iconfont iconxuanzhong1" />
                  </div>
                  <!--                  <span>商务风</span>-->
                </div>
                <div class="footer-item">
                  <div class="img-box">
                    <img
                      src="../../../assets/images/daycare/thirdType.png"
                      :class="{selectActive:selectStyle === 3}"
                      @click="switchStyle(3)"
                    >
                    <div v-if="selectStyle === 3" class="selectIcon iconfont iconxuanzhong1" />
                  </div>
                  <!--                  <span>办公风</span>-->
                </div>
                <div class="footer-item">
                  <div class="img-box">
                    <img
                      src="../../../assets/images/daycare/fourthType.png"
                      :class="{selectActive:selectStyle === 4}"
                      @click="switchStyle(4)"
                    >
                    <div v-if="selectStyle === 4" class="selectIcon iconfont iconxuanzhong1" />
                  </div>
                  <!--                  <span>清新风</span>-->
                </div>
              </div>
              <div class="footer-card-desc">
                <span>简洁风</span>
                <span>商务风</span>
                <span>办公风</span>
                <span>清新风</span>
              </div>
            </div>
          </div>
        </div>

        <div slot="right" class="rightBox">
          <!--          <etm-title>{{ isEdit ? '编辑名片' : '名片详情' }}</etm-title>-->
          <div class="container">
            <el-row v-if="isEdit" class="row">
              <el-col :span="24">
                <etm-form type="dialog">
                  <el-form-item label="头像">
                    <etm-upload-avatar
                      v-model="userInfo.avatar"
                      :resource-name="'basic/account'"
                      media-type="image"
                      @success="success"
                    />
                  </el-form-item>
                  <el-form-item class="name" label="姓名">
                    <el-input v-model="userInfo.businessCardName" placeholder="请输入姓名" />
                  </el-form-item>
                  <el-form-item label="企业">
                    <el-input v-model="userInfo.organizationName" maxlength="14" placeholder="请输入企业名" />
                  </el-form-item>
                  <el-form-item label="企业地址">
                    <etm-address
                      v-model="userInfo.organizationAddress"
                      :area-id="userInfo.organizationAddress"
                      @getareaname="getAreaName"
                    />
                  </el-form-item>

                  <el-form-item label="详细地址">
                    <el-input v-model="userInfo.organizationDetailedAddress" maxlength="28" />
                  </el-form-item>
                  <el-form-item label="岗位">
                    <el-input v-model="userInfo.position" />
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="userInfo.telephone" />
                  </el-form-item>
                  <el-form-item label="微信号">
                    <el-input v-model="userInfo.wechatNumber" />
                  </el-form-item>
                  <el-form-item label="介绍">
                    <el-input v-model="userInfo.introduction" type="textarea" maxlength="200" show-word-limit autosize />
                  </el-form-item>
                </etm-form>

                <div class="btn-footer">
                  <el-button type="primary" @click="updateCard(userInfo.businessCardId)">更新名片</el-button>
                  <el-button type="plain" @click="cancel">取消</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row v-else class="row">
              <el-col :span="24">
                <etm-form type="dialog">
                  <el-form-item label="头像">
                    <img :src="userInfo.avatar">
                  </el-form-item>
                  <el-form-item class="name" label="姓名">
                    {{ userInfo.businessCardName }}
                  </el-form-item>
                  <el-form-item label="企业">
                    {{ userInfo.organizationName }}
                  </el-form-item>
                  <el-form-item label="企业地址">
                    {{ `${selectArea}${userInfo.organizationDetailedAddress}` }}

                    <!--                    <etm-address-->
                    <!--                      v-model="userInfo.organizationAddress"-->
                    <!--                      :disabled="true"-->
                    <!--                      :area-id="userInfo.organizationAddress"-->
                    <!--                    />-->
                  </el-form-item>
                  <!--                  <el-form-item label="详细地址">-->
                  <!--                    {{ userInfo.organizationDetailedAddress }}-->
                  <!--                  </el-form-item>-->
                  <el-form-item label="岗位">
                    {{ userInfo.position }}
                  </el-form-item>
                  <el-form-item label="手机号">
                    {{ userInfo.telephone }}
                  </el-form-item>
                  <el-form-item label="微信号">
                    {{ userInfo.wechatNumber }}
                  </el-form-item>
                  <el-form-item label="介绍">
                    {{ userInfo.introduction }}
                  </el-form-item>
                </etm-form>

                <div class="btn-footer">
                  <el-button type="primary" @click="editCard">编辑名片</el-button>
                  <el-button class="second" type="plain" @click="download">生成图片</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </EtmLayoutSplit>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/11/19 17:01
 */
// import areaSelect from '@/views/daycare/digitalCard/components/areaSelect'
import { createDigitalCard, queryDigitalCard, updateDigitalCard } from '@/api/newDaycare/digitalCard'
import { getUploadFilePrefix } from '@/api/base'
import { queryAreaInfoByAreaId } from '@/api/base/base'
import EtmUploadAvatar from '@/components/EtmUploadAvatar/index'
import html2canvas from 'html2canvas'
import Header from './components/header'
import EtmAddress from '@/views/base/org/EtmAddress'
// import { queryAreaInfoByAreaId } from '@/api/base/base'

export default {
  name: 'Index',
  components: {
    // areaSelect,
    EtmAddress,
    EtmUploadAvatar,
    Header
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      isEdit: false,
      userInfo: { // 用户信息
        businessCardId: '',
        avatar: require('../../../assets/images/daycare/img-cardCheck.png'),
        businessCardName: '',
        organizationName: '',
        organizationAddress: '',
        organizationDetailedAddress: '',
        position: '',
        telephone: '',
        wechatNumber: '',
        introduction: ''
      },
      selectStyle: 1,
      imgSrc: '',
      provinceName: '',
      cityName: '',
      countyName: '',
      selectArea: '',
      prefix: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.prefix = await getUploadFilePrefix()
      console.log(this.prefix, 'prefix')
      this.getCardData()

      // this.getAreaData(this.userInfo.organizationDetailedAddress)
    },
    async getCardData() {
      const params = {}
      await queryDigitalCard(params).then(res => {
        const content = res.data
        for (const key in content) {
          if (content[key] === null) {
            content[key] = ''
          }
        }
        if (content.avatar === '') {
          content.avatar = this.userInfo.avatar
        }
        this.userInfo = content
      })
      this.getAreaData(this.userInfo.organizationAddress)
    },
    getAreaData(areaId) {
      // console.log(areaId, '我是aeaid')
      queryAreaInfoByAreaId({ areaId }).then(res => {
        const area = res.data
        // console.log(res, 'ereearar')
        if (area.provinceName === area.cityName) {
          this.selectArea = `${area.provinceName}${area.countyName}`
        } else {
          this.selectArea = `${area.provinceName}${area.cityName}${area.countyName}`
        }
      })
    },
    updateCard(businessCardId) {
      const params = {}
      // console.log(this.userInfo.organizationAddress, 'address')
      params.avatar = this.userInfo.avatar
      params.businessCardName = this.userInfo.businessCardName
      params.organizationName = this.userInfo.organizationName
      params.organizationAddress = this.userInfo.organizationAddress
      params.organizationDetailedAddress = this.userInfo.organizationDetailedAddress
      params.position = this.userInfo.position
      params.telephone = this.userInfo.telephone
      params.wechatNumber = this.userInfo.wechatNumber
      params.introduction = this.userInfo.introduction
      // 新增名片
      // console.log(params, 'params')
      if (!businessCardId) {
        createDigitalCard(params).then(res => {
          if (res.code === 0) {
            this.$message.success('新增成功')
          } else {
            this.$message(res.message)
          }
          this.isEdit = false
          // console.log(res, '新增')
        })
      } else {
        // 更新名片
        params.businessCardId = this.userInfo.businessCardId
        updateDigitalCard(params).then(res => {
          // console.log(res, '更新')
          if (res.code === 0) {
            this.$message.success('更新成功')
          } else {
            this.$message(res.message)
          }
        })
        this.isEdit = false
      }
    },
    cancel() {
      this.isEdit = false
    },
    // 下载生成图片
    download() {
      // console.log(this.$refs)
      // const canvas = document.createElement('canvas')
      const digitalCard = this.$refs.digitalCard.$refs.header
      // console.log(digitalCard, ' dddddd')
      setTimeout(() => {
        html2canvas(digitalCard, {
          useCORS: true,
          backgroundColor: null
        }).then((canvas) => {
          const img = document.createElement('a')
          img.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
          // 下载的文件名字
          img.download = `file.jpg`
          img.click()
        })
      }, 500)
    },
    editCard() {
      this.isEdit = true
    },
    switchStyle(style) {
      this.selectStyle = style
    },
    success(hash, key, url) {
      // const qiniuUrl = 'http://qiniu.etmpro.etmcn.com/'
      this.userInfo.avatar = this.prefix + key
      // this.avatarImg =
    },
    getAreaName(e) {
      this.provinceName = e.provinceName
      this.cityName = e.cityName
      this.countyName = e.countyName
      if (this.provinceName === this.cityName) {
        this.selectArea = `${this.provinceName}${this.countyName}`
      } else {
        this.selectArea = `${this.provinceName}${this.cityName}${this.countyName}`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .rightBox {
  margin-top: 40px;
}

.img {
  width: 388px;
  height: 727px;
  background-image: url("../../../assets/images/daycare/digitalCardBg.png");
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;

  .headerBackground {
    width: 334px;
    height: 186px;
    background-image: url("../../../assets/images/daycare/digitalBackground.png");
  }

  .headerBackground2 {
    width: 334px;
    height: 186px;
    background-image: url("../../../assets/images/daycare/businessStyle.png");
  }

  .headerBackground3 {
    width: 334px;
    height: 186px;
    background: #2C2829;;
  }

  .headerBackground4 {
    width: 334px;
    height: 186px;
    background-image: url("../../../assets/images/daycare/freshStyle.png");

  }

  .header {
    //width: 90%;
    //height: 182px;
    padding-right: 2px;
    margin: 50px auto 5px;
    border-radius: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .top {
      width: 100%;
      display: flex;
      justify-content: space-around;

      .left-main {
        z-index: 9999;
        display: flex;
        justify-content: center;
        font-weight: 400;
        color: #ffffff;
        box-sizing: border-box;
        align-items: center;
        flex-basis: 50%;

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
        }

      }
    }

    .right-main {
      img {
        width: 40px;
        height: 40px;
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
          font-size: 12px;
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
    width: 334px;
    height: 186px;
    background: white;
    margin: 10px auto;
    padding: 13px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    flex-basis: 33%;
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

  .footer {
    border-radius: 22px;
    padding: 50px;
    width: 95%;
    height: 100px;
    margin: 0 auto;
  }
}

.tips {
  font-size: 14px;
  color: #222;
  text-align: center;
  margin: 10px;
}

.container {
  .row {
    box-sizing: border-box;
    padding: 10px 20px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

}

.footer-card {
  //padding: 0 50px;
  //padding: 80px 0 20px 120px;
  width: 97%;
  height: 162px;
  margin: 0 auto;
  position: relative;
  top: 4%;
  border-bottom-left-radius: 49px;
  border-bottom-right-radius: 49px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .footer-title {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    padding-left: 16px !important;
    margin-bottom: 10px;
  }

  .footer-card-item {
    display: flex;
    justify-content: space-around;

    .footer-item {
      flex-basis: 20%;
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #555555;

      .img-box {
        position: relative;
      }

      .selectIcon {
        @include etm-color();
        position: absolute;
        bottom: 15.6%;
        right: -1.8%;
        width: 17px;
        height: 17px;
      }
    }
  }

  .footer-card-desc {
    display: flex;
    justify-content: space-around;
    position: relative;
    bottom: 5%;

    span {
      flex-basis: 20%;
      text-align: center;
    }
  }
}

.btn-footer {
  padding: 50px 50px 50px 114px;
  .second{
    margin-left: 11px;
  }
  ::v-deep .el-button--small {
    margin-left: 16px;
  }
}

.selectActive {
  @include etm-bdc();
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
}

::v-deep .name .etm-purple .el-form-item--small .el-form-item__label {
  padding-top: 5px !important;
}

::v-deep .split .layout-left {
  min-width: 425px !important;
}
</style>
