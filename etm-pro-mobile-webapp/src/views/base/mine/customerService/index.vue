<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">我的客服</etm-mobile-title>
    <div class="serviceContent">
      <div class="serviceBox">
        <div class="img">
          <img src="../../../../assets/images/mine/serviceBg.png">
        </div>
        <div class="text">
          <p>疑难解答</p>
          <p>服务更安心</p>
        </div>
      </div>
      <div class="telephoneBox">
        服务热线：400-0313-400
      </div>
      <div class="btnBox">
        <div class="btn" @click="contactConfirm">
          <span class="iconfont iconbodadianhua" />
          <span class="btnText">联系客服</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import EtmMobileTitle from '@/components/EtmMobileTitle'

/**
 * index create by Administrator
 * createTime 2020/11/20 10:00
 */
export default {
  name: 'Index',
  components: { EtmMobileTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    reback() {
      this.$router.back(-1)
    },
    contactConfirm() {
      this.showContact = false
      const a = document.createElement('a')
      a.href = 'tel:400-0313-400'
      a.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  height: 100%;
  background-color: $white;

  .serviceContent {
    padding-top: 94.5px;

    .serviceBox {
      position: relative;

      .img {
        margin: 0 auto;
        width: 225px;
      }

      .text {
        position: absolute;
        top: 38px;
        left: 0;
        right: 0;
        color: $theme;
        font-size: 24px;

        p {
          line-height: 24px;

          + p {
            margin-top: 12px;
          }
        }
      }
    }

    .telephoneBox {
      margin-top: 50px;
      font-size: 16px;
    }

    .btnBox {
      margin-top: 24px;

      .btn {
        margin: 0 auto;
        width: 260px;
        height: 48px;
        line-height: 48px;
        color: $white;
        border-radius: 24px;
        background-color: $theme;
        box-shadow: 0px 3px 16px 0px rgba(16, 194, 196, 0.3);

        .iconfont {
          font-size: 15px;
        }

        .btnText {
          margin-left: 5px;
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
