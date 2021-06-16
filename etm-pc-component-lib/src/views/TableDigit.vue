<template>
  <div class="TableDigit-wrap">
    <etm-table-digit :data="data" />
  </div>

</template>

<script>
/**
   * TableDigit create by 油麦菜
   * createTime 2021/1/22 13:54
   */
export default {
  name: 'TableDigit',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      data: [
        {
          digit: -12,
          text: '测试测试'
        },
        {
          digit: 12,
          text: '测试测试'
        }
      ]
    }
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
  .TableDigit-wrap {

  }
</style>
