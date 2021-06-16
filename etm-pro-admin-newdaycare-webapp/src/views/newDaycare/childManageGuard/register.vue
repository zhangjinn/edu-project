<template>
  <div class="register-wrap">
    <etm-main-body>
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
        >
          扫码入园登记
          <template slot="tool">
            <el-button
              type="primary"
              size="mini"
              @click="save"
            >
              保存
            </el-button>
            <el-button
              plain
              size="mini"
              @click="preview"
            >
              预览
            </el-button>
            <el-button
              plain
              size="mini"
              @click="print"
            >
              打印
            </el-button>
          </template>
        </etm-title>
        <el-row :gutter="32">
          <el-col
            class="colLeft"
            :span="12"
          >
            <div class="titleSet">
              <el-input v-model="noticeTitle" />
            </div>
            <div class="textSet">
              <el-input
                v-model="noticeContent"
                type="textarea"
                :autosize="{ minRows: 14}"
              />
            </div>
            <div class="codeBox">
              <div class="img">
                <vue-qr
                  v-if="imgUrl"
                  :text="imgUrl"
                  :size="120"
                  :margin="10"
                />
              </div>
              <div>新生扫码填写报名登记表</div>
            </div>
          </el-col>
          <el-col
            class="colRight"
            :span="12"
          >
            <div class="title">
              使用说明
            </div>
            <div class="step">
              <p>1.检查并调整通知信息，指引家长扫码进行入园登记填写；</p>
              <p> 2.打印通知，张贴在园所指定位置；</p>
              <p>3.家长使用微信扫描二维码，填写幼儿报名信息提交报名申请；</p>
              <p>4.园所领导在管理端审核家长提交的信息，完成新生幼儿报名登记的操作。</p>
            </div>
            <div class="warnText">
              <span class="iconfont iconwarn" />
              <span>温馨提示：左侧文案仅为提供的示例文案，若园所有调整，可以直接在框内进行调整。</span>
            </div>
          </el-col>
        </el-row>
      </etm-layout-split>
    </etm-main-body>
    <etm-drawer
      :visible.sync="showDrawer"
      type="small"
      :class="showPage ? 'hidden' : ''"
    >
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          预览
        </etm-title>
        <div
          ref="print"
          class="printBox"
        >
          <div
            class="printTitle"
            style="color: #222;
  font-size: 16px;
  font-weight: bold;
  padding: 24px 0 32px;
  text-align: center;"
          >
            {{ noticeTitle }}
          </div>
          <div
            class="printContent"
            style="color: #555;
  font-size: 14px;
  padding-bottom: 32px;
  text-indent: 16px;"
            v-html="contentText"
          />
          <div
            class="printImg"
            style="padding-bottom: 16px;"
          >
            <div
              class="img"
              style="border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 120px;
  margin: 0 auto;
  overflow: hidden;
  width: 120px;"
            >
              <vue-qr
                v-if="imgUrl"
                :text="imgUrl"
                :size="120"
                :margin="10"
              />
            </div>
          </div>
          <div
            class="printText"
            style="color: #555;
  font-size: 14px;
  text-align: center;"
          >
            新生扫码填写报名登记表
          </div>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
/**
 * register create by Administrator
 * createTime 2021/1/15 10:52
 */
import {
  queryChildRegistration,
  queryChildRegistrationUrl,
  updateChildRegistration
} from '@/api/newDaycare/childManageGuard'
import VueQr from 'vue-qr'

export default {
  name: 'Register',
  components: {
    VueQr
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      noticeTitle: '',
      noticeContent: '',
      contentText: '',
      imgUrl: '',
      showDrawer: false,
      showPage: true
    }
  },
  computed: {},
  watch: {
    noticeContent () {
      this.contentText = this.noticeContent.replace(/\n/g, '<br>')
    }
  },
  created () {
  },
  mounted () {
    this.getData()
    this.getUrl()
  },
  methods: {
    getData () {
      queryChildRegistration().then(res => {
        const data = res.data
        if (!data || !data.noticeTitle) {
          this.noticeTitle = '新生报名通知'
        } else {
          this.noticeTitle = data.noticeTitle
        }
        if (!data || !data.noticeContent) {
          this.noticeContent = '为了让孩子在园所的信息可以及时与家庭同步，我园正在使用“园所公众号作为家园共育的沟通平台，以便各位家长可以及时掌握孩子在园所的生活与学习情况。请您使用手机微信扫描以下二维码填写相关信息。\n' +
            '通过园所公众号您可以：\n' +
            '1.便捷沟通\n' +
            '接收园所通知以及学习任务；直观了解宝宝每日餐点食谱，饮食状况\n' +
            '2.智能考勤\n' +
            '绑定考勤卡后，宝宝进出幼儿园的记录实时推送至您的手机，随时查看宝宝打卡进出信息\n' +
            '3.了解幼儿在园动态\n' +
            '直观查看孩子所在班级的生活学习照片、视频，了解孩子在幼儿园的全面动态'
        } else {
          this.noticeContent = data.noticeContent
        }
        this.showDrawer = true
        this.$nextTick(() => {
          this.showDrawer = false
          setTimeout(() => {
            this.showPage = false
          }, 500)
        })
      })
    },
    getUrl () {
      queryChildRegistrationUrl().then(res => {
        this.imgUrl = res.data
      })
    },
    save () {
      if (this.noticeTitle && this.noticeContent) {
        const param = {
          noticeTitle: this.noticeTitle,
          noticeContent: this.noticeContent
        }
        updateChildRegistration(param).then(() => {
          this.$message.success('保存成功')
        })
      }
    },
    preview () {
      this.showDrawer = true
    },
    print () {
      let iframe = document.getElementById('print-iframe')
      if (!iframe) {
        const el = this.$refs.print
        iframe = document.createElement('IFRAME')
        let doc = null
        iframe.setAttribute('id', 'print-iframe')
        iframe.setAttribute('style', 'width: 100%')
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        doc.write('<div>' + el.innerHTML + '</div>')
        doc.close()
        iframe.contentWindow.focus()
      }
      iframe.contentWindow.print()
      document.body.removeChild(iframe)
    }
  }
}
</script>
<style lang="scss" scoped>
.register-wrap {
  .colLeft {
    .titleSet {
      padding-bottom: 16px;

      ::v-deep .el-input {
        input {
          @include c_title_color();
          font-size: 16px;
          text-align: center;
        }
      }
    }

    .textSet {
      padding-bottom: 30px;

      ::v-deep textarea {
        @include c_text_color();
        resize: none;
        text-indent: 16px;
      }
    }

    .codeBox {
      @include c_text_color();
      padding-bottom: 48px;
      text-align: center;

      .img {
        border: 1px solid $color-control;
        border-radius: 4px;
        height: 120px;
        margin: 0 auto 16px;
        overflow: hidden;
        width: 120px;
      }
    }
  }

  .colRight {
    .title {
      @include c_title_color();
      font-size: 16px;
      padding-bottom: 24px;
    }

    .step {
      padding-bottom: 16px;

      p {
        &:not(:last-child) {
          padding-bottom: 4px;
        }
      }
    }

    .warnText {
      span {
        @include c_error_color();
      }

      .iconfont {
        font-size: 14px;
        margin-right: 4px;
        width: 14px;
      }
    }
  }
}

@media print {
  .printTitle {
    color: #222;
    font-size: 16px;
    font-weight: bold;
    padding: 24px 0 32px;
    text-align: center;
  }

  .printContent {
    padding-bottom: 32px;
  }

  .printImg {
    padding-bottom: 16px;

    .img {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      height: 120px;
      overflow: hidden;
      width: 120px;
    }
  }
}

.hidden {
  visibility: hidden;
}
</style>
