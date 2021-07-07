<template>
  <div class="userName">
    <etm-mobile-title @reback="reback">
      修改姓名
      <span slot="right" @click="confirm">保存</span>
    </etm-mobile-title>
    <van-cell-group :border="false">
      <van-field
        ref="inputDom"
        v-model="name"
        placeholder="请输入用户名"
        clearable
        :class="active === 1 ? 'focusBorder' : ''"
        @focus="addClass(1)"
        @blur="removeClass"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { setLoginInfo } from '@/js/localStore'
import { putPerInfo, getPerInfo } from '@/service/base/mine'
import { replaceSpace } from '@/js/rules'
import EtmMobileTitle from '@/components/EtmMobileTitle'

export default {
  name: 'ChangeUserName',
  components: {
    EtmMobileTitle
  },
  data() {
    return {
      user: {},
      name: '',
      img: '',
      active: 0
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.getUser()
  },
  mounted() {
  },
  methods: {
    addClass(i) {
      this.active = i
    },
    removeClass() {
      this.active = 0
      this.name = replaceSpace(this.name)
    },
    getUser() {
      getPerInfo().then(res => {
        this.user = res.data.data
        this.name = this.user.accountName
        this.img = this.user.avatar
        this.$refs.inputDom.focus()
      })
    },
    reback() {
      this.$router.back(-1)
    },
    confirm() {
      if (this.name) {
        const param = {
          accountName: this.name,
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
          setTimeout(() => {
            this.reback()
          }, 1000)
          this.user.name = this.name
          setLoginInfo(this.user)
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.userName {
  .van-cell {
    padding: 20px 16px;
  }

  .van-cell::after {
    left: 16px !important;
    right: 16px !important;
  }
}
</style>
