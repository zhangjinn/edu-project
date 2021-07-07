<template>
  <div class="copyright-wrap">
    <span href="//etmcn.com">© etmcn.com</span>
  </div>

</template>

<script>
/**
 * copyright create by haijinsha
 * createTime 2020/12/9 17:02
 */
export default {
  name: 'Copyright',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
.copyright-wrap {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
  @include c_secondary_color();

  &:hover {
    @include etm-color();
    cursor: pointer;
  }
}
</style>
