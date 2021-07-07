<template>
  <div class="matter">
    <fil ref="filter" @change="getMatterList" />
    <ul v-if="matterList.length" class="issueList">
      <li v-for="(item, index) in matterList" :key="index" @click.stop="toDetail(item)">
        <div class="title">
          <p>
            <img src="../../../assets/images/calendar.png" alt="calendar">
            {{ item.childName }}的交代事宜{{ {'PENDING': '需要您确认', 'CONFIRMED': '已确认', 'ROLLBACK': '已撤销'}[item.status] }}
          </p>
          <span :class="{'PENDING': 'r', 'CONFIRMED': 'g', 'ROLLBACK': 'b'}[item.status]">{{ { 'PENDING': '待确认', 'CONFIRMED': '已确认', 'ROLLBACK': '已撤销' }[item.status] }}</span>
        </div>
        <div class="content">
          <p>
            <span>交代时间：</span>
            <span>{{ transferDate(item.createTime).fullTime }}</span>
          </p>
          <p>
            <span>交代类型：</span>
            <span>{{ item.type | matterType }}</span>
          </p>
          <p>
            <span>交代人：</span>
            <span>{{ item.createBy || '-' }}</span>
          </p>
          <p v-if="item.status === 'CONFIRMED'">
            <span>确认时间：</span>
            <span>{{ transferDate(item.confirmTime).fullTime }}</span>
          </p>
        </div>
      </li>
    </ul>
    <no-content v-else message="暂无数据" type="list" />
  </div>
</template>
<script>
import fil from './components/filter'
import { transferDate } from '../../../js/rules'
import {
  queryMatterList
} from '../../../service/guardcare/matter'
import noContent from '../../../components/common/noContent'

export default {
  components: {
    fil,
    noContent
  },
  filters: {
    matterType(value) {
      const TYPE_OBJ = { 'MEDICINE': '吃药', 'DRINK': '喝水', 'CLOTHING': '穿衣', 'MOTION': '情绪', 'SPECIAL': '特殊', 'OTHER': '其他' }
      const typeArr = value.split(',')
      let result = ''
      typeArr.forEach(t => {
        result += TYPE_OBJ[t] + ' '
      })
      return result
    }
  },
  data() {
    return {
      matterList: []
    }
  },
  methods: {
    toDetail(item) {
      this.$router.push(`/guardcare_matterListDetail?id=${item.leaveMessageId}`)
    },
    getMatterList() {
      const options = {}
      const { clazzId, currentDate } = this.$refs.filter._data
      if (clazzId) options.clazzId = clazzId
      options.createDateStart = currentDate.replace(/\./g, '-')
      options.createDateEnd = currentDate.replace(/\./g, '-')
      queryMatterList(options).then(res => {
        this.matterList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    transferDate(date) {
      return transferDate(+date)
    }
  }
}
</script>

<style scoped lang="scss">
.matter {
  text-align: left;
  .issueList {
    height: calc(100vh - 58px);
    overflow-y: auto;
    li {
      width: calc(100vw - 24px);
      margin: 12px auto;
      padding: 16px 16px 0;
      background-color: $white;
      border-radius: 4px;

      .title {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        border-bottom: 1px solid $text-e;
        p {
          display: flex;
          align-items: center;
          font-size: 15px;
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        span {
          font-size: 15px;
          &.r {
            color: $red;
          }
          &.g {
            color: $green;
          }
          &.b {
            color: $text-9;
          }
        }
      }
      .content {
        padding: 12px 0;
        p {
          line-height: 1;
          margin-bottom: 12px;
          span {
            font-size: 12px;
            &:first-child {
              color: $text-9;
            }
          }
        }
      }
    }
  }
}
</style>
