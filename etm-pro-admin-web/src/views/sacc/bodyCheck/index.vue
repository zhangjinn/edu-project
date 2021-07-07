<template>
  <div class="index-wrap">
    <!--<etm-app-bar title="晨午检" @click="changeRoute" />-->
    <etm-main-body ref="mainBody" bread :bread-data="initData" history-key="bodyCheck" />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import main from './main'
import setting from '@/views/sacc/bodyCheck/setting'

/**
   *  2020/4/17 10:10
   *  haijinsha
   */
export default {
  name: 'Index',
  components: { EtmMainBody },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      initData: [
        [
          { name: '晨午检', route: 'bodyCheck', view: main },
          { name: '晨午检设置', route: 'setting', view: setting }
        ]
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    changeRoute() {
      this.$refs.mainBody.$children[0].handleSwitch('setting')
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    height: 100%;

    & /deep/ .subBread .mainView.hide {
      /*height: calc(100vh - 200px);*/
    }
  }

</style>

