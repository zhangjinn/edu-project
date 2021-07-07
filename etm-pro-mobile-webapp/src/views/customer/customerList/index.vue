<template>
  <div class="customerList">
    <div v-if="!multipleOn" class="topFixed">
      <div class="searchBox van-hairline--bottom" @click="closeQuickFilter">
        <van-row>
          <van-col :span="22">
            <van-search
              v-model="searchValue"
              placeholder="请输入搜索关键词"
              @search="onSearch"
            />
          </van-col>
          <van-col :span="2">
            <div class="operation">
              <div class="operationIcon textRight" @click.stop="openOverlay">
                <span class="iconfont iconplus-circle" />
              </div>
            </div>
          </van-col>
        </van-row>
        <div class="chooseBox">
          <van-row>
            <van-col :span="8">
              <div v-if="!showSort" class="chooseIcon" @click.stop="sortShow">
                <span>排序</span>
                <span class="iconfont iconarrow-down" />
              </div>
              <div v-else class="chooseIcon activeIcon" @click.stop="closeMain">
                <span>排序</span>
                <span class="iconfont iconarrow-up" />
              </div>
            </van-col>
            <van-col :span="8">
              <div class="chooseIcon" @click.stop="openFilter">
                <span>筛选</span>
                <span class="iconfont iconfilter" />
              </div>
            </van-col>
            <van-col :span="8">
              <div class="chooseIcon" @click.stop="multiple">
                <span>多选</span>
                <span class="iconfont iconchoice" />
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishText"
      @load="onLoad"
    >
      <div class="customerBox">
        <template v-if="!multipleOn">
          <div class="centerFixed">
            <div class="cenTop">
              <div class="filter textLeft">
                <div ref="slider" class="filterListUnfold">
                  <span
                    v-for="(item,index) in filterData"
                    :key="index"
                    ref="item"
                    :class="index === chooseIndex ? 'filterItem active' : 'filterItem'"
                    @click="chooseFilter(index)"
                  >{{ item.name }}</span>
                </div>
                <span class="filterMore textRight" @click="openQuickFilter">
                  <i class="iconfont iconarrow-down" />
                </span>
              </div>
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
                :icon="item.avatar"
                :name="item.name"
                :content="item.contactTelephone"
                :search-value="onSearchValue"
                @click.native="toDetail(item.id)"
              >
                <span v-if="item.state" class="labelColor">{{ item.state }}</span>
                <span v-else class="labelColor" />
              </universal-card>
            </template>
          </div>
          <div v-else class="noneList">
            <no-content message="暂无客户" :warn-text="chooseIndex==0 ? '请点击右上角“+”添加' : ''" />
          </div>
        </template>
        <template v-else>
          <div class="multipleOpen van-hairline--bottom">
            <div class="mulTop">
              <div class="title textLeft">多选操作</div>
              <div class="cancel" @click="closeMultiple">取消</div>
            </div>
            <div class="mulCount">
              <div class="left">
                <van-radio-group v-model="radio" checked-color="#10C2C4">
                  <div class="left first" @click="choosePage">
                    <van-radio name="1" icon-size="0.42667rem">选中当前页面</van-radio>
                  </div>
                  <div class="left" @click="chooseAll">
                    <van-radio name="2" icon-size="0.42667rem">全选</van-radio>
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
                  :content="item.contactTelephone"
                  :search-value="onSearchValue"
                  @click.native="confirmChoose(item.id)"
                >
                  <span v-if="item.state" class="labelColor">{{ item.state }}</span>
                  <span v-else class="labelColor" />
                </universal-card>
              </template>
            </van-checkbox-group>
          </div>
        </template>
      </div>
    </van-list>
    <div v-show="hidshow" v-if="multipleOn" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="giveUpCustomer">
          <control-btn text="放弃客户" />
        </div>
        <div v-if="judgeAuth('customer.crm.assign')" class="btn" @click="assignCustomer">
          <control-btn text="分配客户" type="primary" />
        </div>
      </div>
    </div>
    <div v-if="showQuickFilter" class="quickFilterBox">
      <div class="overlay" @click="closeQuickFilter" />
      <div class="container textLeft">
        <div class="filterTitle">
          <span class="left">快捷筛选</span>
          <span class="right iconfont iconarrow-up" @click="closeQuickFilter" />
        </div>
        <div class="filterListFold">
          <span
            v-for="(item,index) in filterData"
            :key="index"
            :class="index === chooseIndex ? 'filterItem active' : 'filterItem'"
            @click="chooseFilter(index,'show')"
          >{{ item.name }}</span>
        </div>
      </div>
    </div>
    <van-overlay :show="showOverlay" @click="closeOverlay">
      <operation-menu :list="list" />
    </van-overlay>
    <sort-menu
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
import controlBtn from '../../../components/common/controlBtn'
import operationMenu from '../components/operationMenu'
import sortMenu from '../components/sortMenu'
import filterPage from '../components/filterPage'
import noContent from '../../../components/common/noContent'
import { abandonCustomer, postCustomerList } from '../../../service/customer/customer'
import { judgeAuth } from '../../../utils/permiss'
import { replaceSpace } from '../../../js/rules'

export default {
  name: 'CustomerList',
  components: {
    universalCard,
    controlBtn,
    operationMenu,
    sortMenu,
    filterPage,
    noContent
  },
  data() {
    return {
      showSort: false,
      sortIndex: -1,
      searchValue: '',
      onSearchValue: '',
      searchOn: false,
      showFilter: false,
      totalList: [],
      listData: [],
      multipleOn: false,
      result: [],
      showOverlay: false,
      list: [
        {
          name: '添加客户',
          path: '/customerAdd',
          icon: 'iconfont iconadduser'
        },
        {
          name: '分配记录',
          path: '/assignBatch',
          icon: 'iconfont iconsolution'
        },
        // {
        //     name: '跟进记录',
        //     path: '/followRecord',
        //     icon: 'iconfont icongenjinjilu'
        // },
        {
          name: '公海',
          path: '/abCustomerList',
          icon: 'iconfont iconquit'
        }
      ],
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
      pageNum: 0,
      pageSize: 15,
      loading: false,
      finished: false,
      filterData: [
        {
          name: '全部',
          quickFindType: ''
        },
        {
          name: '从未跟进',
          quickFindType: 'NEVER_FOLLOW_UP'
        },
        {
          name: '从未分配',
          quickFindType: 'NEVER_ASSIGNED'
        },
        {
          name: '今天已分配',
          quickFindType: 'ASSIGNED_TODAY'
        },
        {
          name: '3天内已跟进',
          quickFindType: 'FOLLOW_UP_WITHIN_3_DAYS'
        },
        {
          name: '1周内已跟进',
          quickFindType: 'FOLLOW_UP_WITHIN_1_WEEK'
        },
        {
          name: '1月内已跟进',
          quickFindType: 'FOLLOW_UP_WITHIN_1_MONTH'
        },
        {
          name: '已分配未跟进',
          quickFindType: 'ASSIGNED_NOT_FOLLOWED_UP'
        }
      ],
      showQuickFilter: false,
      chooseIndex: 0,
      radio: 0,
      customerRadio: 0,
      customerTotal: 0,
      finishText: '',
      filterItem: [
        {
          condition: '',
          key: '',
          equal: '',
          op: '',
          val: '',
          id: '',
          showInput: false
        }
      ],
      relationIndex: 0,
      filterValue: null,
      quickFilterValue: null,
      sortValue: null
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {

  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.backChange, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backChange, false)// false阻止默认事件
  },
  methods: {
    judgeAuth(id) {
      return judgeAuth(id)
    },
    getSortEmplyeeList(data) {
      this.sortValue = {
        sortColumn: data.sortColumn,
        sort: data.sort
      }
      this.clearCustomer()
    },
    closeMain(index) {
      this.sortIndex = index
      this.closeSort()
    },
    multiple() {
      this.showQuickFilter = false
      if (this.listData.length) {
        this.multipleOn = true
      }
    },
    assignCustomer() {
      if (!this.result.length) {
        this.$toast({
          message: '请选择要分配的客户',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else {
        if (this.radio === '2') {
          // 不选中分配
          this.$router.push({
            path: '/customerAssign',
            query: {
              count: this.customerTotal
            }
          })
        } else {
          const customerId = this.result.join(',')
          this.$router.push({
            path: '/customerAssign',
            query: {
              customerId: customerId
            }
          })
        }
      }
    },
    giveUpCustomer() {
      if (this.result.length) {
        this.$dialog.confirm({
          title: '确认放弃已选客户？',
          message: '被放弃的客户进入客户公海池',
          confirmButtonColor: '#F53939',
          cancelButtonColor: '#666666'
        }).then(() => {
          this.customerAbandon()
        }).catch(() => {
          // onCancel
        })
      } else {
        this.$toast({
          message: '请选择要放弃的客户',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    customerAbandon() {
      const param = {
        customerIds: this.result
      }
      abandonCustomer(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '放弃客户成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.listData = []
          this.multipleOn = false
          this.result = []
          this.clearCustomer()
        }, 1000)
      })
    },
    openOverlay() {
      this.showOverlay = true
      this.$store.commit('show/SET_TAB_BAR', false)
    },
    closeOverlay() {
      this.showOverlay = false
      this.$store.commit('show/SET_TAB_BAR', true)
    },
    toDetail(id) {
      this.$router.push({
        path: '/customerDetail',
        query: {
          customerId: id
        }
      })
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
          pool: false,
          pageNum: 1,
          pageSize: 999
        }
        if (this.filterValue) {
          for (const i in this.filterValue) {
            param[i] = this.filterValue[i]
          }
        }
        if (this.quickFilterValue) {
          for (const i in this.quickFilterValue) {
            param[i] = this.quickFilterValue[i]
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
          this.totalList = res.data.data.content
          this.totalList.forEach(item => {
            this.result.push(item.id)
          })
        })
      }
      this.customerRadio = this.radio
    },
    closeMultiple() {
      this.multipleOn = false
      this.radio = '0'
      this.result = []
    },
    addCustomer() {
      this.$router.push({
        path: '/customerAdd'
      })
    },
    sortShow() {
      this.showSort = true
      this.$store.commit('show/SET_TAB_BAR', false)
    },
    closeSort() {
      this.showSort = false
      this.$store.commit('show/SET_TAB_BAR', true)
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
      this.clearData()
      this.searchValue = ''
      this.onSearchValue = ''
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
      this.clearCustomer()
    },
    checkInquire(val) {
      this.clearData()
      this.filterValue = val
      this.closeFilter()
      this.clearCustomer()
    },
    clearData() {
      this.sortIndex = -1
      this.chooseIndex = 0
      this.relationIndex = 0
      this.quickFilterValue = null
      this.sortValue = null
      this.filterValue = null
      this.searchOn = false
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.clearData()
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
        this.getCustomerList()
      }
    },
    // 客户列表
    getCustomerList() {
      this.pageNum++
      const param = {
        pool: false,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      if (this.filterValue) {
        for (const i in this.filterValue) {
          param[i] = this.filterValue[i]
        }
      }
      if (this.quickFilterValue) {
        for (const i in this.quickFilterValue) {
          param[i] = this.quickFilterValue[i]
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
      this.getCustomerList()
    },
    openQuickFilter() {
      this.showQuickFilter = true
      this.$store.commit('show/SET_TAB_BAR', false)
    },
    closeQuickFilter() {
      this.showQuickFilter = false
      this.$store.commit('show/SET_TAB_BAR', true)
    },
    chooseFilter(index, type) {
      this.clearData()
      this.onSearchValue = ''
      this.searchValue = ''
      const boxW = this.$refs.slider.offsetWidth
      const itemW = this.$refs.item[index].offsetWidth
      const left = this.$refs.item[index].offsetLeft
      this.$refs.slider.scrollLeft = left - 12 - boxW / 2 + itemW / 2
      if (type === 'show') {
        this.showQuickFilter = false
      }
      this.chooseIndex = index
      if (index !== 0) {
        this.quickFilterValue = {
          quickFindType: this.filterData[index].quickFindType
        }
      } else {
        this.quickFilterValue = null
      }
      this.clearCustomer()
    },
    backChange() {
      this.$router.replace({
        path: '/workBench'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .customerList {
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

                .operation {
                    padding: 10px 0;

                    .operationIcon {
                        padding-top: 5px;

                        .iconfont {
                            font-size: 24px;
                            color: $text-5;
                        }
                    }
                }

                .chooseBox {
                    padding-bottom: 12px;
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
                @include wh(100%, 82px);

                .cenTop {
                    position: fixed;
                    top: 86px;
                    left: 0;
                    z-index: 11;
                    @include wh(100%, 82px);
                    background-color: $white;

                    .filter {
                        position: relative;
                        padding: 12px;
                        background-color: $white;

                        .filterListUnfold {
                            overflow-x: auto;
                            white-space: nowrap;
                        }

                        .filterItem {
                            display: inline-block;
                            margin-right: 12px;
                            padding: 0 15px;
                            height: 30px;
                            line-height: 30px;
                            font-size: 13px;
                            color: $text-5;
                            background-color: $bg-0;
                            border: .5px solid $bg-0;
                            @include border-radius(3px);

                            &.active {
                                color: $theme;
                                background-color: $themeLight;
                                border: .5px solid $themeLight;
                            }
                        }

                        .filterMore {
                            position: absolute;
                            top: 12px;
                            right: 12px;
                            @include wh(24px, 30px);

                            @include linear-gradient(to right, rgba(255, 255, 255, 0.4), $white);

                            .iconfont {
                                line-height: 30px;
                                font-size: 12px;
                                color: $text-6;
                            }
                        }
                    }

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

                    .chooseBox {
                        padding: 6px 12px;
                        @include wh(100%, 40px);
                        line-height: 28px;

                        .chooseCount {
                            font-size: 12px;
                            color: $text-5;
                        }
                    }
                }
            }

            .noneList {
                padding-top: 100px;
                height: calc(100vh - 218px);
                background-color: $white;
            }
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

        .quickFilterBox {
            position: fixed;
            top: 86px;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 111;

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                background-color: rgba(0, 0, 0, 0.7);
            }

            .container {
                padding: 20px 12px;
                background-color: $white;

                .filterTitle {
                    line-height: 16px;
                    overflow: hidden;

                    .iconfont {
                        color: $text-6;
                        font-size: 12px;
                        line-height: 16px;
                    }
                }
            }

            .filterListFold {
                margin-top: 5px;

                .filterItem {
                    margin-top: 10px;
                }
            }

            .filterItem {
                display: inline-block;
                margin-right: 12px;
                padding: 0 15px;
                height: 30px;
                line-height: 30px;
                font-size: 13px;
                color: $text-5;
                background-color: $bg-0;
                border: .5px solid $bg-0;
                @include border-radius(3px);

                &.active {
                    color: $theme;
                    background-color: $themeLight;
                    border: .5px solid $themeLight;
                }
            }
        }

        .van-overlay {
            z-index: 111;
        }
    }
</style>
