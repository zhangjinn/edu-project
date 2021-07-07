<template>
  <div class="userCenter">
    <div class="conTop">
      <div class="imgBox">
        <img src="../../../../assets/images/mine/topBg.png">
      </div>
      <div class="mineContainer" @click="goPersonInfoPage">
        <div class="leftBox">
          <div class="userImg">
            <img :src="user.avatar || defaultAvatar">
          </div>
          <div class="msg textLeft">
            <div class="name">{{ user.accountName }}</div>
            <div class="phone">{{ transferPhone(user.telephone) }}</div>
          </div>
        </div>
        <div class="toRight">
          <span class="iconfont iconright" />
        </div>
      </div>
    </div>
    <div class="dataCard">
      <div class="card" @click="toView">
        <van-row>
          <van-col :span="8">
            <div class="count">0</div>
            <div class="text">动态</div>
          </van-col>
          <van-col :span="8">
            <div class="count">0</div>
            <div class="text">喜欢我</div>
          </van-col>
          <van-col :span="8">
            <div class="count">0</div>
            <div class="text">收藏</div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="menuList">
      <div class="listBox">
        <div class="list" @click="goSwitchOrganizationPage">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/organization.png">
            </div>
            <div class="listText">切换机构</div>
          </div>
          <div class="listRight">
            <span class="organizationName">{{ organization.name }}</span>
            <span class="iconfont iconright" />
          </div>
        </div>
      </div>
      <div class="listBox">
        <div class="list" @click="goDigitalCard">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/businessCard.png">
            </div>
            <div class="listText">个人名片</div>
          </div>
          <div class="listRight">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="list" @click="goPersonInfoPage">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/personalMessage.png">
            </div>
            <div class="listText">个人信息</div>
          </div>
          <div class="listRight">
            <span class="iconfont iconright" />
          </div>
        </div>
      </div>
      <div class="listBox">
        <div class="list" @click="goChangePasswordPage">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/safety.png">
            </div>
            <div class="listText">修改密码</div>
          </div>
          <div class="listRight">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="list" @click="toService">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/customerService.png">
            </div>
            <div class="listText">我的客服</div>
          </div>
          <div class="listRight">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="list" @click="toAbout">
          <div class="listLeft">
            <div class="listImg">
              <img src="../../../../assets/images/mine/about.png">
            </div>
            <div class="listText">关于</div>
          </div>
          <div class="listRight">
            <span class="iconfont iconright" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setLoginInfo, getPhone } from '@/js/localStore'
import { getPerInfo } from '@/service/base/mine'
import { getOrgMsg } from '@/js/organization'
import defaultAvatar from '@/assets/images/defaultAvatar.png'

export default {
  name: 'Mine',
  data() {
    return {
      loginInfo: {},
      user: {},
      userImg: '',
      organization: {},
      defaultAvatar
    }
  },
  created() {
    this.getUserInfo()
    this.organization = getOrgMsg()
  },
  methods: {
    getUserInfo() {
      getPerInfo().then(res => {
        this.user = res.data.data
        this.user.telephone = this.user.telephone || getPhone()
        this.loginInfo.name = this.user.accountName
        this.loginInfo.id = this.user.accountId
        this.loginInfo.icon = this.user.avatar
        setLoginInfo(this.loginInfo)
      })
    },
    transferPhone(phone) {
      if (phone) {
        phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
      return phone
    },
    getRole(list) {
      if (!list || !list.length) return '暂无岗位'
      let role = ''
      list.forEach((item, index) => {
        if (index === 0) {
          role += item
        } else {
          role += '、' + item
        }
      })
      return role
    },
    goPersonInfoPage() {
      this.$router.push({
        path: '/personInfo'
      })
    },
    goDigitalCard() {
      this.$router.push({
        path: '/digitalCard'
      })
    },
    toView() {
      this.$dialog.alert({
        title: '敬请期待',
        confirmButtonColor: '#10c2c4'
      })
    },
    goChangePasswordPage() {
      this.$router.push({
        path: '/changePassword'
      })
    },
    goSwitchOrganizationPage() {
      this.$router.push({
        path: '/switchOrganization'
      })
    },
    toService() {
      this.$router.push({
        path: '/customerService'
      })
    },
    toAbout() {
      this.$router.push({
        path: '/about'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.userCenter {
  .conTop {
    position: relative;
    padding: 30px 12px;

    .imgBox {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .mineContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;

      .leftBox {
        display: flex;
      }

      .userImg {
        @include round(54px);
        border: .5px solid $white;
        overflow: hidden;
      }

      .msg {
        margin-left: 12px;
        color: $white;

        .name {
          font-size: 17px;
        }

        .phone {
          margin-top: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.98);
        }
      }

      .toRight {
        .iconright {
          font-size: 12px;
          color: $white;
        }
      }
    }
  }

  .dataCard {
    position: relative;
    z-index: 1;
    padding: 0 12px;

    .card {
      padding: 24px 0;
      background-color: $white;
      @include border-radius(8px);

      ::v-deep .van-col:not(:last-child) {
        position: relative;

        &::before {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 15px;
          content: '';
          width: .5px;
          height: 21px;
          background-color: $text-e;
        }
      }

      .count {
        font-size: 19px;
      }

      .text {
        margin-top: 8px;
        font-size: 13px;
        color: $text-6;
      }
    }
  }

  .menuList {
    padding: 16px 12px;

    .listBox {
      background-color: $white;
      border-radius: 8px;

      &:not(:first-child) {
        margin-top: 16px;
      }

      .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 17.5px 12px;

        &:not(:first-child) {
          position: relative;

          &::after {
            display: inline-block;
            position: absolute;
            top: 0;
            left: 44px;
            right: 12px;
            content: '';
            height: .5px;
            background-color: $text-e;
          }
        }

        .listLeft {
          display: flex;
          align-items: center;

          .listImg {
            width: 20px;
          }

          .listText {
            margin-left: 12px;
          }
        }

        .listRight {
          .organizationName {
            margin-right: 12px;
            color: $text-9;
            font-size: 13px;
          }

          .iconfont {
            font-size: 12px;
            color: $text-9;
          }
        }
      }
    }
  }
}
</style>
