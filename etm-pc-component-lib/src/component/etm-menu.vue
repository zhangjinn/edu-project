<template>
  <div class="etm-menu-wrap">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="activeIndex"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item v-for="route of localRouters" :key="route.path" :index="route.path">{{ route.name }}
      </el-menu-item>
    </el-menu>
  </div>

</template>

<script>
/**
 * /etm-menu create by haijinsha
 * createTime 2020/6/2 11:19
 */
export default {
  name: 'EtmMenu',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      isCollapse: false,
      activeIndex: '/'
    }
  },
  computed: {
    localRouters() {
      return this.$router.options.routes
    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss" scoped>
    .etm-menu-wrap {
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
            min-height: 400px;
            /*background-color: #000;*/
        }
    }
</style>
