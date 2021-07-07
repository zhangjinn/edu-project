<template>
  <div class="BottomTabBar">
    <van-tabbar
      v-model="active"
      class="tabBar"
      active-color="#222222"
      inactive-color="#999999"
    >
      <van-tabbar-item
        v-for="(item,index) in tabbars"
        :key="index"
        replace
        :to="item.path"
      >
        <span> {{ item.title }}</span>
        <template #icon="props">
          <img class="img" :src="active === index ? item.imgSelect : item.img">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

import { getSolutionList } from '@/service/base/basic'
import home from '@/assets/images/basic/home.png'
import home_select from '@/assets/images/basic/home_selected.png'
import workBench from '@/assets/images/basic/workbench.png'
import workBench_select from '@/assets/images/basic/workbench_selected.png'
// import database from '@/assets/images/basic/database.png'
// import database_select from '@/assets/images/basic/database_selected.png'
import mine from '@/assets/images/basic/mine.png'
import mine_select from '@/assets/images/basic/mine_selected.png'
import { getSolution } from '@/js/localStore'

export default {
  name: 'BottomTabBar',
  data() {
    return {
      active: 0, // 当前选中标签，默认首页选中
      tabbars: [],
      tabData: [
        {
          name: null,
          path: null,
          title: '首页',
          img: home,
          imgSelect: home_select
        },
        {
          name: 'workBench',
          path: '/workBench',
          title: '工作台',
          img: workBench,
          imgSelect: workBench_select
        },
        {
          name: 'mine',
          path: '/mine',
          title: '我的',
          img: mine,
          imgSelect: mine_select
        }
      ],
      hasHomepage: false,
      homepageUrl: '',
      hasFileCenter: false,
      fileCenterUrl: ''
    }
  },
  watch: {
    '$route': 'getPath'
  },
  created() {
    this.getApp()
  },
  methods: {
    getApp() {
      const solutionList = getSolution()
      if (!solutionList) {
        const param = {
          terminalType: 'MOBILE'
        }
        getSolutionList(param).then(res => {
          const data = res.data.data
          this.dealSolution(data.solutionList)
        })
      } else {
        this.dealSolution(solutionList)
      }
    },
    dealSolution(data) {
      this.hasHomepage = false
      this.tabbars = []
      data.forEach(list => {
        if (list.type === 'BUSINESS' && list.resourceList.length) {
          list.resourceList.forEach(item => {
            if (item.identify) {
              const identify = JSON.parse(item.identify)
              if (identify.pageType === 'home') {
                this.hasHomepage = true
                this.homepageUrl = identify.name
              } else if (identify.pageType === 'database') {
                this.hasFileCenter = true
                this.fileCenterUrl = identify.name
              }
            }
          })
        }
      })
      this.tabData.forEach((tab, index) => {
        if (index === 0) {
          if (this.hasHomepage) {
            const data = tab
            data.name = this.homepageUrl
            data.path = '/' + this.homepageUrl
            this.tabbars.push(data)
          }
        } else {
          this.tabbars.push(tab)
        }
      })
      this.getPath(this.$route)
    },
    getPath(route) {
      if (route.meta.fActive >= 0) {
        var tab = route.meta.fActive
        if (this.hasHomepage) {
          this.active = tab
        } else {
          this.active = tab - 1
        }
      }
    }
  }
}
</script>

<style lang="scss">

.BottomTabBar {
  .tabBar {
    height: 50px;
  }

  span {
    font-size: 12px;
  }

  .img {
    width: 24px;
    height: 24px;
  }
}
</style>
