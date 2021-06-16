<template>
  <div
    id="newdaycare"
    class="newdaycare"
  >
    <el-container>
      <el-aside
        v-if="isDev"
        id="etm-aside"
        width="190px"
      >
        <el-menu
          class="etm-menu"
          router
        >
          <el-scrollbar>
            <el-menu-item
              v-for="(route, index) of routes"
              :key="index"
              :index="route.path"
            >
              <i class="el-icon-setting" />
              <span slot="title">{{ route.meta.title }}</span>
            </el-menu-item>
          </el-scrollbar>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0;">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { routes } from '@/router'

export default {
  name: 'App',
  data () {
    return {
      routes: routes,
      isDev: false
    }
  },
  mounted () {
    this.isDev = this.$root.$options.isDev
  }
}
</script>
<style scoped lang="scss">
.micro-wrapper {
  .etm-menu {
    height: calc(100vh - 128px);
  }
}

</style>
