<template>
  <div class="Empty-wrap">
    <etm-table-page :columns="columns" />
  </div>

</template>

<script>
/**
 * Empty create by haijinsha
 * createTime 2020/9/28 18:35
 */
export default {
  name: 'Empty',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      columns: [
        {
          label: '测试1'
        },
        {
          label: '测试2'
        }
      ]
    }
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
  .Empty-wrap {

  }
</style>
