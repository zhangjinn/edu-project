<template>

  <div class="appCenter">
    <etm-main-body
      :bread="true"
      :bread-data="initData"
      history-key="apply"
    />

  </div>

</template>
<script>
import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './components/mainContent/index'
import disposeApply from './components/disposeApply/index'
import applyDetail from './components/applyDetail/index'

export default {
  name: 'Index',
  components: {

    etmMainBody

  },
  data() {
    return {
      initData: [
        [
          { name: '我的应用', route: 'mainContent', view: mainContent },
          { name: '配置应用', route: 'disposeApply', view: disposeApply }
        ],
        [
          { name: '我的应用', route: 'mainContent', view: mainContent },
          { name: '应用详情', route: 'applyDetail', view: applyDetail }
        ]
      ]
    }
  }

}
</script>
<style lang="scss" scoped>

</style>
