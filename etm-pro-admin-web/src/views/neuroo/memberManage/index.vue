<template>
  <div class="customerManagement_neuroo">
    <etm-main-body
      bread
      :bread-data="bread"
      history-key="customerManagement_neuroo"
    />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import manage from './manage/index'
import detail from './detail/index'
import modify from './modify/index'
import add from './add/index'
export default {
  components: {
    EtmMainBody
  },
  data() {
    return {
      bread: [
        [
          { name: '会员管理', route: 'manage', view: manage },
          { name: '会员详情', route: 'detail', view: detail }
        ],
        [
          { name: '会员管理', route: 'manage', view: manage },
          { name: '会员修改', route: 'modify', view: modify }
        ],
        [
          { name: '会员管理', route: 'manage', view: manage },
          { name: '新增会员', route: 'add', view: add }
        ]
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.customerManagement_neuroo {
  p {
    margin: 0;
  }
}
</style>
