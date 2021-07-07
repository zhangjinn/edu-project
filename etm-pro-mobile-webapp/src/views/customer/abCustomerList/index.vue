<template>
  <div class="contBody">
    <div v-if="!multipleOn" class="topFixed">
      <div class="searchBox van-hairline--bottom">
        <van-row>
          <van-col :span="24">
            <van-search
              v-model="searchValue"
              placeholder="请输入搜索关键词"
              @search="onSearch"
            />
          </van-col>
        </van-row>
        <div class="chooseBox">
          <van-row>
            <van-col :span="8">
              <div v-if="!showSort" class="chooseIcon" @click="sortShow">
                <span>排序</span>
                <span class="iconfont iconarrow-down" />
              </div>
              <div v-else class="chooseIcon activeIcon" @click="closeMain">
                <span>排序</span>
                <span class="iconfont iconarrow-up" />
              </div>
            </van-col>
            <van-col :span="8">
              <div class="chooseIcon" @click="openFilter">
                <span>筛选</span>
                <span class="iconfont iconfilter" />
              </div>
            </van-col>
            <van-col :span="8">
              <div class="chooseIcon" @click="multiple">
                <span>多选</span>
                <span class="iconfont iconchoice" />
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div class="customerBox">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishText"
        @load="onLoad"
      >
        <template v-if="!multipleOn">
          <div class="centerFixed">
            <div class="cenTop">
              <div class="countBox">
                <div class="count left">
                  <span>共</span>
                  <span>{{ listData.length }}</span>
                  <span>人</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="listData.length" class="list">
            <template v-for="(item,index) in listData">
              <universal-card
                :key="index"
                :index="item.id"
                :icon="item.avatar"
                :name="item.name"
                :content="'放弃人: ' + item.abandoner"
                :search-value="onSearchValue"
              >
                <span class="receive textCenter" @click="getCustomer(item.id)">领取</span>
              </universal-card>
            </template>
          </div>
          <div v-else class="noneList">
            <no-content message="暂无名单" type="list" />
          </div>
        </template>
        <template v-else>
          <div class="multipleOpen van-hairline--bottom">
            <div class="mulTop">
              <div class="title textLeft">批量领取</div>
              <div class="cancel" @click="closeMultiple">取消</div>
            </div>
            <div class="mulCount">
              <div class="left">
                <van-radio-group v-model="radio" checked-color="#10C2C4">
                  <div class="left first" @click="choosePage">
                    <van-radio name="1" icon-size="16px">选中当前页面</van-radio>
                  </div>
                  <div class="left" @click="chooseAll">
                    <van-radio name="2" icon-size="16px">全选</van-radio>
                  </div>
                </van-radio-group>
              </div>
              <div class="right">
                <span>已选</span>
                <span class="chooseCount">{{ result.length }}</span>
                <span class="total">/{{ customerTotal }}</span>
                <span>人</span>
              </div>
            </div>
          </div>
          <div class="list">
            <van-checkbox-group v-model="result" checked-color="#10C2C4">
              <template v-for="(item,index) in listData">
                <universal-card
                  :key="index"
                  :multiple="true"
                  :index="item.id"
                  :icon="item.avatar"
                  :name="item.name"
                  :content="'放弃人: ' + item.abandoner"
                  :search-value="onSearchValue"
                  @click.native="confirmChoose(item.id)"
                />
              </template>
            </van-checkbox-group>
          </div>
        </template>
      </van-list>
    </div>
    <div v-show="hidshow" v-if="multipleOn" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="GetUser">
          <control-btn text="领取客户" type="primary" />
        </div>
      </div>
    </div>
    <sort
      v-if="showSort"
      :list="sortList"
      :sort-index="sortIndex"
      @getSortEmpList="getSortEmplyeeList"
      @closeSort="closeMain"
    />
    <filter-page
      v-if="showFilter"
      :filter-item="filterItem"
      :relation-index="relationIndex"
      @close="closeFilter"
      @reset="reset"
      @inquire="checkInquire"
      @index="confirmIndex"
    />
  </div>

</template>

<script>
import universalCard from '../../../components/common/universalCard'
import { postCustomerList, acquireCustomer } from '../../../service/customer/customer'
import controlBtn from '../../../components/common/controlBtn'
import sort from '../components/sortMenu'
import filterPage from '../components/filterPage'
import noContent from '../../../components/common/noContent'
import { replaceSpace } from '../../../js/rules'

export default {
  name: 'AbCustomerList',
  components: {
    universalCard,
    controlBtn,
    sort,
    filterPage,
    noContent
  },
  data() {
    return {
      multipleOn: false,
      listData: [],
      result: [],
      showMore: false,
      searchValue: '',
      onSearchValue: '',
      searchOn: false,
      sortList: [
        {
          name: '录入时间正序排列',
          sortColumn: 'CREATETIME',
          sort: 'ASC'
        },
        {
          name: '录入时间倒序排列',
          sortColumn: 'CREATETIME',
          sort: 'DESC'
        },
        {
          name: '分配时间正序排列',
          sortColumn: 'ASSIGNTIME',
          sort: 'ASC'
        },
        {
          name: '分配时间倒序排列',
          sortColumn: 'ASSIGNTIME',
          sort: 'DESC'
        }
      ],
      showOverlay: false,
      showSort: false,
      loading: false,
      finished: false,
      pageNum: 0,
      pageSize: 15,
      radio: 0,
      customerRadio: 0,
      customerTotal: 0,
      finishText: '',
      sortIndex: -1,
      filterValue: null,
      sortValue: null,
      showFilter: false,
      filterItem: [
        {
          condition: '',
          key: '',
          equal: '',
          op: '',
          value: '',
          id: '',
          showInput: false
        }
      ],
      relationIndex: 0
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    // 登陆人信息
  },
  methods: {
    getSortEmplyeeList(data) {
      this.sortValue = data
      this.clearCustomer()
    },
    sortShow() {
      this.showSort = true
      this.$store.commit('show/SET_TAB_BAR', false)
    },
    closeSort() {
      this.showSort = false
      this.$store.commit('show/SET_TAB_BAR', true)
    },
    closeMain(index) {
      this.sortIndex = index
      this.closeSort()
    },
    openFilter() {
      this.showFilter = true
      this.$store.commit('show/SET_TAB_BAR', false)
    },
    closeFilter() {
      this.showFilter = false
      this.$store.commit('show/SET_TAB_BAR', true)
    },
    confirmIndex(index) {
      this.relationIndex = index
    },
    reset() {
      this.relationIndex = 0
      this.sortIndex = -1
      this.searchOn = false
      this.searchValue = ''
      this.onSearchValue = ''
      this.filterValue = null
      this.sortValue = null
      this.filterItem = [
        {
          condition: '',
          key: '',
          equal: '',
          op: '',
          val: '',
          id: '',
          showInput: false
        }
      ]
      this.closeFilter()
      this.clearCustomer()
    },
    checkInquire(val) {
      this.filterValue = val
      this.searchOn = false
      this.searchValue = ''
      this.onSearchValue = ''
      this.closeFilter()
      this.clearCustomer()
    },
    multiple() {
      if (this.listData.length) {
        this.multipleOn = true
      }
    },
    choosePage() {
      this.result = []
      if (this.radio === this.customerRadio) {
        this.radio = 0
      } else {
        for (let i = 0; i < this.listData.length; i++) {
          this.result.push(this.listData[i].id)
        }
      }
      this.customerRadio = this.radio
    },
    chooseAll() {
      this.result = []
      if (this.radio === this.customerRadio) {
        this.radio = 0
      } else {
        const param = {
          pool: true,
          pageNum: 1,
          pageSize: 999
        }
        if (this.filterValue) {
          for (const i in this.filterValue) {
            param[i] = this.filterValue[i]
          }
        }
        if (this.sortValue) {
          for (const i in this.sortValue) {
            param[i] = this.sortValue[i]
          }
        }
        if (this.searchOn && this.searchValue) {
          param.items = [
            {
              key: 'name',
              op: 'LIKE',
              val: this.searchValue
            },
            {
              key: 'contact_telephone',
              op: 'LIKE',
              val: this.searchValue
            }
          ]
          param.op = 'OR'
        }
        postCustomerList(param).then(res => {
          const listData = res.data.data.content
          listData.forEach(item => {
            this.result.push(item.id)
          })
        })
      }
      this.customerRadio = this.radio
    },
    closeMultiple() {
      this.multipleOn = false
    },
    confirmChoose(id) {
      if (this.result.indexOf(id) === -1) {
        this.result.push(id)
      } else {
        this.result.splice(this.result.indexOf(id), 1)
      }
      if (this.result.length === this.listData.length) {
        this.radio = '1'
      } else if (this.result.length === this.customerTotal) {
        this.radio = '2'
      } else {
        this.radio = '0'
      }
    },
    GetUser() {
      if (!this.result.length) {
        this.$toast({
          message: '请选择要领取的客户',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else {
        this.$dialog.confirm({
          title: '确认领取客户？',
          confirmButtonColor: '#10C2C4',
          cancelButtonColor: '#666666'
        }).then(() => {
          this.receiveCustomer()
        }).catch(() => {
          // on cancel
        })
      }
    },
    getCustomer(id) {
      this.result = []
      this.result.push(id)
      this.$dialog.confirm({
        title: '确认领取客户？',
        confirmButtonColor: '#10C2C4',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.receiveCustomer()
      }).catch(() => {
        // on cancel
      })
    },
    receiveCustomer() {
      const param = {
        customerIds: this.result
      }
      acquireCustomer(param).then(res => {
        const data = res.data.data.returnContent
        setTimeout(() => {
          this.$toast({
            message: data,
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.result = []
          this.multipleOn = false
          this.clearCustomer()
        }, 1000)
      })
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.filterValue = null
      this.searchOn = true
      this.onSearchValue = this.searchValue
      this.clearCustomer()
    },
    clearCustomer() {
      this.listData = []
      if (this.pageNum > 1 || this.finished) {
        this.finished = false
        this.pageNum = 0
      } else {
        this.finished = false
        this.pageNum = 0
        this.getPoolCusList()
      }
    },
    // 放弃客户名单列表
    getPoolCusList() {
      this.pageNum++
      const param = {
        pool: true,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.filterValue) {
        for (const i in this.filterValue) {
          param[i] = this.filterValue[i]
        }
      }
      if (this.sortValue) {
        for (const i in this.sortValue) {
          param[i] = this.sortValue[i]
        }
      }
      if (this.searchOn && this.searchValue) {
        param.items = [
          {
            key: 'name',
            op: 'LIKE',
            val: this.searchValue
          },
          {
            key: 'contact_telephone',
            op: 'LIKE',
            val: this.searchValue
          }
        ]
        param.op = 'OR'
      }
      postCustomerList(param).then(res => {
        const listData = res.data.data.content
        this.customerTotal = res.data.data.totalElements
        for (let i = 0; i < listData.length; i++) {
          this.listData.push(listData[i])
        }
        if (this.listData.length > this.pageSize) {
          this.finishText = '没有更多了'
        } else {
          this.finishText = ''
        }
        this.loading = false
        if (listData.length < this.pageSize) {
          this.finished = true
        }
      })
    },
    onLoad() {
      this.getPoolCusList()
    }
  }
}
</script>

<style lang="scss" scoped>

    .contBody {
        .van-overlay {
            z-index: 111 !important;
            background-color: transparent;
        }

        .topFixed {
            @include wh(100%, 86px);

            .searchBox {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 11;
                padding: 0 12px;
                @include wh(100%, 86px);
                background-color: $white;

                .van-search {
                    padding: 10px 0;
                }

                .chooseBox {
                    padding-bottom: 6px;
                    font-size: 14px;

                    .chooseIcon {
                        display: inline-block;

                        &.activeIcon {
                            color: $theme;

                            .iconfont {
                                color: $theme;
                            }
                        }

                        .iconfont {
                            margin-left: 2px;
                            font-size: 12px;
                            color: $text-b;
                        }
                    }
                }
            }
        }

        .customerBox {
            .centerFixed {
                @include wh(100%, 28px);

                .cenTop {
                    position: fixed;
                    top: 86px;
                    left: 0;
                    z-index: 11;
                    @include wh(100%, 28px);
                    line-height: 28px;
                    background-color: $white;

                    .countBox {
                        padding: 0 12px;
                        @include wh(100%, 28px);
                        line-height: 28px;

                        .count {
                            font-size: 14px;
                            color: $text-5;
                            line-height: 28px;

                            span:nth-child(2) {
                                margin: 0 2px;
                                color: $theme;
                            }
                        }
                    }
                }
            }

            .list {
                .receive {
                    display: inline-block;
                    @include wh(55px, 29px);
                    line-height: 29px;
                    color: $white;
                    font-size: 13px;
                    background-color: $theme;
                    @include border-radius(3px);
                }
            }

            .noneList {
                padding-top: 96px;
                height: calc(100vh - 164px);
                background-color: $white;
            }

            .multipleOpen {
                background-color: $white;

                .mulTop {
                    position: relative;
                    padding: 12px;

                    .title {
                        line-height: 30px;
                    }

                    .cancel {
                        position: absolute;
                        right: 12px;
                        top: 12px;
                        @include wh(55px, 30px);
                        line-height: 30px;
                        font-size: 13px;
                        color: $text-5;
                        background-color: $bg-4;
                    }
                }

                .mulCount {
                    margin-top: 12px;
                    padding: 0 12px 12px;
                    font-size: 14px;
                    overflow: hidden;

                    .first {
                        margin-right: 15px;
                    }

                    .right {
                        font-size: 12px;

                        .chooseCount {
                            margin-left: 2px;
                            font-size: 13px;
                            color: $theme;
                        }

                        .total {
                            margin-right: 4px;
                            color: $text-6;
                        }
                    }
                }
            }
        }
    }

</style>
