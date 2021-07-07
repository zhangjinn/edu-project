<template>
  <div id="app">
    <!-- 路由匹配到的组件将渲染在这里 -->
    <div v-if="$route.meta.showTab" class="wrap">
      <div class="container" :class="!hidshow ? 'hidshow' : !noBottom ? 'noBottom' : ''">
        <div class="content">
          <router-view v-if="isRouterAlive" :key="$route.fullPath"/>
        </div>
      </div>
      <div v-show="hidshow" class="bottom">
        <bottom-tab-bar v-if="showTabs" />
      </div>
    </div>
    <div v-else class="wrap">
      <router-view v-if="isRouterAlive" :key="$route.fullPath"/>
    </div>
  </div>

</template>

<script>
import bottomTabBar from './components/common/bottomTabBar'
import {
  getExpiresIn, getSolutionRouter,
  getTokenTime,
  removeToken,
  setExpiresIn,
  setToken,
  setTokenTime
} from './js/localStore'
import { updateToken } from './service/base/login'

export default {
  name: 'App',
  components: {
    [bottomTabBar.name]: bottomTabBar
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      screenHeight: document.body.clientHeight, // 这里是给到了一个默认值 （这个很重要），
      originHeight: document.body.clientHeight, // 默认高度在watch里拿来做比较
      showTabs: true
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    },
    noBottom() {
      return this.$store.state.show.showTabBar
    },
    orgChange() {
      return this.$store.state.org.orgChange
    }
  },
  watch: {
    originHeight() {
      if ((this.screenHeight - 100) > this.originHeight) {
        this.$store.commit('show/SET_SHOW', false)
      } else {
        this.$store.commit('show/SET_SHOW', true)
      }
    },
    $route() {
      if (!getTokenTime()) return
      const tokenTime = new Date(getTokenTime()).getTime()
      const expiresIn = getExpiresIn() * 1000
      const nowTime = new Date().getTime()
      const time = tokenTime + expiresIn - nowTime
      if (time < (3600 * 1000)) {
        removeToken()
      }
      if (time >= (3600 * 1000) && time < (24 * 3600 * 1000)) {
        updateToken().then(res => {
          const data = res.data.data
          setTokenTime(new Date())
          setToken(data.token)
          setExpiresIn(data.expiresIn)
        })
      }
    },
    orgChange() {
      this.showTabs = false
      this.$nextTick(() => {
        this.showTabs = true
      })
    }
  },
  mounted() {
    const url = window.location.href
    if (url.includes('organizationId')) {
      const lastUrl = this.getLastUrl(url, '/')
      sessionStorage.setItem('lastUrl', lastUrl)
      const query = this.getQuery(url)
      if (query) {
        sessionStorage.setItem('lastUrlQuery', JSON.stringify(query))
      }
    }
    if (url.includes('wechat')) {
      localStorage.setItem('platform', 'wechat')
    } else {
      localStorage.setItem('platform', 'browser')
    }
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.originHeight = document.body.clientHeight
      })()
    }
    window.addEventListener('beforeunload', () => {
      const lastUrl = this.getLastUrl(window.location.href, '/')
      const solutionRouter = getSolutionRouter()
      if (solutionRouter) {
        solutionRouter.forEach(item => {
          if (item.path === lastUrl) {
            sessionStorage.setItem('lastUrl', lastUrl)
            const query = this.getQuery(window.location.href)
            if (query) {
              sessionStorage.setItem('lastUrlQuery', JSON.stringify(query))
            }
          }
        })
      }
    })
  },
  beforeDestroy() {
    window.onresize = null // 注销window.onresize事件
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    getLastUrl(url, str) {
      if (url.includes('?')) {
        url = url.split('?')[0]
      }
      return url.slice(url.lastIndexOf(str))
    },
    getQuery(url) {
      if (!url.includes('?')) return null
      const str = url.split('?')[1]
      const arr = str.split('&')
      const data = {}
      arr.forEach(item => {
        const key = item.split('=')[0]
        data[key] = item.split('=')[1]
      })
      return data
    }
  }

}
</script>

<style scoped lang="scss">
#app {
  height: 100%;
  text-align: center;
  font-size: 15px;
  color: $text-2;
}

.wrap {
  width: 100%;
  height: 100%;
}

.container {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  bottom: 50px;
  width: 100%;

  &.hidshow {
    bottom: 0;
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: scroll;
  }

  &.noBottom {
    bottom: 0;

    .content {
      bottom: 50px;
    }
  }
}
</style>
