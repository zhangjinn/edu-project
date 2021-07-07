<template>
  <div class="sharePanel-wrap">
    <etm-pop
      pop="simple"
      :visible.sync="visible"
      title="分享观测海报"
      @cancel="cancel"
      @close="cancel"
      @confirm="cancel"
    >
      <div class="content">
        <div class="left">
          <div class="title">分享方式</div>
          <div class="first">
            <span>一、直接分享链接</span>
            <span>1、微信扫码识别</span>
            <span>2、点击右上角，分享给朋友或朋友圈</span>
          </div>
          <div class="second">
            <span>二、下载推广海报</span>
            <el-button @click="downLoad">下载海报</el-button>
          </div>
        </div>
        <div class="right">
          <vue-qr class="Qr" :text="Url" :size="100" :margin="5" />
          <!--          <img src="../../../../assets/images/daycare/img-cardCheck.png">-->
        </div>
      </div>
    </etm-pop>
  </div>

</template>
<script>
/**
 * sharePanel create by Administrator
 * createTime 2020/11/27 11:48
 */
import VueQr from 'vue-qr'

export default {
  name: 'SharePanel',
  components: {
    VueQr
  },
  filters: {},
  mixins: [],
  props: {
    refNode: {
      type: HTMLDivElement,
      default: () => {
        return {}
      }
    },
    shareUrl: {
      type: String,
      defatul: () => {
        return ''
      }
    },
    shareTestUrl: {
      type: String,
      default: () => {
        return ''
      }
    }

  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    Url() {
      return `${this.shareUrl}&linkUrl=${this.shareTestUrl}`
    }
  },
  watch: {},
  created() {
  },
  async mounted() {
    await this.init()
  },
  methods: {
    init() {
    },
    handleVisible(visible) {
      this.visible = visible
    },
    cancel() {
      this.handleVisible(false)
    },
    downLoad() {
      this.handleVisible(false)
      console.log(this.refNode, 'this')
      this.$emit('download', this.refNode)
    }
  }
}
</script>
<style lang="scss" scoped>
.sharePanel-wrap {

}

.content {
  display: flex;
  justify-content: space-around;

  .right {
    padding-top: 50px;
  }

  .first {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    span:not(:first-child) {
      margin-top: 8px;
      text-indent: 22px;
    }
  }

  .second {
    display: flex;
    flex-direction: column;
    margin-top: 17px;

    .el-button {
      width: 100px;
      margin-top: 13px;
      margin-left: 23px;
    }
  }
}
</style>
