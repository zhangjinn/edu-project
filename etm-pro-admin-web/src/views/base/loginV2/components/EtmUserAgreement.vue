<template>
  <div class="EtmUserAgreement-wrap">
    登录即默认同意 <span class="text" @click.self="showAgreement = true">《软件许可及服务协议》</span>

    <etm-pop
      :visible="showAgreement"
      pop="complex"
      title="软件许可及服务协议"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="showAgreement = false"
    >
      <div class="agreement" v-html="agreementHTML" />
    </etm-pop>
  </div>

</template>

<script>/**
 * EtmUserAgreement create by haijinsha
 * createTime 2020/12/9 16:21
 */
import { queryAgreementByType } from '@/api/base/base'
import pubsub from '@/utils/PubSub'
export default {
  name: 'EtmUserAgreement',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showAgreement: false,
      agreementHTML: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      pubsub.subscribe('configReady', () => {
        queryAgreementByType('bpcLoginAgreement').then(res => {
          this.agreementHTML = res.data
        })
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.EtmUserAgreement-wrap {
  @include c_secondary_color();
  font-size: 12px;

  .text {
    @include etm-color();
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
