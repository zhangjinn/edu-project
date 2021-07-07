<template>
  <div class="edit-wrap">
    <setting-title no-setting @backTo="$router.back()">
      <span>我的名片</span>
    </setting-title>

    <div class="card">

      <div class="header">
        <Card :select-style="selectStyle" :user-info="userInfo" :select-area="selectArea" />
      </div>

      <div class="switch">
        <div class="title">选择名片样式</div>
        <div class="switchStyle">
          <div
            v-for="(item) in switchStyleList"
            :key="item.src"
            class="item"
            :class="{switchActive:selectStyle === item.style}"
            @click="switchStyle(item.style)"
          >
            <img :src="item.src">
            <img
              v-if="selectStyle === item.style"
              src="../../../assets/images/daycare/digitalCardSelect.png"
              class="selected"
            >
          </div>
        </div>
        <div class="switchName">
          <div v-for="item in switchStyleList" :key="item.name">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="edit">
        <div class="title">个人信息</div>
        <div class="edit-content">
          <van-field v-model="userInfo.businessCardName" label="姓名" required placeholder="请输入姓名" />
          <van-field v-model="userInfo.organizationName" label="企业" placeholder="请输入企业名称" maxlength="20" />
          <!--          <van-field v-model="userInfo.organizationAddress" label="企业地址" placeholder="请输入省市区" />-->
          <van-cell class="cell" title="企业地址" :value="selectArea" @click="showPop" />
          <van-field v-model="userInfo.organizationDetailedAddress" label="详细地址" placeholder="请输入详细地址" />
          <van-field v-model="userInfo.position" label="岗位" placeholder="请输入岗位名称" />
          <van-field
            v-model="userInfo.telephone"
            label="手机号"
            required
            placeholder="请输入手机号码"
            type="tel"
            maxlength="11"
          />
          <van-field v-model="userInfo.wechatNumber" label="微信号" placeholder="请输入微信号" />
        </div>
      </div>

      <div class="intro">
        <div class="title">介绍</div>
        <div class="intro-content">
          <van-field
            v-model="userInfo.introduction"
            rows="2"
            type="textarea"
            placeholder="请输入留言"
            maxlength="200"
            autosize
            show-word-limit
          />
        </div>
      </div>

      <div class="footer">
        <control-btn type="newtheme" text="更新名片" @click.native="updateCard(userInfo.businessCardId)" />
      </div>

      <van-popup v-model="areaPopup" position="bottom" :style="{height:'50%'}">
        <van-area title="省市区选择" :value="selectArea" :area-list="areaList" @confirm="confirmArea" />
      </van-popup>
    </div>
  </div>
</template>

<script>
/**
 * edit create by Administrator
 * createTime 2020/11/23 16:01
 */
import settingTitle from './components/settingTitle'
import ControlBtn from '@/components/common/controlBtn'
import Card from './components/card'
import { queryDigitalCard, updateDigitalCard, createDigitalCard, queryAreaInfoByAreaId } from '@/service/daycare/digitalCard'
import { Toast } from 'vant'
import areaList from './Area'

export default {
  name: 'Edit',
  components: {
    ControlBtn,
    settingTitle,
    Card
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      areaList: areaList,
      areaPopup: false,
      selectStyle: 1,
      Imageavatar: require('../../../assets/images/daycare/dailyDont_like.png'),
      activeStyle: 1,
      switchStyleList: [
        {
          src: require('../../../assets/images/daycare/firstType.png'),
          name: '简约模板',
          style: 1
        },
        {
          src: require('../../../assets/images/daycare/secondType.png'),
          name: '商务模板',
          style: 2
        },
        {
          src: require('../../../assets/images/daycare/thirdType.png'),
          name: '办公模板',
          style: 3
        },
        {
          src: require('../../../assets/images/daycare/fourthType.png'),
          name: '清新模板',
          style: 4
        }
      ],
      userInfo: { // 用户信息
        businessCardId: '',
        avatar: '',
        businessCardName: '',
        organizationName: '',
        organizationAddress: '',
        organizationDetailedAddress: '',
        position: '',
        telephone: '',
        wechatNumber: '',
        introduction: ''
      },
      provinceName: '',
      cityName: '',
      countyName: '',
      selectArea: '请选择省市区'
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
      await queryDigitalCard().then(res => {
        const content = res.data.data
        for (const key in content) {
          if (content[key] === null) {
            content[key] = ''
          }
        }
        this.userInfo = content
      })
      // console.log(this.userInfo.organizationAddress)
      this.queryArea(this.userInfo.organizationAddress)
    },
    queryArea(areaId) {
      // console.log(areaId, 'areaId')
      queryAreaInfoByAreaId({ areaId }).then(res => {
        // console.log(res, 'res')
        const area = res.data.data
        if (area.provinceName === area.cityName) {
          this.selectArea = `${area.provinceName}${area.countyName}`
        } else {
          this.selectArea = `${area.provinceName}${area.cityName}${area.countyName}`
        }
      })
    },
    switchStyle(selectStyle) {
      this.selectStyle = selectStyle
    },
    async updateCard(businessCardId) {
      // 新增
      if (!this.userInfo.businessCardName) {
        Toast({
          message: '请输入您的姓名',
          duration: 1000
        })
        return
      }

      if (!this.userInfo.telephone) {
        Toast({
          message: '请输入您的电话',
          duration: 1000
        })
        return
      }

      if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.userInfo.telephone))) {
        Toast({
          message: '手机号码格式错误',
          duration: 1000
        })
        return
      }

      const params = {}
      params.avatar = this.userInfo.avatar
      params.businessCardName = this.userInfo.businessCardName
      params.organizationName = this.userInfo.organizationName
      params.organizationAddress = this.userInfo.organizationAddress
      params.organizationDetailedAddress = this.userInfo.organizationDetailedAddress
      params.position = this.userInfo.position
      params.telephone = this.userInfo.telephone
      params.wechatNumber = this.userInfo.wechatNumber
      params.introduction = this.userInfo.introduction
      // console.log(params, 'params')
      if (!businessCardId) {
        await createDigitalCard(params).then(res => {
          if (res.code === 0) {
            setTimeout(() => {
              Toast.success({
                message: '更新成功',
                duration: 500
              })
            })
          }
        })
        this.init()
        this.$router.replace({
          path: '/digitalCard',
          query: {
            selectStyle: this.selectStyle
          }
        })
      } else {
        params.businessCardId = businessCardId
        await updateDigitalCard(params).then(res => {
          if (res.code === 0) {
            setTimeout(() => {
              Toast.success({
                message: '更新成功',
                duration: 500
              })
            })
          }
          this.$router.replace({
            path: '/digitalCard',
            query: {
              selectStyle: this.selectStyle
            }
          })
        })
        this.init()
      }
    },
    showPop() {
      this.areaPopup = true
    },
    confirmArea(e) {
      this.provinceName = e[0].name
      this.cityName = e[1].name
      this.countyName = e[2].name
      if (this.provinceName === this.cityName) {
        this.selectArea = `${this.provinceName}${this.countyName}`
      } else {
        this.selectArea = `${this.provinceName}${this.cityName}${this.countyName}`
      }
      // this.selectArea = `${this.provinceName}${this.cityName}${this.countyName}`
      this.userInfo.organizationAddress = e[2].code
      // console.log(e, 'e')
      this.areaPopup = false
    }
  }
}
</script>
<style lang="scss" scoped>
//商务风风格样式
.headerBackground2 {
  color: #F8CA7D;
  display: flex;
  flex-direction: column;
  width: 334px;
  height: 186px;
  background-image: url("../../../assets/images/daycare/businessStyle.png");
  margin: 10px auto;
  justify-content: space-between;

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
    padding-bottom: 17px;
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
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

}

// 选择名片样式
.switch {
  margin: 15px 22px 0;

  .title {
    text-align: left;
  }

  .switchStyle {
    display: flex;
    justify-content: space-around;
    //flex-direction: column;
    margin-top: 15px;

    .selected {
      position: absolute;
      width: 17px;
      height: 17.5px;
      bottom: 1%;
      right: -1%;
    }

    .item {
      position: relative;

      img {

      }
    }
  }

  .switchActive {
    border: 1px solid #10C2C4;
    //:after{
    //  background-image: url("");
    //}
  }

  .switchName {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
    margin-top: 10px;
  }
}

// 个人信息修改
.edit {
  //margin-top: 10px;
  background: white;
  width: 87%;
  margin: 20px auto 0;
  border-radius: 8px;

  .title {

    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #222222;
    text-align: left;
    padding: 14px;
    border-bottom: 1px solid #EEEEEE;
  }
}

.intro {
  background: white;
  width: 87%;
  margin: 10px auto 14px;
  border-radius: 8px;

  .title {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #222222;
    text-align: left;
    padding: 14px;
    border-bottom: 1px solid #EEEEEE;
  }
}

.footer {
  width: 95%;
  margin: 0 auto;
  position: relative;
  padding: 10px;
}

/deep/ .van-field__label {
  width: 75px !important;
}

/deep/ .cell .van-cell__title {
  flex: 0.35 !important;
}

/deep/ .cell .van-cell__value {
  text-align: left;
  color: black;
  font-size: 15px;
  display: flex;
}
</style>
