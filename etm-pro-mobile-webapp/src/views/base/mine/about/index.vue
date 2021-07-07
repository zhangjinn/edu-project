<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">关于</etm-mobile-title>
    <div class="aboutContent">
      <div class="introduction contentBox">
        <div class="title">公司简介</div>
        <div class="text">
          广州六米网络科技有限公司简称六米网络科技有限公司，六米，ETM，成立于2012年10月10日，国家高新技术企业（证编号GR201544001492），IS09001认证，双软资质，拥有独立知识产权、发明专利100多项。以移动互联网+教育为驱动，用专一垂直、专注执着、专业能力、专家经验，致力于成为早期教育行业领先的增值服务商。
        </div>
        <div class="text">
          广州六米网络科技有限公司旗下拥有早期教育行业多套自主创新研发，自主知识产权和专利的管理产品与运营服务，ETM是广州六米网络科技有限公司旗下的一款成熟产品，现已成为国内很多知名品牌企业使用的早期教学管理系统。
        </div>
      </div>
      <div class="qualification contentBox">
        <div class="title">企业资质</div>
        <div class="text">国家高新技术企业，ISO9001 认证，双软资质，拥有独立知识产权、发明专利多项，被授予“广东省早期教育行业协会第二届理事会常务理事单位”等数不清的荣耀，谱写了六米的骄傲历程。</div>
      </div>
      <div class="message contentBox">
        <div class="msgList">
          <div class="img">
            <img src="../../../../assets/images/mine/addressIcon.png"/>
          </div>
          <div class="msgText">广州市天河区羊城创意产业园3-23D中科零壹加速器</div>
        </div>
        <div class="msgList">
          <div class="img">
            <img src="../../../../assets/images/mine/telephoneIcon.png"/>
          </div>
          <div class="msgText">400-0313-400</div>
        </div>
        <div class="msgList">
          <div class="img">
            <img src="../../../../assets/images/mine/faxIcon.png"/>
          </div>
          <div class="msgText">020-87019159</div>
        </div>
        <div class="msgList">
          <div class="img">
            <img src="../../../../assets/images/mine/emailIcon.png"/>
          </div>
          <div class="msgText">www@6miw.com</div>
        </div>
        <div class="msgList">
          <div class="img">
            <img src="../../../../assets/images/mine/websiteIcon.png"/>
          </div>
          <div class="msgText">www.etm365.net</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/11/20 9:55
 */
import EtmMobileTitle from '@/components/EtmMobileTitle'

export default {
  name: 'Index',
  components: {
    EtmMobileTitle
  },
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
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .aboutContent {
    padding: 12px;

    .contentBox {
      padding: 24px 15px;
      background-color: $white;
      border-radius: 4px;

      & + .contentBox {
        margin-top: 12px;
      }

      .title {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: bold;
      }

      .text {
        font-size: 14px;
        line-height: 1.5;
        text-align: left;
      }
      .msgList{
        display: flex;
        & + .msgList{
          margin-top: 16px;
        }
        .img{
          margin-right: 9px;
          width: 18px;
          height: 18px;
        }
        .msgText{
          font-size: 14px;
          text-align: left;
        }
      }
    }
  }
}
</style>
