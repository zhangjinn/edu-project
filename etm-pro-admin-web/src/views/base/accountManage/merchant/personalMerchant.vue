<template>
  <div class="personalMerchant-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="container">
          <div class="header">
            个体商户
          </div>
          <form-component type="PERSONAL_COMPANY" :is-edit="isEdit" @getState="getState" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * personalMerchant create by Administrator
 * createTime 2021/1/8 10:05
 */
import formComponent from '@/views/base/accountManage/component/form'

export default {
  name: 'PersonalMerchant',
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
.personalMerchant-wrap {
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
