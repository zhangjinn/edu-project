<template>
  <div class="taskList">
    <div class="topFixed">
      <div class="tabs van-hairline--bottom">
        <span :class="active===0 ? 'active' : ''" @click="tabChange(0)">未处理</span>
        <span :class="active===1 ? 'active' : ''" @click="tabChange(1)">已处理</span>
      </div>
    </div>
    <div class="task">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="text"
        @load="onLoad"
      >
        <div v-if="active===0" class="unDone">
          <template v-if="unprocessedData.length">
            <affair-list :data="unprocessedData" @operation="determine" />
          </template>
          <div v-else class="noneTask">
            <no-content message="没有未处理的事务" type="none" />
          </div>
        </div>
        <div v-else class="done">
          <template v-if="finishData.length">
            <affair-list :data="finishData" @operation="determine" />
          </template>
          <div v-else class="noneTask">
            <no-content message="没有已处理的事务" type="none" />
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import affairList from '../../../components/common/affairList'
import noContent from '../../../components/common/noContent'
import { getTransaction, putTransaction, deleteTransaction } from '../../../service/base/basic'
import { DateFormat } from '../../../js/rules'

export default {
  name: 'TaskList',
  components: {
    affairList,
    noContent
  },
  data() {
    return {
      active: 0,
      finishData: [],
      unprocessedData: [],
      pageSize: 20,
      pageNum: 0,
      unPageNum: 0,
      loading: false,
      finished: false,
      text: '',
      loadUnData: false,
      loadData: false
    }
  },
  created() {

  },
  methods: {
    tabChange(index) {
      this.active = index
      if (index === 0 && !this.loadUnData) {
        this.finished = false
      } else if (index === 1 && !this.loadData) {
        this.finished = false
      }
    },
    determine(value) {
      if (value.type === 'ignore') {
        this.ignoreTask(value.id, value.index)
      } else {
        this.removeTask(value.id, value.index)
      }
    },
    ignoreTask(id, index) {
      this.$dialog.confirm({
        title: '确认忽略此项事务？',
        message: '忽略后不可撤回',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.ignore(id, index)
      }).catch(() => {
        // oncancel
      })
    },
    ignore(id, index) {
      this.unprocessedData.splice(index, 1)
      const param = {
        state: 3
      }
      putTransaction(id, param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '操作成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
      })
    },
    removeTask(id, index) {
      this.$dialog.confirm({
        title: '确认删除此事项？',
        message: '删除后不可撤回',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.delete(id, index)
      }).catch(() => {
        // oncancel
      })
    },
    delete(id, index) {
      this.finishData.splice(index, 1)
      deleteTransaction(id).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '删除成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
      })
    },
    getUnFinishTask() {
      this.unPageNum++
      const unfinishParam = {
        sourceId: 1,
        pageSize: this.pageSize,
        pageNum: this.unPageNum,
        state: '2'
      }
      getTransaction(unfinishParam).then(res => {
        const tasks = res.data.data.content
        if (this.unPageNum === 1) {
          this.unprocessedData = []
        }
        tasks.sort((a, b) => {
          return new Date(a.lateTime) - new Date(b.lateTime)
        })
        tasks.forEach((item, index) => {
          const data = {}
          data.date = DateFormat(item.lateTime, 'yyyy.MM.dd')
          data.time = DateFormat(item.lateTime, 'hh:mm')
          if (new Date(item.lateTime) < new Date()) { // 逾期
            data.type = 2
            data.tag = 'o'
          } else {
            if (index % 3 === 1) {
              data.type = 1
            } else if (index % 3 === 2) {
              data.type = 3
            } else {
              data.type = 4
            }
          }
          data.handle = 'i'
          data.id = item.id
          data.affair = item.content
          data.customerId = item.customerId
          data.state = item.state
          this.unprocessedData.push(data)
        })
        if (this.unprocessedData.length > this.pageSize) {
          this.text = '没有更多了'
        } else {
          this.text = ''
        }
        this.loading = false
        if (tasks.length < this.pageSize) {
          this.loadUnData = true
          this.finished = true
        }
      })
    },
    getFinishTask() {
      this.pageNum++
      const finishParam = {
        sourceId: 1,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        state: '1,3'
      }
      getTransaction(finishParam).then(res => {
        const tasks = res.data.data.content
        if (this.pageNum === 1) {
          this.finishData = []
        }
        tasks.forEach(item => {
          const data = {}
          data.date = DateFormat(item.lateTime, 'yyyy.MM.dd')
          data.time = DateFormat(item.lateTime, 'hh:mm')
          if (item.state === 3) { // 已忽略
            data.type = 1
            data.tag = 'i'
          } else if (item.state === 1) { // 已处理
            data.type = 0
          }
          data.handle = 'd'
          data.id = item.id
          data.affair = item.content
          data.customerId = item.customerId
          data.state = item.state
          this.finishData.push(data)
        })
        if (this.finishData.length > this.pageSize) {
          this.text = '没有更多了'
        } else {
          this.text = ''
        }
        this.loading = false
        if (tasks.length < this.pageSize) {
          this.loadData = true
          this.finished = true
        }
      })
    },
    onLoad() {
      if (this.active === 0) {
        this.getUnFinishTask()
      } else if (this.active === 1) {
        this.getFinishTask()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../assets/style/mixin';

    .taskList {
        width: 100%;
        min-height: calc(100vh - 50px);
        background-color: $white;

        .topFixed {
            @include wh(100%, 57.5px);

            .tabs {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 11;
                padding: 18px 12px;
                @include wh(100%, 57.5px);
                background-color: $white;

                span {
                    display: inline-block;
                    width: 50%;
                    color: $text-6;

                    &.active {
                        position: relative;
                        color: $theme;

                        &::after {
                            display: inline-block;
                            position: absolute;
                            bottom: -18px;
                            left: 0;
                            right: 0;
                            margin: 0 auto;
                            content: '';
                            @include wh(30px, 2px);
                            background-color: $theme;
                        }
                    }
                }
            }
        }

        .task {
            margin-top: 32px;

            .noneTask {
                padding-top: 240px;
            }
        }
    }
</style>
