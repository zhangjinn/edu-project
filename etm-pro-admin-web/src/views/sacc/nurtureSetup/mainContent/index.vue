<template>
  <div class="nurtureSetup">
    <etm-layout-split>

      <el-form ref="nurtureTextForm" label-width="312px" class="mainForm">
        <etm-title style="display: none">公众号授权</etm-title>
        <el-form-item style="display: none" class="auth-box">
          <el-button type="success" @click="toAuth"><i class="iconfont iconwechat-fill" />微信授权</el-button>
          <el-link @click="toDesc">操作说明</el-link>
        </el-form-item>

        <etm-title>配置公众号菜单指导</etm-title>
        <el-form-item label="家长端地址:">
          <el-input id="success_form_input" v-model="nurtureLink" readonly="readonly" />
        </el-form-item>
        <el-form-item>
          <el-button
            ref="copyLinkChild"
            class="copyLinkChild"
            data-clipboard-action="copy"
            type="primary"
            data-clipboard-target="#success_form_input"
            @click="copyLink"
          >复制</el-button>
        </el-form-item>
      </el-form>
    </etm-layout-split>

  </div>
</template>

<script>
import { getNurtureLink } from '@/api/sacc'
import { getWechatAuthURL } from '@/api/base'

export default {
  name: 'Index',
  components: {

  },
  data() {
    return {
      nurtureLink: ''
    }
  },
  created() {
    this.getLink()
  },
  methods: {
    getLink() {
      getNurtureLink().then(res => {
        this.nurtureLink = res.data
      })
    },
    copyLink() {
      const _this = this
      const clipboard = new _this.$clipboard('.copyLinkChild')
      clipboard.on('success', function() {
        _this.$message({
          message: '复制成功！',
          type: 'success'
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', function() {
        _this.$message({
          message: '复制失败，请手动选择复制！',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    toAuth() {
      getWechatAuthURL({ redirectUrl: location.href })
    },
    toDesc() {
      const img = require('../../../../assets/images/auth-nurture.png')
      this.$alert(`<img style="width: 100%;" src="${img}">`, `操作说明`, {
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .nurtureSetup {
    & /deep/.EtmTitle-wrap{
      .text{
        border: 0;
      }
    }
    .mainForm{
      width: 70%;
      max-width: 912px;
      & /deep/ .el-input{
        width: 100%;
      }
      .auth-box {
        & /deep/ .el-form-item__content{
          line-height: 24px;
          > .el-button {
            padding: 9px 14px;
          }
          >.el-link {
            margin-left: 10px;
          }
        }

      }
    }
  }
</style>
