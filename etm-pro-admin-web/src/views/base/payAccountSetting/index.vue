<template>
  <div class="collectionManage">
    <etm-main-body
      bread
      :bread-data="bread"
      history-key="collectionManage"
    />
  </div>
</template>

<script>
import message from './message/index'
import setting from './setting/index'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      bread: [
        [
          { name: '进件设置', route: 'message', view: message },
          { name: '收款账号设置', route: 'setting', view: setting }
        ]
      ]
    }
  }
}
</script>

<style scoped>

</style>
