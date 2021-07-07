<template>
  <div class="systemSetting">
    <etm-main-body>
      <EtmLayoutSplit>
        <div slot="left" class="leftBox">
          <etm-title>{{ $t('systemSetting.systemSetting') }}</etm-title>
          <div class="tips">家长端页面效果</div>
          <div class="img">
            <img src="../../../../assets/images/phonePicture.png">
          </div>
        </div>
        <div slot="right" class="rightBox">
          <etm-title>{{ $t('systemSetting.steps') }}</etm-title>
          <div class="container">
            <div class="stepTitle">
              <span class="imgBox">
                <img src="../../../../assets/images/systemSetting/wechatPublic.png">
              </span>
              <span class="text">公众号家长端入口设置</span>
              <span class="iconBox">
                <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
                  <div slot="content">
                    <p>1、{{ $t('systemSetting.tipsOne') }}</p>
                    <p>2、{{ $t('systemSetting.tipsTwo') }}</p>
                    <p>3、{{ $t('systemSetting.tipsThree') }}</p>
                  </div>
                  <i class="iconfont iconquestion-circle" />
                </el-tooltip>
              </span>
            </div>
            <div class="stepList">
              <div class="steps">
                <div class="step">
                  <span>01.公众号菜单配置</span>
                </div>
                <el-button type="primary" class="btn" @click="openCarousel(1)">{{ $t('systemSetting.checkCourse') }}
                </el-button>
              </div>
              <div class="steps">
                <div ref="parentEl" class="step">
                  <span>02.{{ $t('systemSetting.stepsTwo') }}</span>
                  <el-tooltip :disabled="elOverflow" placement="bottom-start">
                    <div slot="content">
                      <p>{{ $t('systemSetting.stepsTwoTips') }}</p>
                    </div>
                    <span ref="labelEl" class="label">（{{ $t('systemSetting.stepsTwoTips') }}）</span>
                  </el-tooltip>
                </div>
                <el-button type="primary" class="btn" @click="toAuth">{{ $t('systemSetting.authorize') }}</el-button>
              </div>
              <div class="steps">
                <div ref="urlParent" class="step">
                  <span>03.{{ $t('systemSetting.stepsThree') }}</span>
                  <span ref="urlEl" class="label">（<span id="link_url" class="label">{{ wechatUrl }}</span>）</span>
                </div>
                <el-button
                  ref="copyLinkChild"
                  type="primary"
                  class="copyLinkChild btn"
                  data-clipboard-action="copy"
                  data-clipboard-target="#link_url"
                  @click="copyLink"
                >{{ $t('systemSetting.copyLink') }}
                </el-button>
              </div>
              <div class="steps">
                <div class="step">
                  <span>04.{{ $t('systemSetting.stepsFour') }}</span>
                  <span class="label">（{{ $t('systemSetting.stepsFourTips') }}）</span>
                </div>
                <el-button type="primary" class="btn" @click="openCarousel(2)">{{ $t('systemSetting.checkCourse') }}
                </el-button>
              </div>
            </div>
            <div class="previewCode">
              <div class="previewTitle">
                <span class="imgBox">
                  <img src="../../../../assets/images/systemSetting/scanning.png">
                </span>
                <span class="text">
                  <div class="title">{{ $t('systemSetting.pagePreview') }}</div>
                  <div class="subtitle">扫描下方二维码预览家长端首页效果</div>
                </span>
              </div>
              <div class="codeBox">
                <div class="code">
                  <div class="img">
                    <vue-qr v-if="wechatUrl" :text="wechatUrl" :logo-src="orgLogo" :size="150" :margin="10" />
                  </div>
                </div>
                <div class="text">{{ $t('systemSetting.wechatScan') }}</div>
              </div>
            </div>
          </div>
        </div>
      </EtmLayoutSplit>
      <div v-if="showCarousel" class="tutorial">
        <div class="carouselBox">
          <el-carousel :autoplay="false" :loop="false" arrow="always" height="570px">
            <el-carousel-item v-for="(item, index) in list" :key="index">
              <div class="innerBox">
                <span class="closeIcon iconfont iconclose" @click="closeCarousel" />
                <div class="count">
                  <span class="currentCount">0{{ item.count }}</span><span class="total">/0{{ list.length }}</span>
                </div>
                <div class="explanation" v-html="item.html" />
                <div class="imgBox">
                  <img :src="item.url" @click="openPreview(item.url)">
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div v-if="showImagePreview" class="imagePreview">
        <div class="previewBox">
          <span class="iconfont iconX" @click="closePreview" />
          <img :src="previewUrl">
        </div>
      </div>
    </etm-main-body>

  </div>
</template>

<script>
import VueQr from 'vue-qr'
import { getWechatAuthURL, saveWechatAuthInfo } from '@/api/base'
import authorize1 from '@/assets/images/systemSetting/authorize-1.png'
import authorize2 from '@/assets/images/systemSetting/authorize-2.png'
import authorize3 from '@/assets/images/systemSetting/authorize-3.png'
import authorize4 from '@/assets/images/systemSetting/authorize-4.png'
import authorize5 from '@/assets/images/systemSetting/authorize-5.png'
import authorize6 from '@/assets/images/systemSetting/authorize-6.png'
import message1 from '@/assets/images/systemSetting/message-1.jpg'
import message2 from '@/assets/images/systemSetting/message-2.png'
import message3 from '@/assets/images/systemSetting/message-3.png'
import message4 from '@/assets/images/systemSetting/message-4.png'
import message5 from '@/assets/images/systemSetting/message-5.png'
import message6 from '@/assets/images/systemSetting/message-6.png'
import EtmMainBody from '@/views/sacc/schedule/components/EtmMainBody/src/EtmMainBody'
import { getClientUrl } from '@/api/guardcare/homeManage/guardcare_cm'

export default {
  name: 'Index',
  components: {
    EtmMainBody,
    VueQr
  },
  data() {
    return {
      showCarousel: false,
      list: [],
      publicList: [
        {
          count: 1,
          html: '在设置页面点击 <b>“立即授权”</b> 按钮，跳转至授权页面完成授权。',
          url: authorize1
        },
        {
          count: 2,
          html: '完成 <b>“授权”</b> 后，返回页面上，点击 <b>“复制链接”</b> 按钮。',
          url: authorize2
        },
        {
          count: 3,
          html: '在 <b>“微信公众平台”</b> ，输入自己的微信公众号登录进入信息统计的页面，页面左侧是一些可操作的菜单。',
          url: authorize3
        },
        {
          count: 4,
          html: '点击页面左侧的 <b>“自定义菜单”</b> 选项，网页右侧会变成相应的操作页面。',
          url: authorize4
        },
        {
          count: 5,
          html: '在操作界面上选择 <b>“添加菜单”</b> ，在窗口右侧的菜单名称位置修改成自己想要的栏目，左侧的预览图可以看见菜单名称的改变。',
          url: authorize5
        },
        {
          count: 6,
          html: '选好菜单后，右侧<b>“菜单内容”</b>选择<b>“跳转网页”</b>，把在系统微官网主页面的<b>“复制链接”</b>，粘贴到<b>“页面地址”</b>上点击<b>“保存并发布”</b>即可完成。',
          url: authorize6
        }
      ],
      messageList: [
        {
          count: 1,
          html: '百度搜索微信公众号，输入账号密码并扫码授权后登录成功。',
          url: message1
        },
        {
          count: 2,
          html: '在左边栏点击 <b>“添加功能插件”</b> 。',
          url: message2
        },
        {
          count: 3,
          html: '按图操作选择 <b>“模板消息”</b> 。',
          url: message3
        },
        {
          count: 4,
          html: `<p>1、主营行业和副营行业选择，<span style="color: #F53939;">必须有一项选择“教育 -院校”（注意不能选错！）</span>。</p>
                    <p>2、申请理由填写，例：<b>“通过开通和使用模板消息给线上会员提供更好的体验和服务”</b>。</p>`,
          url: message4
        },
        {
          count: 5,
          html: `点击<b>“提交”</b>。`,
          url: message5
        },
        {
          count: 6,
          html: '提交后，页面会出现提示：请耐心等待审核结果，模板消息申请资料已经提交，审核需要2-3个工作日。审核通过后，就能使用了。',
          url: message6
        }
      ],
      previewUrl: null,
      showImagePreview: false,
      wechatUrl: '',
      orgLogo: '',
      elOverflow: true
    }
  },
  mounted() {
    this.getCode()
    this.showTips()
    const _this = this
    window.addEventListener('resize', function() {
      _this.showTips()
    })
  },
  created() {
    this.getOrgLogo()
    this.getUrl()
  },
  methods: {
    getCode() {
      const authCode = this.getQueryVariable('auth_code')
      const organizationId = localStorage.getItem('currentOrganizationId')

      if (authCode) {
        // 保存用户授权
        saveWechatAuthInfo({ authCode, organizationId }).then(res => {
          localStorage.setItem('wx_auth', 'authCode')
          console.log('保存用户授权', res)
          this.$message.success('授权成功')
          this.$router.replace({ name: this.$route.name })
        })
      }
    },
    getQueryVariable(variable) {
      if (!location.href.includes(variable)) {
        return false
      }
      const query = location.href.includes(variable) && decodeURIComponent(location.href).split('?')[1]
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    },
    getUrl() {
      getClientUrl().then(res => {
        const data = res.data
        this.wechatUrl = data
      })
    },
    showTips() {
      if (this.$refs.parentEl) {
        if (this.$refs.parentEl.clientWidth - this.$refs.parentEl.childNodes[0].offsetWidth < this.$refs.labelEl.offsetWidth) {
          this.elOverflow = false
        } else {
          this.elOverflow = true
        }
      }
    },
    getOrgLogo() {
      const organizations = JSON.parse(localStorage.getItem('organizations'))
      const organizationId = parseInt(localStorage.getItem('currentOrganizationId'))
      organizations.forEach(item => {
        if (item.organizationId === organizationId) {
          this.orgLogo = item.organizationLogo
        }
      })
    },
    openCarousel(type) {
      if (type === 1) {
        this.list = this.publicList
      } else {
        this.list = this.messageList
      }
      this.showCarousel = true
    },
    closeCarousel() {
      this.showCarousel = false
      this.list = []
    },
    openPreview(url) {
      this.showImagePreview = true
      this.previewUrl = url
    },
    closePreview() {
      this.showImagePreview = false
      this.previewUrl = null
    },
    toAuth() {
      getWechatAuthURL({ redirectUrl: location.href })
    },
    copyLink() {
      const _this = this
      const clipboard = new _this.$clipboard('.copyLinkChild')
      clipboard.on('success', function() {
        _this.$message({
          message: '复制成功',
          type: 'success'
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', function() {
        _this.$message({
          message: '复制失败',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.systemSetting {
  /*margin: 24px 0;*/
  /*height: calc(100% - 48px);*/

  .leftBox {
    .tips {
      font-size: 14px;
      color: $title-color;
      text-align: center;
    }

    .img {
      padding: 24px;
      width: 100%;

      img {
        width: 100%;
      }
    }
  }

  .rightBox {
    /deep/ .EtmTitle-wrap {
      &::before {
        width: 0;
      }
    }

    .container {
      padding: 0 24px;

      .stepTitle {
        overflow: hidden;

        span {
          float: left;
        }

        .imgBox {
          width: 32px;

          img {
            display: block;
            width: 100%;
          }
        }

        .text {
          margin-left: 10px;
          font-size: 14px;
          font-weight: bold;
          line-height: 32px;
          color: $title-color;
        }

        .iconBox {
          line-height: 32px;

          .iconfont {
            cursor: pointer;
          }
        }
      }

      .stepList {
        padding-left: 42px;

        .steps {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid $divide-color;

          .step {
            height: 32px;
            width: calc(100% - 86px);
            line-height: 32px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            span {
              font-size: 14px;
              color: $text-color;

              &.label {
                color: $secondary-color;
              }
            }
          }

          .btn {
            padding: 8px 14px;
            border-radius: 4px;
          }
        }
      }

      .previewCode {
        margin-top: 32px;

        .previewTitle {
          overflow: hidden;

          span {
            float: left;
          }

          .imgBox {
            width: 32px;

            img {
              display: block;
              width: 100%;
            }
          }

          .text {
            margin-left: 10px;

            div {
              height: 12px;
              line-height: 12px;

              &.title {
                color: $title-color;
                font-weight: bold;
              }

              &.subtitle {
                margin-top: 8px;
                color: $secondary-color;
              }
            }
          }
        }

        .codeBox {
          margin: 32px auto;
          width: 152px;

          .code {
            width: 152px;
            height: 152px;
            border: 1px solid $divide-color;

            .img {
              width: 100%;
              height: 100%;
            }
          }

          .text {
            margin-top: 16px;
            text-align: center;
            color: $text-color;
          }
        }
      }
    }
  }

  .tutorial {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1111;
    background-color: rgba(0, 0, 0, 0.7);

    .carouselBox {
      position: relative;
      top: 50%;
      margin: 0 auto;
      width: 1200px;
      transform: translateY(-50%);

      .innerBox {
        position: relative;
        margin: 0 auto;
        padding: 40px 0;
        width: 880px;
        height: 570px;
        text-align: center;
        background-color: $white;
        border-radius: 4px;

        .closeIcon {
          position: absolute;
          top: 15px;
          right: 15px;
          color: $secondary-color;
          font-weight: bold;
          cursor: pointer;

          &:hover {
            @include c_main_color();
          }
        }

        .count {
          .currentCount {
            font-size: 20px;
            @include c_main_color();
          }

          .total {
            font-size: 16px;
            color: $secondary-color;
          }
        }

        .explanation {
          display: inline-block;
          margin: 30px auto 0;
          max-width: 640px;
          color: $title-color;
          text-align: left;

          .bold {
            font-weight: bold;
          }
        }

        .imgBox {
          margin: 50px auto 0;
          width: 674px;
          height: 325px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      /deep/ .el-carousel__indicators {
        display: none;
      }

      /deep/ .el-carousel__arrow {
        border: 2px solid rgba(255, 255, 255, 0.8);

        &:hover {
          border-color: $white;

          i {
            color: $white;
          }
        }

        i {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .imagePreview {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.7);

    .previewBox {
      width: 100vw;
      height: 100vh;
      display: table-cell;
      vertical-align: middle;
      text-align: center;

      .iconfont {
        position: absolute;
        top: 50px;
        right: 50px;
        font-size: 32px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;

        &:hover {
          color: $white;
        }
      }
    }
  }
}
</style>
