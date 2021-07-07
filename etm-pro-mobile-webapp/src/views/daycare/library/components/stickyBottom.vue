<template>
  <div class="stickyBottom-wrap">
    <div class="sticky">
      <div class="stance" />
      <div class="ele">
        <slot />
      </div>
    </div>
  </div>

</template>

<script>
/**
 * stickyBottom create by 油麦菜
 * createTime 2020/11/30 13:44
 */
export default {
  name: 'StickyBottom',
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
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.stickyBottom-wrap {
  .sticky {
    .stance {
      height: 50px;
    }
    .ele {
      position: fixed;
      left: 0;
      bottom: 0;
      height: 50px;
      width: 100%;
    }
  }
}
</style>
