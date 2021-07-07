<template>
  <div class="confirmed-wrap">
    <van-search
      v-model="value"
      placeholder="输入学员姓名搜索"
      @blur="searchMatter"
    />
    <div class="big-box">
      <div v-if="active === 0" class="confirm">
        <template v-if="matterList.length !== 0">
          <van-cell v-for="(item, index) in matterList" :key="index" @click="clickCard(index)">
            <div class="content">
              <div class="top">
                <div class="left-text">{{ item.childName }}的交代事宜需要您确认</div>
                <div class="right-text" style="color: #F53939">{{ statusMethod(item.tellState) }}</div>
              </div>
              <div class="bottom">
                <div class="container">
                  <div class="left-text">交代类型:</div>
                  <div class="right-text">{{ showTellType(item.tellType) }}</div>
                </div>
                <div class="container">
                  <div class="left-text">交代时间:</div>
                  <div class="right-text">{{ showTime(item.tellTime) }}</div>
                </div>
                <div class="container">
                  <div class="left-text">交代人:</div>
                  <div class="right-text">{{ item.tellName }}({{ item.parentsCall }})</div>
                </div>
              </div>
            </div>
          </van-cell>
        </template>
        <template v-else>
          <empty :empty-icon="noIcon" :is-click="false" />
        </template>
      </div>
      <div v-if="active === 1" class="confirm">
        <template v-if="matterList.length !== 0">
          <van-cell v-for="(item, index) in matterList" :key="index" @click="clickCard(index)">
            <div class="content">
              <div class="top">
                <div class="left-text">{{ item.childName }}的交代事宜{{ item.tellState === 'B_DETERMINE' ? '已确认' : '已撤销' }}</div>
                <div class="right-text" :style="{color: item.tellState === 'B_DETERMINE' ? '#46B642' : '#999999'}">{{ statusMethod(item.tellState) }}</div>
              </div>
              <div class="bottom">
                <div class="container">
                  <div class="left-text">交代类型:</div>
                  <div class="right-text">{{ showTellType(item.tellType) }}</div>
                </div>
                <div class="container">
                  <div class="left-text">交代时间:</div>
                  <div class="right-text">{{ showTime(item.tellTime) }}</div>
                </div>
                <div class="container">
                  <div class="left-text">交代人:</div>
                  <div class="right-text">{{ item.tellName }}({{ item.parentsCall }})</div>
                </div>
              </div>
            </div>
          </van-cell>
        </template>
        <template v-else>
          <empty :empty-icon="noIcon" :is-click="false" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import transferDate from '@/js/date'
import { queryMatterList } from '@/service/daycare/matterList'
import empty from '../components/empty'

export default {
  name: 'Confirmed',
  components: {
    empty
  },
  props: {
    active: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      value: '',
      matterList: [],
      tellType: {
        MEDICINE: '吃药',
        WATER: '喝水',
        DRESSING: '穿衣',
        MODD: '情绪',
        MEAL: '特殊餐',
        OTHER: '其他'
      },
      noIcon: require('@/assets/images/daycare/noMatter.png')
    }
  },
  watch: {
    active() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 网络请求
      //  ...
      this.matterList = []
      if (this.active === 0) {
        queryMatterList({ tellState: 'C_TO_BE_SIGNED', childName: null }).then(res => {
          if (res.data.message === '成功') {
            const data = res.data.data
            this.matterList = data
          }
        })
      } else {
        queryMatterList({ tellState: 'B_DETERMINE' }).then(res => {
          if (res.data.message === '成功') {
            const data = res.data.data
            this.matterList = data
          }
        })
      }
    },
    clickCard(index) {
      this.$router.push({
        path: '/daycare_matterDetail',
        // path: '/daycare_matterDetail',
        query: { tellMattersId: this.matterList[index].tellMattersId }
      })
    },
    showTime(timestamp) {
      const obj = transferDate(timestamp)
      return `${obj.year}-${obj.month}-${obj.date} ${obj.hours}:${obj.miniutes}`
    },
    statusMethod(status) {
      if (status === 'C_TO_BE_SIGNED') {
        return '待确认'
      } else if (status === 'B_DETERMINE') {
        return '已确认'
      } else {
        return '已撤销'
      }
    },
    searchMatter() {
      const obj = {
        tellState: this.active === 0 ? 'C_TO_BE_SIGNED' : 'B_DETERMINE',
        childName: this.value.trim()
      }
      queryMatterList(obj).then(res => {
        if (res.data.message === '成功') {
          const data = res.data.data
          this.matterList = data
        }
      })
    },
    showTellType(tellType) {
      const tmp = tellType.map(item => this.tellType[item])
      return tmp.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
.confirmed-wrap {
  .van-search {
    margin-bottom: 12px;
    .van-cell {
      padding: 0;
      /deep/.van-field__control {
        height: 32px;
        background: #F5F5F5;
      }
      /deep/.van-field__left-icon .van-icon {
        line-height: 32px;
      }
    }
  }

  .big-box {
    padding: 0 12px;
    .confirm {
      .van-cell {
        margin-bottom: 10px;
        border-radius: 4px;
      }
      .content {
        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #EEEEEE;
          .left-text {
            font-size: 14px;
            color: #222222;
            &:before {
              position: relative;
              top: -3px;
              margin-right: 5px;
              display: inline-block;
              content: ' ';
              width: 4px;
              height: 4px;
              border-radius: 999px;
              background: #ff0000;
            }
          }
        }
        .bottom .container {
          display: flex;
          .left-text {
            margin-right: 5px;
            color: #999999;
            line-height: 30px;
            width: 62px;
          }
          .right-text {
            font-size: 13px;
            color: #222222;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
