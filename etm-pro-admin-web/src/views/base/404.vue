<template>
  <div class="wscn-http404-container">
    <navbar />
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
      </div>
      <div class="tip_404">
        您没有权限访问当前组织，请<span>切换组织</span>或返回首页~
      </div>
      <div class="btn">
        <el-button plain @click="backTo">
          <span class="iconfont iconundo" />
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { removeAllInfo } from '@/utils/auth'
import Navbar from '@/layout/components/Navbar'

export default {
  name: 'Page404',
  components: { Navbar },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  methods: {
    clearData() {
      removeAllInfo()
    },
    backTo() {
      this.$router.replace({
        path: '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wscn-http404-container {
    .wscn-http404{
      padding: 200px;
      height: calc(100vh - 56px);
      @include bgc_white();
      .pic-404 {
        margin: 0 auto;
        text-align: center;
      }
      .tip_404 {
        margin-top: 40px;
        font-size: 16px;
        text-align: center;
        @include c_text_color();
        span{
          font-size: 16px;
          @include c_main_color();
        }
      }
    }
    .btn{
      margin-top: 24px;
      text-align: center;
    }
  }

</style>
