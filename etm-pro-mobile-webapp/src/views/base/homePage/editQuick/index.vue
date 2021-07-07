<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">
      {{ editOn ? '编辑快捷应用' : '快捷应用' }}
      <span slot="right" @click="edit">{{ editOn ? '完成' : '编辑' }}</span>
    </etm-mobile-title>
    <div class="appList">
      <div class="appBox">
        <div class="title van-hairline--bottom">我的快捷应用</div>
        <div class="list">
          <van-row>
            <template v-for="(item,i) in myApp">
              <van-col :key="i" class="cardBox" :span="6">
                <application-card
                  :name="item.displayName"
                  :icon="item.config.icon"
                  :state="item.state"
                  :edit-on="editOn"
                  @click="cardClick(item, i, 'remove')"
                />
              </van-col>
            </template>
          </van-row>
        </div>
      </div>
      <div class="appBox">
        <div class="title van-hairline--bottom">所有快捷应用</div>
        <div class="list">
          <van-row>
            <template v-for="(item,i) in allApp">
              <van-col :key="i" class="cardBox" :span="6">
                <application-card
                  :name="item.displayName"
                  :icon="item.config.icon"
                  :state="item.state"
                  :edit-on="editOn"
                  @click="cardClick(item, i)"
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
import EtmMobileTitle from '@/components/EtmMobileTitle'
import ApplicationCard from '../component/applicationCard'
import { queryDashboardResource, queryDashboardSetting, updateDashboardSetting } from '@/service/base/basic'

/**
 * index create by Administrator
 * createTime 2020/11/23 13:46
 */
export default {
  name: 'Index',
  components: { ApplicationCard, EtmMobileTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      editOn: false,
      myApp: [],
      allApp: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const param = {
        terminalType: 'MOBILE'
      }
      queryDashboardResource(param).then(res => {
        const data = res.data.data
        this.allApp = []
        data.forEach(item => {
          if (item.type === 'QUICK_OPERATION') {
            item.config = JSON.parse(item.config)
            this.allApp.push(item)
          }
        })
        this.getMyData()
      })
    },
    getMyData() {
      const param = {
        terminalType: 'MOBILE',
        type: 'QUICK_OPERATION'
      }
      queryDashboardSetting(param).then(res => {
        const data = res.data.data.resourceConfig
        this.myApp = []
        if (data['QUICK_OPERATION']) {
          const list = data['QUICK_OPERATION']
          this.allApp.forEach((item, index) => {
            for (let i = 0; i < list.length; i++) {
              if (item.dashboardResourceId === list[i]) {
                const app = item
                app.state = 'install'
                this.myApp.push(app)
                this.allApp.splice(index, 1, app)
              }
            }
          })
        } else {
          this.allApp.forEach((item, index) => {
            if (item.type === 'QUICK_OPERATION') {
              if (this.myApp.length < 8) {
                const app = item
                app.state = 'install'
                this.myApp.push(app)
                this.allApp.splice(index, 1, app)
              }
            }
          })
        }
      })
    },
    reback() {
      this.$router.back(-1)
    },
    edit() {
      if (this.editOn) {
        const arr = []
        this.myApp.forEach(item => {
          arr.push(item.dashboardResourceId)
        })
        const param = {
          terminalType: 'MOBILE',
          type: 'QUICK_OPERATION',
          dashboardResourceIdList: arr
        }
        updateDashboardSetting(param).then(() => {
          setTimeout(() => {
            this.$toast({
              message: '保存成功',
              duration: 1000,
              icon: 'icon iconfont iconsuccess'
            })
          }, 50)
          setTimeout(() => {
            this.getData()
          }, 1000)
        })
      }
      this.editOn = !this.editOn
    },
    cardClick(data, index, type) {
      if (this.editOn) {
        if (type === 'remove') {
          this.allApp.forEach((all, i) => {
            if (all.dashboardResourceId === data.dashboardResourceId) {
              const data = all
              data.state = null
              this.allApp.splice(i, 1, data)
            }
          })
          this.myApp.splice(index, 1)
        } else {
          if (data.state === 'install') {
            this.myApp.forEach((item, i) => {
              if (item.dashboardResourceId === data.dashboardResourceId) {
                this.myApp.splice(i, 1)
              }
            })
            data.state = null
            this.allApp.splice(index, 1, data)
          } else {
            if (this.myApp.length < 11) {
              data.state = 'install'
              this.allApp.splice(index, 1, data)
              this.myApp.push(data)
            } else {
              this.$toast({
                message: '快捷应用数量已达上限',
                icon: 'icon iconfont iconwarning'
              })
            }
          }
        }
      } else {
        if (data.detailUri) {
          this.$router.push({
            path: data.detailUri
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .appList {
    padding: 12px;

    .appBox {
      padding: 0 16px;
      background-color: $white;
      border-radius: 6px;

      & + .appBox {
        margin-top: 12px;
      }

      .title {
        padding: 15px 0;
        text-align: left;
        font-size: 16px;
      }
    }
  }
}
</style>
