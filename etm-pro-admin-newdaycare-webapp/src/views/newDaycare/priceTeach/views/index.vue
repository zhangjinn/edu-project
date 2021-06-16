<template>
  <div class="index-wrap">
    <etm-main-body>
      <main-content />
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/08/31 14:05
 */
// import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './main'
export default {
  name: 'Index',
  components: {
    // etmMainBody,
    mainContent
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    handleSearch () {},
    reset () {}
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  //margin-top: 16px;
}
</style>
