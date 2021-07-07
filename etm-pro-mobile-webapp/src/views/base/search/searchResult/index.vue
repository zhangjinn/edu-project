<template>
  <div class="searchResult textLeft">
    <div class="searchBox">
      <form action="/">
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          show-action
          @cancel="onCancel"
          @search="onSearch"
          @focus="search"
        />
      </form>
    </div>
    <div v-if="!searchOn" class="historyBox">
      <div v-if="userHistory.length" class="history textLeft">
        <div class="title van-hairline--bottom">
          <span>搜索历史</span>
          <span class="right" @click="cancelHistory">清空</span>
        </div>
        <div class="container">
          <template v-for="(item,index) in userHistory">
            <div :key="index" class="historyList van-hairline--bottom" @click="confirm(item)">
              <span class="iconfont iconhistory left" />
              <span class="van-ellipsis historyName left">{{ item }}</span>
              <span class="iconfont iconout right" @click.stop="remove(index)" />
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="customers.length || employees.length || applications.length">
        <div class="tabs">
          <div class="tab van-hairline--bottom">
            <template v-for="(item,index) in tabs">
              <span
                :key="index"
                :class="active === index ? 'active' : ''"
                @click="tabChange(index)"
              >{{ item }}</span>
            </template>
            <i class="bottomLine" :style="{left: lineLeft}" />
          </div>
        </div>
        <div class="result">
          <div v-if="customers.length && (active === 0 || active === tabs.indexOf('客户'))" class="listBox">
            <div class="listTitle">
              <div class="title">客户</div>
            </div>
            <div class="container">
              <template v-for="(item,index) in customers">
                <universal-card
                  :key="index"
                  :icon="item.iconUrl"
                  :name="item.customerName"
                  :content="item.contactTelephone"
                  :search-value="searchValue"
                  @click.native="toCusDetail(item.customerId)"
                >
                  <span class="labelColor">{{ item.important }}</span>
                </universal-card>
              </template>
              <div v-for="(item,index) in customers" :key="index" class="list">
                <div class="left iconBox textCenter emImg">
                  <img v-if="item.iconUrl" :src="item.iconUrl">
                  <div v-else class="noImg" />
                </div>
                <div class="left name">
                  <span>{{ sub(item.customerName,1) }}</span>
                  <span class="mark">{{ sub(item.customerName,2) }}</span>
                  <span>{{ sub(item.customerName,3) }}</span>
                </div>
                <div class="right">{{ item.important }}</div>
              </div>
            </div>
          </div>
          <div v-if="employees.length && (active === 0 || active === tabs.indexOf('同事'))" class="listBox">
            <div class="listTitle">
              <div class="title">同事</div>
            </div>
            <div class="container">
              <template v-for="(item,index) in employees">
                <universal-card
                  :key="'em'+index"
                  :icon="item.portrait"
                  :name="item.name"
                  :content="item.telephone"
                  :search-value="searchValue"
                  @click.native="toColDetail(item.personId)"
                />
              </template>
            </div>
          </div>
          <div
            v-if="applications.length && (active === 0 || active === tabs.indexOf('应用'))"
            class="listBox"
          >
            <div class="listTitle">
              <div class="title">应用</div>
            </div>
            <div class="applicationList">
              <div
                v-for="(item,index) in applications"
                :key="index"
                class="list"
                @click="toApp(item.principal)"
              >
                <div class="left iconBox textCenter appIcon">
                  <span :class="item.icon" />
                </div>
                <div class="left name">
                  <span>{{ sub(item.appName,1) }}</span>
                  <span class="mark">{{ sub(item.appName,2) }}</span>
                  <span>{{ sub(item.appName,3) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noResult">
        <no-content message="抱歉，没有找到相关结果" type="search" />
      </div>
    </div>
  </div>
</template>

<script>
import { getApplicationList } from '../../../../service/base/basic'
import { getEmployee } from '../../../../service/base/contact'
import universalCard from '../../../../components/common/universalCard'
import noContent from '../../../../components/common/noContent'
import {
  getLoginInfo,
  getSearhHistory,
  setSearhHistory,
  removeSearhHistory
} from '../../../../js/localStore'
import { getOrgMsg } from '../../../../js/organization'
import { replaceSpace } from '../../../../js/rules'

export default {
  name: 'SearchResult',
  components: {
    universalCard,
    noContent
  },
  data() {
    return {
      searchOn: false,
      searchValue: '',
      active: 0,
      organizationId: '',
      accountId: '',
      userHistory: [],
      history: {},
      customers: [],
      applications: [],
      employees: [],
      lineLeft: 0,
      tabs: ['全部']
    }
  },
  created() {
    this.organizationId = getOrgMsg('id')
    this.searchValue = this.$route.query.searchText
    this.accountId = getLoginInfo().id
    this.onSearch()
  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.onCancel, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.onCancel, false)// false阻止默认事件
  },
  methods: {
    getHistory() {
      if (getSearhHistory()) {
        this.history = getSearhHistory()
        if (this.history[this.accountId]) {
          this.userHistory = this.history[this.accountId]
        }
      }
    },
    onCancel() {
      if (this.searchOn) {
        this.$router.replace({
          path: '/search'
        })
      } else {
        this.$router.replace({
          path: '/index'
        })
      }
    },
    tabChange(index) {
      this.active = index
      this.lineLeft = (30 + 35) * index + 'px'
    },
    cancelHistory() {
      this.$dialog.confirm({
        title: '确认清空历史记录？',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.history = []
        removeSearhHistory()
      }).catch(() => {
        // oncancel
      })
    },
    remove(index) {
      this.userHistory.splice(index, 1)
      this.history[this.accountId] = this.userHistory
      setSearhHistory(this.history)
    },
    confirm(item) {
      this.searchValue = item
      this.onSearch()
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      if (this.searchValue) {
        if (this.searchValue !== this.$route.query.searchText) {
          this.$router.push({
            path: 'searchResult',
            query: {
              searchText: this.searchValue
            }
          })
          if (this.userHistory.indexOf(this.searchValue) === -1) {
            this.userHistory.unshift(this.searchValue)
          } else {
            this.userHistory.splice(this.userHistory.indexOf(this.searchValue), 1)
            this.userHistory.unshift(this.searchValue)
          }
          this.history[this.accountId] = this.userHistory
          setSearhHistory(this.history)
        }
        this.searchOn = true
        this.tabs = ['全部']
        this.applicationSearch()
        this.employeeSearch()
      }
    },
    search() {
      this.getHistory()
      this.searchOn = false
    },
    sub(txt, type) {
      const index = txt.indexOf(this.searchValue)
      if (type === 1) {
        return txt.substring(0, index)
      } else if (type === 2) {
        return this.searchValue
      } else if (type === 3) {
        return txt.substring(index).replace(this.searchValue, '')
      }
    },
    getPosition(list) {
      let poster = ''
      if (list) {
        const postLen = list.length
        if (postLen > 0) {
          for (let i = 0; i < postLen; i++) {
            if (i === 1) {
              poster += list[i].name + '…等'
              break
            } else if (i === postLen - 1) {
              poster += list[i].name
            } else {
              poster += list[i].name + '、'
            }
          }
        }
      }
      return poster
    },
    applicationSearch() {
      const param = {
        keyword: this.searchValue
      }
      getApplicationList(param).then(res => {
        const applications = res.data.data
        this.applications = applications
        if (applications.length) {
          this.tabs.push('应用')
        }
      })
    },
    employeeSearch() {
      const param = {
        organizationId: this.organizationId,
        keyword: this.searchValue,
        paged: false
      }
      getEmployee(param).then(res => {
        const employees = res.data.data.content
        this.employees = employees
        if (employees.length) {
          this.tabs.push('同事')
        }
      })
    },
    toApp(path) {
      this.$router.push({
        path: path
      })
    },
    toCusDetail(id) {
      this.$router.push({
        path: '/customerDetail',
        query: {
          customerId: id
        }
      })
    },
    toColDetail(id) {
      this.$router.push({
        path: '/colleaguesDetails',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .searchResult {

        .searchBox {
            .van-search {
                padding: 15px 0 0 12px;
            }

            .van-search__content {
                height: 36px;
                @include border-radius(6px);
            }

            .van-search__action {
                color: $theme;
                background-color: $white;
            }
        }

        .historyBox {
            height: calc(100vh - 101px);
            background-color: $white;

            .history {
                padding: 12px;

                .title {
                    overflow: hidden;

                    span:first-child {
                        font-size: 15px;
                        font-weight: bold;
                    }

                    span:last-child {
                        font-size: 14px;
                        color: $text-6;
                    }
                }

                .container {
                    max-height: calc(100vh - 146px);
                    overflow-y: scroll;

                    .historyList {
                        height: 45px;
                        line-height: 45px;

                        .iconhistory {
                            font-size: 14px;
                            color: $text-b;
                        }

                        .historyName {
                            max-width: 80%;
                            margin-left: 8px;
                            font-size: 15px;
                        }

                        .iconout {
                            font-size: 12px;
                            color: $text-b;
                        }
                    }
                }
            }
        }

        .tabs {
            padding: 12px 12px 0;
            font-size: 15px;
            background-color: $white;

            div {
                position: relative;
                line-height: 40px;

                .bottomLine {
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                    @include wh(30px, 2px);
                    background-color: $theme;
                    transition: left 0.3s;
                }
            }

            span {
                margin-right: 35px;
                color: $text-6;

                &.active {
                    position: relative;
                    color: $text-2;
                    font-weight: bold;
                }
            }
        }

        .result {
            max-height: calc(100vh - 153.5px);
            overflow-y: scroll;

            .listBox {
                background-color: $white;

                &:not(:first-child) {
                    margin-top: 12px;
                }

                .listTitle {
                    padding: 0 12px;

                    .title {
                        padding: 12px 0;
                        font-size: 14px;
                        color: $text-9;
                    }
                }

                .applicationList {
                    padding: 0 12px;
                }

                .list {
                    padding: 15px 0;
                    overflow: hidden;

                    &:not(:last-child) {
                        position: relative;

                        &::after {
                            display: inline-block;
                            position: absolute;
                            bottom: 1px;
                            right: 0;
                            content: '';
                            width: calc(100% - 50px);
                            height: 1px;
                            background-color: $text-e;
                        }
                    }

                    .iconBox {
                        @include wh(35px, 35px);
                        line-height: 35px;
                    }

                    .emImg {
                        @include border-radius(50%);
                        overflow: hidden;

                        .noImg {
                            background-color: $theme;
                            font-size: 13px;
                            color: $white;
                        }
                    }

                    .appIcon {
                        background-color: $theme;
                        @include border-radius(4px);

                        .iconfont {
                            font-size: 20px;
                            color: $white;
                        }
                    }

                    .name {
                        margin-left: 15px;
                        font-size: 15px;
                        line-height: 35px;

                        .mark {
                            color: $theme;
                        }
                    }
                }

            }

        }

        .noResult {
            padding-top: 100px;
            height: calc(100vh - 100px);
            background-color: $white;
        }
    }
</style>
