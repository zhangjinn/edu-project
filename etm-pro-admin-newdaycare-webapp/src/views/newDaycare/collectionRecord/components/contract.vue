<template>
  <div class="contract-wrap">
    <etm-layout-split>
      <etm-title
        :show-line="false"
        border
        size="big"
      >
        合同详情
      </etm-title>
      <div>
        <component
          :is="popComponent[dealType]"
          ref="component"
          :prop="prop"
        />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * contract create by Administrator
 * createTime 2021/3/15/015 15:23
 */
import teach from '@/views/newDaycare/contract/teachContract/components/chargeDetailText'
import care from '@/views/newDaycare/contract/careContract/components/chargeDetailText'
export default {
  name: 'Contract',
  components: { teach, care },
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    },
    dealType: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      popComponent: {
        teach: 'teach',
        care: 'care'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
