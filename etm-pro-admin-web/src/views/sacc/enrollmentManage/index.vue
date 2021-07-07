<template>
  <div class="enrollment">
    <etm-main-body
      :bread="true"
      :bread-data="bread"
      history-key="enrollment"
    />
  </div>
</template>

<script>
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import manage from './manage'
import detail from './detail'
import setup from './setup'
import enrollment from './enrollment'
import orderEdit from './enrollment/edit'

export default {
  components: {
    EtmMainBody
  },
  data() {
    return {
      bread: [
        [
          { name: '报名管理', route: 'manage', view: manage },
          { name: '报名详情', route: 'detail', view: detail }
        ],
        [
          { name: '报名管理', route: 'manage', view: manage },
          { name: '应用设置', route: 'setup', view: setup }
        ],
        // 入学报名（新签）
        [
          { name: '报名管理', route: 'manage', view: manage },
          { name: '添加报名', route: 'enrollment', view: enrollment }
        ],
        // 未审核或审核不通过的信息修改
        [
          { name: '报名管理', route: 'manage', view: manage },
          { name: '修改报名', route: 'enrollEdit', view: enrollment }
        ],
        // 审核通过的信息修改
        [
          { name: '报名管理', route: 'manage', view: manage },
          { name: '会员修改', route: 'orderEdit', view: orderEdit }
        ]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
