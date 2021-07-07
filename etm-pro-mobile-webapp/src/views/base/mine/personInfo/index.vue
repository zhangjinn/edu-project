<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">个人信息</etm-mobile-title>
    <div class="rowInfo">
      <div class="Info">
        <van-cell-group :border="false">
          <van-cell
            title="头像"
            is-link
          >
            <div class="userImg">
              <van-uploader ref="upload" :after-read="afterRead">
                <img v-if="imgUrl" :src="imgUrl">
                <div v-else class="noImg" />
              </van-uploader>
            </div>
          </van-cell>
          <van-field
            v-model="user.accountName"
            input-align="right"
            right-icon="arrow"
            label="姓名"
            readonly
            @click="changeUserName"
          />
          <van-field
            v-model="user.organizationName"
            class="notArrow"
            input-align="right"
            label="企业"
            disabled
          />
          <van-cell class="notArrow" title="企业地址">
            <div class="disabledText">{{ address }}</div>
          </van-cell>
          <van-cell class="notArrow" title="岗位">
            <div class="disabledText">{{ user.posts }}</div>
          </van-cell>
          <van-field
            v-model="user.telephone"
            class="notArrow"
            input-align="right"
            label="手机号"
            disabled
          />
        </van-cell-group>
      </div>
    </div>
    <div v-show="!isWechat" class="bottomFixed">
      <div class="bottomBtn">
        <div class="btn" @click="logout">
          <control-btn text="退出当前账号" type="warn" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { putPerInfo, getPerInfo } from '@/service/base/mine'
import { logout } from '@/service/base/login'
import controlBtn from '@/components/common/controlBtn'
import { getPhone, getToken, userLogout } from '@/js/localStore'
import { uploadFile } from '@/service/upload'
import defaultAvatar from '@/assets/images/defaultAvatar.png'
import EtmMobileTitle from '@/components/EtmMobileTitle'
import { queryAreaByCode } from '@/service/base/basic'

export default {
  name: 'PersonInfo',
  components: {
    EtmMobileTitle,
    controlBtn
  },
  data() {
    return {
      user: {},
      img: '',
      imgUrl: '',
      changeImg: '',
      address: '',
      defaultAvatar
    }
  },
  computed: {
    isWechat() {
      return localStorage.getItem('platform') === 'wechat'
    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.backPage, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backPage, false)// false阻止默认事件
  },
  methods: {
    getUserInfo() {
      getPerInfo().then(res => {
        this.user = res.data.data
        this.user.telephone = this.user.telephone || getPhone()
        this.img = this.user.avatar
        this.imgUrl = this.user.avatar || this.defaultAvatar
        this.user.posts = this.getPostName(this.user.postNames)
        this.getArea()
      })
    },
    getArea() {
      if (this.user.enterpriseAreaCode) {
        queryAreaByCode({ code: this.user.enterpriseAreaCode }).then(res => {
          const area = res.data.data
          const address = area.provinceName + area.cityName + area.countyName
          if (this.user.enterpriseAddress) {
            this.address = address + this.user.enterpriseAddress
          } else {
            this.address = address
          }
        })
      } else {
        this.address = this.user.enterpriseAddress
      }
    },
    getPostName(post) {
      if (!post) {
        return post
      } else {
        let str = ''
        post.forEach((item, index) => {
          if (index === 0) {
            str += item
          } else {
            str += '、' + item
          }
        })
        return str
      }
    },
    afterRead(file) {
      uploadFile(file.file, 'mine/user/userSetting', 'image').then(res => {
        this.img = res.data.key
        this.imgUrl = file.content
        this.putInfo()
      })
    },
    putInfo() {
      const param = {
        accountName: this.user.accountName,
        avatar: this.img
      }
      putPerInfo(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '修改成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
      })
    },
    changeUserName() {
      this.$router.push({
        path: '/changeUserName'
      })
    },
    logout() {
      this.$dialog.confirm({
        title: '确认退出？',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        logout(getToken()).then(() => {
          userLogout()
          this.$store.commit('route/SET_ROUTER', false)
          this.$router.replace({
            path: '/passwordLogin'
          })
        })
      }).catch(() => {
        // onCancel
      })
    },
    backPage() {
      this.$router.replace({
        path: '/mine'
      })
    },
    reback() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-wrap {
  .rowInfo {
    .van-cell {
      padding: 20px 12px;
    }

    .van-cell::after {
      left: 12px !important;
      right: 12px !important;
    }

    ::v-deep .van-cell__title {
      flex: none;
      width: 130px;
    }

    ::v-deep .van-cell__value {
      position: relative;
      overflow: visible;

      .userImg {
        position: absolute;
        right: 0;
        top: -5.5px;
        @include round(35px);
        overflow: hidden;

        img {
          @include wh(35px, 35px);
        }

        .noImg {
          @include wh(35px, 35px);
          background-color: #DFDFDF;
        }
      }

      .van-field__control:disabled {
        color: $text-c !important;
      }

      .disabledText {
        color: $text-c;
        font-size: 15px;
      }

      .editText {
        color: $black;
        font-size: 15px;
      }
    }

    .notArrow {
      padding-right: 36px;
    }
  }

  .bottomFixed {
    .bottomBtn {
      bottom: 0;
      background-color: transparent;
    }
  }
}

</style>
