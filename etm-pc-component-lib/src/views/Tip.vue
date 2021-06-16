<template>
  <div class="Tip-wrap">
    Tip
    <el-button @click="handelClick('success')">success</el-button>
    <el-button @click="handelClick('warn')">warn</el-button>
    <el-button @click="handelClick('error')">error</el-button>
  </div>

</template>

<script>
/**
 * Tip create by haijinsha
 * createTime 2020/9/9 14:14
 */
export default {
  name: 'Tip',
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
  methods: {
    handelClick(type) {
      this.$etmTip.init({
        type,
        cancelBtn: '不了',
        confirm() {
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
  .Tip-wrap {

  }
</style>
