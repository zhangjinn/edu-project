<template>
  <div class="workbench">
    <div class="workbenchAd">
      <van-swipe :show-indicators="false" style="height: 4.37rem;" :autoplay="3000">
        <van-swipe-item v-for="(list, index) in adList" :key="index">
          <img :src="list.imageUrl" @click="openAd(list.linkUrl)">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="appList">
      <div v-for="(app, index) in appList" :key="index" class="app">
        <div class="title textLeft">
          <div class="text">{{ app.displayName }}</div>
        </div>
        <div class="applicationBox">
          <van-row>
            <template v-for="(item,i) in app.resourceList">
              <van-col v-if="item.type === 'MENU'" :key="i" class="cardBox" :span="8">
                <application-card
                  :name="item.displayName"
                  :icon="item.iconCode"
                  @click="cardClick(item.url)"
                />
              </van-col>
            </template>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import applicationCard from './components/applicationCard'
import { getSolution } from '@/js/localStore'
import { setAsyncRouter } from '@/utils/permiss'
import ad_workbench from '@/assets/images/ad_workbench.png'
import { queryAdvertisement } from '@/service/base/basic'

export default {
  name: 'WorkBench',
  components: {
    applicationCard
  },
  data() {
    return {
      appList: [],
      bgImg: ad_workbench,
      adList: []
    }
  },
  created() {
    this.getApp()
  },
  mounted() {
    this.getAdImg()
  },
  methods: {
    getAdImg() {
      const param = {
        position: 'ADVERTISEMENT_ON_TOP_OF_WORKBENCH',
        displayScope: 'MOBILE_MANAGEMENT_SCOPE'
      }
      queryAdvertisement(param).then(res => {
        this.adList = res.data.data
        if (res.data.data.length === 0) {
          this.adList = [
            {
              imageUrl: this.bgImg
            }
          ]
        }
      })
    },
    openAd(url) {
      if (url) {
        location.replace(url)
      }
    },
    cardClick(path) {
      this.$router.push({
        path: path
      })
    },
    getApp() {
      const solutionList = getSolution()
      if (solutionList) {
        setAsyncRouter()
        this.appList = []
        solutionList.forEach(list => {
          if (list.type === 'BUSINESS' && list.resourceList.length) {
            list.resourceList.forEach((item, index) => {
              if (item.type === 'MENU' && item.identify) {
                const identify = JSON.parse(item.identify)
                if (identify.pageType === 'home') {
                  list.resourceList.splice(index, 1)
                }
              }
            })
            this.appList.push(list)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.workbench {
  min-height: 100%;
  background-color: $bg-5;

  .appList {
    position: relative;
    margin-top: -61px;
    padding: 0 12px 16px;
  }

  .app {
    background-color: $white;
    border-radius: 6px;

    & + .app {
      margin-top: 12px;
    }
  }

  .title {
    padding: 0 16px;

    .text {
      padding: 15px 0;
      font-size: 16px;
      border-bottom: .5px solid $text-e;
    }
  }

}
</style>
