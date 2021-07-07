<template>
  <div class="enterpriseMerchant-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="container">
          <div class="header">
            企业商户
          </div>
          <form-component type="COMPANY" :is-edit="isEdit" @getState="getState" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * enterprise create by Administrator
 * createTime 2020/11/5 17:17
 */
import formComponent from '@/views/base/accountManage/component/form'

export default {
  name: 'EnterpriseMerchant',
  components: {
    formComponent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getState(state) {
      if (state === 'REJECT' || state === 'RECHECK_REJECT' || state === 'INIT') {
        this.isEdit = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.enterpriseMerchant-wrap {
  .container {
    padding: 24px 24px 0;

    .header {
      width: 800px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      font-size: 16px;
      font-weight: bold;
      @include c_title_color();
      @include bgc_hover_color();
    }
  }
}
</style>
