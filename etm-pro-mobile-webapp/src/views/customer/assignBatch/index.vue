<template>
  <div class="assignBatch">
    <div class="topFixed">
      <div class="searchBox">
        <van-search
          v-model="searchValue"
          placeholder="请输入批次号进行搜索"
          @search="onSearch"
        />
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      @load="onLoad"
    >
      <div v-if="list.length" class="batchBox">
        <div v-for="(item,index) in list" :key="index" class="batchCard">
          <div class="cardTop van-hairline--bottom">
            <div class="left">
              <span class="title">批次号：{{ item.batchCode }}</span>
            </div>
            <div class="right">
              <div class="operate" @click="batchClick(item.batchId)">
                <span>查看详情</span>
                <span class="iconfont iconright" />
              </div>
            </div>
          </div>
          <div class="cardBottom textLeft">
            <div class="left count">
              <p class="label">数量</p>
              <p class="text">{{ item.amount }}</p>
            </div>
            <div class="left time">
              <p class="label">分配时间</p>
              <p class="text">{{ item.createTime }}</p>
            </div>
            <div class="right">
              <div v-if="item.cancel" class="revText">已撤销</div>
              <div v-else class="btn" @click="revertBatch(item.batchId)">
                <control-btn text="撤销" type="primary" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noneList">
        <no-content message="暂无名单" type="list" />
      </div>
    </van-list>
  </div>
</template>

<script>
import { DateFormat, replaceSpace } from '../../../js/rules'
import { getBatchList, revokeBatch } from '../../../service/customer/customer'
import controlBtn from '../../../components/common/controlBtn'
import noContent from '../../../components/common/noContent'

export default {
  name: 'AssignBatch',
  components: {
    controlBtn,
    noContent
  },
  data() {
    return {
      searchValue: '',
      list: [],
      pageNum: 0,
      pageSize: 15,
      loading: false,
      finished: false,
      finishedText: ''
    }
  },
  created() {

  },
  methods: {
    batchClick(id) {
      this.$router.push({
        path: '/allocationList',
        query: {
          batchId: id
        }
      })
    },
    onLoad() {
      // 分配批次列表
      this.getBatchList()
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.list = []
      this.pageNum = 0
      this.getBatchList()
    },
    // 分配批次列表
    getBatchList() {
      this.pageNum++
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchValue) {
        param.batchCode = this.searchValue
      }
      getBatchList(param).then((res) => {
        const list = res.data.data.content
        this.loading = false
        list.forEach((val) => {
          // TODO 待处理时间格式
          val.createTime = DateFormat(val.createTime, 'yyyy-MM-dd hh:mm')
          this.list.push(val)
        })
        if (this.list.length > this.pageSize) {
          this.finishedText = '没有更多了'
        } else {
          this.finishedText = ''
        }
        if (list.length < this.pageSize) {
          this.finished = true
        }
      })
    },
    // 撤销批次
    revertBatch(id) {
      this.$dialog.confirm({
        title: '确认撤销该批次？',
        message: '撤销后不可撤回',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.revert(id)
      }).catch(() => {
      })
    },
    revert(id) {
      const param = {
        batchId: id
      }
      revokeBatch(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '批次撤销成功！',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 60)
        setTimeout(() => {
          this.list = []
          this.pageNum = 0
          this.getBatchList()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .assignBatch {
        .topFixed {
            @include wh(100%, 54px);

            .searchBox {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 11;
                @include wh(100%, 54px);
            }
        }

        .batchBox {
            padding: 12px;

            .batchCard {
                padding: 12px;
                background-color: $white;
                @include border-radius(3px);

                &:not(:last-child) {
                    margin-bottom: 10px;
                }

                .cardTop {
                    padding-bottom: 12px;
                    overflow: hidden;

                    .title {
                        font-size: 14px;
                        font-weight: bold;
                    }

                    .operate {
                        font-size: 12px;
                        color: $text-9;

                        .iconfont {
                            margin-left: 2px;
                            font-size: 12px;
                        }
                    }
                }

                .cardBottom {
                    padding-top: 12px;
                    overflow: hidden;

                    .count {
                        position: relative;
                        margin-right: 70px;

                        &::after {
                            display: inline-block;
                            position: absolute;
                            right: -35px;
                            top: 10.5px;
                            content: '';
                            width: 1px;
                            height: 21px;
                            background-color: $text-d;
                        }
                    }

                    .label {
                        color: $text-9;
                        font-size: 12px;
                    }

                    .text {
                        margin-top: 6px;
                        font-size: 15px;
                    }

                    .right {
                        padding: 5px 0;

                        .btn {
                            width: 55px;
                        }

                        .revText {
                            color: $text-9;
                            font-size: 14px;
                            line-height: 31px;
                        }
                    }
                }
            }
        }

        .noneList {
            padding-top: 156px;
            height: calc(100vh - 104px);
            background-color: $white;
        }
    }
</style>
