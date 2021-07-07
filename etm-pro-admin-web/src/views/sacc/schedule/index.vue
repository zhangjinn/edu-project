<template>
  <div class="schedule">
    <main-body
      :bread="true"
      :bread-data="bread"
      history-key="schedule"
    />
  </div>
</template>
<script>
import mainBody from './components/EtmMainBody'
import manage from './manage/index'
import add from './add/index'
import detail from './detail/index'
import modify from './modify/index'
import setting from './setting/index'

export default {
  components: {
    mainBody
  },
  data() {
    const _this = this
    return {
      bread: [
        [
          { name: _this.$t('schedule.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: _this.$t('schedule.breadCrumbTitleDetail'), route: 'detail', view: detail }
        ],
        [
          { name: _this.$t('schedule.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: _this.$t('schedule.breadCrumbTitleAdd'), route: 'add', view: add }
        ],
        [
          { name: _this.$t('schedule.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: _this.$t('schedule.breadCrumbTitleModify'), route: 'modify', view: modify }
        ],
        [
          { name: _this.$t('schedule.breadCrumbTitleManage'), route: 'manage', view: manage },
          { name: _this.$t('schedule.breadCrumbTitleSetting'), route: 'setting', view: setting }
        ]
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.schedule {
  p {
    margin: 0;
  }
}
/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1689282 *!*/
/*  src: url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.eot');*/
/*  src: url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1689282_ejzbwg38jen.svg#iconfont') format('svg');*/
/*}*/
</style>
