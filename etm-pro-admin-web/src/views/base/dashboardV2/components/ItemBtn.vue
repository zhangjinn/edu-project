<template>
  <div class="" :class="['ItemBtn-wrap', active ? 'active': '']" @click="$emit('click')">
    <slot />
  </div>

</template>

<script>
/**
 * ItemBtn create by haijinsha
 * createTime 2020/11/23 13:43
 */
export default {
  name: 'ItemBtn',
  components: {},
  filters: {},
  mixins: [],
  props: {
    active: {
      type: [Boolean, String],
      default: false
    }
  },
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
.ItemBtn-wrap {
  padding: 0 15px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include c_text_color();
  @include bgc_white();
  border: 1px solid $divide-color;
  border-radius: 4px;
  cursor: pointer;
  transition: all .4s;
  margin-right: 16px;
  margin-bottom: 16px;

  &:hover {
    @include etm-color();
    @include etm-bdc();
  }

  &.active {
    color: $white !important;
    @include bgc_main_color();
    @include bc_main_color();

    &:hover {
      opacity: .8;
    }
  }
}

</style>
