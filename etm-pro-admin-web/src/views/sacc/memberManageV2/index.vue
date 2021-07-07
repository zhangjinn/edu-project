<template>
  <div class="memberManage">
    <!-- <main-body
      :bread="true"
      :bread-data="bread"
      history-key="memberManage"
    /> -->
    <etm-main-body
      bread
      :bread-data="bread"
      history-key="memberManageV2"
    />
  </div>
</template>
<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
// import mainBody from './components/EtmMainBody'
import manage from './manage/index'
import add from './add/index'
import detail from './detail/index'
import modify from './modify/index'
import setting from './setting/index'
import refund from '../../order/bill/components/refund/index'
import sign from './sign/index'

export default {
  components: {
    EtmMainBody
  },
  data() {
    return {
      bread: [
        [
          { name: this.$t('memberManage.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: this.$t('memberManage.breadCrumbTitleAdd'), route: 'add', view: add }
        ],
        [
          { name: this.$t('memberManage.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: this.$t('memberManage.breadCrumbTitleDetail'), route: 'detail', view: detail },
          { name: this.$t('memberManage.breadCrumbTitleRefund'), route: 'refund', view: refund }
        ],
        [
          { name: this.$t('memberManage.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: '续签', route: 'sign', view: sign }
        ],
        [
          { name: this.$t('memberManage.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: this.$t('memberManage.breadCrumbTitleModify'), route: 'modify', view: modify }
        ],
        [
          { name: this.$t('memberManage.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: this.$t('memberManage.breadCrumbTitleSetting'), route: 'setting', view: setting }
        ]
      ]
    }
  }
}
</script>

<style scoped lang="scss">
/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1689282 *!*/
/*  src: url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.eot');*/
/*  src: url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1689282_9qfbf44nfe.svg#iconfont') format('svg');*/
/*}*/
.memberManage {
  p {
    margin: 0;
  }
}
</style>
