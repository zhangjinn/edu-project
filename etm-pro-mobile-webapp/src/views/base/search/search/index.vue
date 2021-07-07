<template>
  <div class="search">
    <div class="searchBox">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        show-action
        :autofocus="true"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
    <div v-if="userHistory.length" class="history textLeft">
      <div class="title">
        <span>搜索历史</span>
        <span class="right" @click="cancelHistory">清空</span>
      </div>
      <div class="historyBox">
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
</template>

<script>
import { getLoginInfo, getSearhHistory, removeSearhHistory, setSearhHistory } from '../../../../js/localStore'
import { replaceSpace } from '../../../../js/rules'

export default {
  name: 'Search',
  data() {
    return {
      searchValue: '',
      userHistory: [],
      history: {},
      userKey: ''
    }
  },
  created() {
    const user = getLoginInfo()
    this.userKey = user.id
    if (getSearhHistory()) {
      this.history = getSearhHistory()
      if (this.history[this.userKey]) {
        this.userHistory = this.history[this.userKey]
      }
    }
    if (this.$route.query.text) {
      this.searchValue = this.$route.query.text
    }
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
    onCancel() {
      this.$router.replace({
        path: '/index'
      })
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      if (this.searchValue) {
        this.$router.push({
          path: '/searchResult',
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
        this.history[this.userKey] = this.userHistory
        setSearhHistory(this.history)
      }
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
    confirm(item) {
      this.searchValue = item
      this.onSearch()
    },
    remove(index) {
      this.userHistory.splice(index, 1)
      this.history[this.userKey] = this.userHistory
      setSearhHistory(this.history)
    }
  }
}
</script>

<style lang="scss" scoped>

    .search {
        min-height: calc(100vh - 100px);
        background-color: $white;

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

            .historyBox {
                max-height: calc(100vh - 196px);
                overflow-y: scroll;

                .historyList {
                    height: 45px;
                    line-height: 45px;

                    .iconhistory {
                        font-size: 14px;
                        color: $text-b;
                    }

                    .historyName {
                        margin-left: 8px;
                        max-width: 80%;
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
</style>
