<template>
  <div class="index-wrap">
    <etm-layout-split>
      <!--      <div slot="header" class="top">-->
      <!--<etm-tabs v-model="activeName" :setting="false" :show-toggle="false">-->
      <!--  <el-tab-pane name="enroll" label="观测引流" />-->
      <!--</etm-tabs>-->
      <!--      </div>-->
      <div class="main-wrap">
        <div class="main">
          <div class="item">
            <div ref="littleBabyPost" class="little-baby">
              <span>懂孩子，从一次测评开始！</span>
              <vue-qr class="little-babyQr" :text="littleBabyLink" :size="73" :margin="10" />
            </div>
            <div class="footer">
              <div class="footer-item">
                <span class="iconfont iconfenxianglianjie" />
                <span ref="urlEl" class="label"><span
                  id="littleBaby_url"
                  class="hiddenLabel"
                >{{
                  littleBabyLink
                }}</span></span>
                <div
                  ref="copyLinkChild"
                  class="copyLinkChild btn"
                  data-clipboard-action="copy"
                  data-clipboard-target="#littleBaby_url"
                  @click="copyLink"
                >{{ $t('systemSetting.copyLink') }}
                </div>
              </div>
              <div
                class="footer-item border"
                @click="showSharePanel($refs.littleBabyPost,shareLittleBabyPost,littleBabyLink)"
              >
                <span class="iconfont iconshare" />
                <div>分享</div>
              </div>
              <div class="footer-item" @click="handleSms(phone,0)">
                <span class="iconfont iconfaduanxin3" />
                <div>发短信</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div ref="babyPost" class="baby">
              <span>合格的妈妈都在测！</span>
              <vue-qr class="babyQr" :text="babyLink" :size="73" :margin="10" />
            </div>
            <div class="footer">
              <div class="footer-item">
                <span class="iconfont iconfenxianglianjie" />
                <span ref="urlEl" class="label"><span id="baby_url" class="hiddenLabel">{{
                  babyLink
                }}</span></span>
                <div
                  ref="copyLinkChild"
                  class="copyLinkChild btn"
                  data-clipboard-action="copy"
                  data-clipboard-target="#baby_url"
                  @click="copyLink"
                >{{ $t('systemSetting.copyLink') }}
                </div>
              </div>
              <div class="footer-item border" @click="showSharePanel($refs.babyPost,shareBabyPost,babyLink)">
                <span class="iconfont iconshare" />
                <div>分享</div>
              </div>
              <div class="footer-item" @click="handleSms(phone,1)">
                <span class="iconfont iconfaduanxin3" />
                <div>发短信</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div ref="childPost" class="child">
              <span>为孩子测评，一亿妈妈的选择！</span>
              <vue-qr class="childQr" :text="childLink" :size="73" :margin="10" />
            </div>
            <div class="footer">
              <div class="footer-item">
                <span class="iconfont iconfenxianglianjie" />
                <span ref="urlEl" class="label"><span id="child_url" class="hiddenLabel">{{
                  childLink
                }}</span></span>
                <div
                  ref="copyLinkChild"
                  class="copyLinkChild btn"
                  data-clipboard-action="copy"
                  data-clipboard-target="#child_url"
                  @click="copyLink"
                >{{ $t('systemSetting.copyLink') }}
                </div>
              </div>
              <div class="footer-item border" @click="showSharePanel($refs.childPost,shareChildPost,childLink)">
                <span class="iconfont iconshare" />
                <div>分享</div>
              </div>
              <div class="footer-item" @click="handleSms(phone,2)">
                <span class="iconfont iconfaduanxin3" />
                <div>发短信</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </etm-layout-split>

    <share-panel
      ref="sharePanel"
      :ref-node="refNode"
      :share-url="shareUrl"
      :share-test-url="shareTestUrl"
      @download="download"
    />

    <send-message
      ref="sendMessage"
      :baby-link="babyLink"
      :little-baby-link="littleBabyLink"
      :child-link="childLink"
      :send-message="sendMessageData"
    />

  </div>

</template>

<script>
import VueQr from 'vue-qr'
import { queryEnrollSetting } from '@/api/newDaycare/enrollEvaluation'
import SendMessage from './components/sendMessage'
import SharePanel from '@/views/newDaycare/enrollEvaluation/components/sharePanel'
import html2canvas from 'html2canvas'

/**
 * index create by Administrator
 * createTime 2020/11/27 9:00
 */
export default {
  name: 'Index',
  components: {
    VueQr,
    SharePanel,
    SendMessage
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'enroll',
      enrollSetting: {},
      littleBabyLink: '',
      babyLink: '',
      childLink: '',
      showShare: false,
      sendMessageData: {
        phone: ''
      },
      linkUrl: {},
      refNode: null,
      phone: window.localStorage.getItem('phone'),
      shareUrl: '', // 海报地址
      shareTestUrl: '', // 测评地址
      shareLittleBabyPost: '',
      shareBabyPost: '',
      shareChildPost: '',
      originTemplateNumber: 0
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  async mounted() {
    await this.init()
  },
  methods: {
    init() {
      queryEnrollSetting().then(res => {
        console.log(res, 'res')
        this.enrollSetting = res.data
        this.littleBabyLink = this.enrollSetting.zeroToOneEnterUrl || ''
        this.babyLink = this.enrollSetting.oneToThreeEnterUrl || ''
        this.childLink = this.enrollSetting.threeToSixEnterUrl || ''
        this.shareLittleBabyPost = this.enrollSetting.zeroToOnePosterUrl
        this.shareBabyPost = this.enrollSetting.oneToThreePosterUrl
        this.shareChildPost = this.enrollSetting.threeToSixPosterUrl
        this.linkUrl = {
          littleBabyLink: this.littleBabyLink,
          babyLink: this.babyLink,
          childLink: this.childLink
        }
      })
    },
    copy(link) {
      const clipboardData = window.clipboardData
      clipboardData.setData('text', link)
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
    },
    showSharePanel(ref, shareUrl, shareTestUrl) {
      this.refNode = ref
      this.$refs.sharePanel.handleVisible(true)
      this.shareUrl = shareUrl
      this.shareTestUrl = shareTestUrl
    },
    handleSms(phone, number) {
      console.log(this.$refs)
      this.sendMessageData.phone = phone
      this.originTemplateNumber = number // 筛选对应的观测短信模板
      this.$refs.sendMessage.handleVisible(true, number)
    },
    download(ref) {
      const refNode = ref
      setTimeout(() => {
        html2canvas(refNode, {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  width: 100%;
  margin-top: 16px;
  padding-bottom: 16px;

  ::v-deep .EtmLayoutSplit-wrap .layout-header {
    display: none;
  }
}

.little-baby {
  background-image: url("../../../assets/images/daycare/little-baby.png");
  width: 377px;
  height: 612px;
  position: relative;

  .little-babyQr {
    display: inline-block;
    position: absolute;
    bottom: 2%;
    right: 4%;
  }

  span {
    display: inline-block;
    position: absolute;
    bottom: 2%;
    left: 24%;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
  }
}

.baby {
  background-image: url("../../../assets/images/daycare/baby.png");
  width: 377px;
  height: 612px;
  position: relative;

  .babyQr {
    position: absolute;
    bottom: 7%;
    left: 42%;
  }

  span {
    display: inline-block;
    position: absolute;
    bottom: 2%;
    left: 34%;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
  }
}

.child {
  background-image: url("../../../assets/images/daycare/chlid.png");
  width: 377px;
  height: 612px;
  position: relative;

  .childQr {
    display: inline-block;
    position: absolute;
    bottom: 2%;
    right: 4%;
  }

  span {
    display: inline-block;
    position: absolute;
    bottom: 2%;
    left: 17%;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
  }
}

.main-wrap{
  width: 100%;
  overflow-x: auto;
}

.main {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  margin-bottom: 26px;
  min-width: 1148px;
  .item{
    margin: 0 4px;
  }
}

.footer {
  display: flex;
  border: 1px solid #E0E0E0;
  justify-content: space-around;
  color: #555555;
  font-size: 14px;
  height: 40px;
  margin-top: 17px;
  border-radius: 4px;

  .footer-item {
    display: flex;
    align-items: center;
    flex-basis: 33%;
    justify-content: center;
  }

  .footer-item:hover {
    cursor: pointer;
    @include etm-color();
  }

  .border {
    border-right: 1px solid #E0E0E0;
    border-left: 1px solid #E0E0E0;
  }
}

.hiddenLabel {
  transform: scale(0);
  display: inline-block;
  height: 0;
  width: 0;
}

.sharePanel {
  width: 500px;
  height: 500px;
  background: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1111;
}
</style>
