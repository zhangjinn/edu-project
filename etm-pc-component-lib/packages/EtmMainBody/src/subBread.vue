<template>
  <div class="subBread">
    <div :class="hideBread ? 'subBreadCrumb hide' : 'subBreadCrumb'">
      您当前所在的位置:
      <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="item in routeSet" :key="item.route">
            <span v-if="currentRoute === item.route">{{ item.name }}</span>
            <a v-else @click.stop.prevent="handleJump(item.route)">{{ item.name }}</a>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div :class="hideBread ? 'mainView hide' : 'mainView'">
      <transition name="fade-transform" mode="out-in">
        <component :is="currentView" @switch="handleSwitch" @jump="handleJump" />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubBread',
  props: {
    historyKey: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      route: [], // 记录路径，渲染面包屑的依据
      currentRoute: '', // 当前访问的页面
      currentView: null, // 当前展示的页面
      currentIndex: -1 // 当前所在的路径索引
    }
  },
  computed: {
    routeSet() {
      return Array.from(new Set(this.route))
    },
    init() {
      if (Array.isArray(this.data[0])) {
        return this.data
      } else {
        return [this.data]
      }
    },
    head() { // 头部导航对象
      return this.init[0][0]
    },
    hkey() {
      return this.historyKey
    },
    hideBread() {
      return this.head.route === this.currentRoute
    }
  },
  created() {
    // 如果没有
    this.currentView = this.head.view
    this.currentRoute = this.head.route
    this.route.push(this.head)

    // if (sessionStorage.getItem(this.hkey)) {
    //   // 如果有保留的浏览历史
    //   const { route, index } = JSON.parse(sessionStorage.getItem(this.hkey))
    //   this.currentIndex = index
    //   this.handleJump(route)
    // } else {
    //   // 如果没有
    //   this.currentView = this.head.view
    //   this.currentRoute = this.head.route
    //   this.route.push(this.head)
    // }
  },
  destroyed() {
    setTimeout(() => {
      if (JSON.parse(window.localStorage.getItem('tagClose'))) {
        window.sessionStorage.removeItem(this.hkey)
        window.localStorage.setItem('tagClose', false)
      }
    }, 500)
  },
  methods: {
    // 只能往深一层进入的操作
    handleSwitch(arg) {
      let target, index
      if (typeof arg === 'string') {
        target = arg
        index = 0
      } else {
        target = arg.target
        index = arg.index
      }
      for (const i of this.init[index]) {
        if (target === i.route) {
          this.currentView = i.view
          this.currentRoute = i.route
          this.route.push(i)
          this.currentIndex = index
          // sessionStorage.setItem(this.hkey, JSON.stringify({ route: this.currentRoute, index: this.currentIndex }))
          break
        }
      }
    },
    // 往前跳转的操作
    handleJump(target) {
      const result = []
      for (let i = 0; i < this.init[this.currentIndex].length; i++) {
        const item = this.init[this.currentIndex][i]
        if (item.route === target) {
          break
        }
        result.push(item)
      }
      this.route = result
      this.handleSwitch({ target, index: this.currentIndex })
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/src/etm/subBread.scss"
</style>
