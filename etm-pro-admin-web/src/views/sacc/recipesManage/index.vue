<template>
  <div class="recipesManage">
    <etm-main-body
      :bread="true"
      :bread-data="initData"
      history-key="recipesManage"
    />
  </div>
</template>

<script>
import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './mainContent/index'
import recipesDetail from './recipesDetail/index'

export default {
  name: 'Index',
  components: {
    etmMainBody
  },
  data() {
    return {
      initData: [
        [
          { name: this.$t('recipeManagement.breadCrumbTitleManage'), route: 'mainContent', view: mainContent },
          { name: this.$t('recipeManagement.breadCrumbTitleDetails'), route: 'recipesDetail', view: recipesDetail }
        ]

      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .recipesManage {
    height: 100%;
  }
</style>
