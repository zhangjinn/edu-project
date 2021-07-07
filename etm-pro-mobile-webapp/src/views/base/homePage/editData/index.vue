<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">
      {{ editOn ? '编辑数据卡' : '快捷数据卡' }}
      <span slot="right" @click="edit">{{ editOn ? '完成' : '编辑' }}</span>
    </etm-mobile-title>
    <div class="dataList">
      <div class="myBox">
        <div class="title">我的数据卡</div>
        <div class="cardBox">
          <div
            v-for="(item, index) in myData"
            :key="index"
            class="card"
            :class="item.state === 'install' ? 'active' : ''"
            @click="cardClick(item, index, 'remove')"
          >{{ item.displayName }}
            <template v-if="editOn">
              <span v-if="item.state === 'install'" class="iconfont iconshanchu" />
              <span v-else class="iconfont iconzengjia" />
            </template>
          </div>
        </div>
      </div>
      <div class="allBox">
        <div class="title">所有数据卡</div>
        <div class="cardBox">
          <div
            v-for="(item, index) in allData"
            :key="index"
            class="card"
            :class="item.state === 'install' ? 'active' : ''"
            @click="cardClick(item, index)"
          >{{ item.displayName }}
            <template v-if="editOn">
              <span v-if="item.state === 'install'" class="iconfont iconshanchu" />
              <span v-else class="iconfont iconzengjia" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import EtmMobileTitle from '@/components/EtmMobileTitle'
import { queryDashboardResource, queryDashboardSetting, updateDashboardSetting } from '@/service/base/basic'

/**
 * index create by Administrator
 * createTime 2020/11/23 13:47
 */
export default {
  name: 'Index',
  components: { EtmMobileTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      editOn: false,
      myData: [],
      allData: []
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
        this.allData = []
        data.forEach(item => {
          if (item.type === 'DATA_CARD') {
            item.config = JSON.parse(item.config)
            this.allData.push(item)
          }
        })
        this.getMyData()
      })
    },
    getMyData() {
      const param = {
        terminalType: 'MOBILE',
        type: 'DATA_CARD'
      }
      queryDashboardSetting(param).then(res => {
        const data = res.data.data.resourceConfig
        this.myData = []
        if (data['DATA_CARD']) {
          const list = data['DATA_CARD']
          this.allData.forEach((item, index) => {
            for (let i = 0; i < list.length; i++) {
              if (item.dashboardResourceId === list[i]) {
                const app = item
                app.state = 'install'
                this.myData.push(app)
                this.allData.splice(index, 1, app)
              }
            }
          })
        } else {
          this.allData.forEach((item, index) => {
            if (item.type === 'DATA_CARD') {
              if (this.myData.length < 4) {
                const app = item
                app.state = 'install'
                this.myData.push(app)
                this.allData.splice(index, 1, app)
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
        this.myData.forEach(item => {
          arr.push(item.dashboardResourceId)
        })
        const param = {
          terminalType: 'MOBILE',
          type: 'DATA_CARD',
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
          this.allData.forEach((all, i) => {
            if (all.dashboardResourceId === data.dashboardResourceId) {
              const data = all
              data.state = null
              this.allData.splice(i, 1, data)
            }
          })
          this.myData.splice(index, 1)
        } else {
          if (data.state === 'install') {
            this.myData.forEach((item, i) => {
              if (item.dashboardResourceId === data.dashboardResourceId) {
                this.myData.splice(i, 1)
              }
            })
            data.state = null
            this.allData.splice(index, 1, data)
          } else {
            data.state = 'install'
            this.allData.splice(index, 1, data)
            this.myData.push(data)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  min-height: 100%;
  background-color: $white;

  .dataList {
    padding: 12px;

    .title {
      padding: 8px 0 20px;
      text-align: left;
    }

    .cardBox {
      display: flex;
      flex-wrap: wrap;

      .card {
        position: relative;
        padding: 0 12px;
        margin: 0 12px 12px 0;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        border-radius: 16px;
        background-color: #F7F6FB;

        &.active {
          color: $white;
          background-color: $theme;
        }

        .iconfont {
          position: absolute;
          right: 0;
          top: -8px;
          height: 15px;
          line-height: 15px;
          font-size: 15px;

          &.iconzengjia {
            color: #4383F9;
          }

          &.iconshanchu {
            color: $red;
          }
        }
      }
    }
  }
}
</style>
