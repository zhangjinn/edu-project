<template>
    <div class="etm-hr-wrap"></div>
</template>

<script>
/**
 * etm-hr create by haijinsha
 * createTime 2020/7/17 14:37
 */
export default {
  name: 'etm-hr',
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
    .etm-hr-wrap {
        border-top: 2px dashed #eee !important;
        position: relative;
        margin: 88px 0;

        &:before {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            content: '我 是 分 割 线';
            color: #999;
            background-color: transparent;
        }
    }
</style>
