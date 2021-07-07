<template>
  <div class="index-wrap">
    <setting-title>
      <span>申请审批</span>
    </setting-title>
    <div class="content">
      <div
        v-for="(item, index) in borrowBookData"
        :key="index"
        class="book-detail"
      >
        <div class="child-card">
          <div class="child-info">
            <div v-if="item.borrowingStatus === 'TO_BE_CONFIRMED'" class="child-name">
              {{ item.childName }}正在申请{{ item.bookManageName }}
            </div>
            <div v-else-if="item.borrowingStatus === 'CONFIRMED'" class="child-name">
              {{ item.childName }}申请{{ item.bookManageName }}
            </div>
            <div v-if="item.borrowingStatus === 'CONFIRMED'" class="tip">{{ borrowingStatus[item.borrowingStatus] }}</div>
          </div>
        </div>
        <div class="book-detail-top">
          <div class="cover">
            <img v-if="item.cover && item.cover[0].url" :src="item.cover[0].url" alt="">
            <img v-else :src="bookDefaultCover" alt="">
          </div>
          <div class="book-info">
            <div class="book-name">
              <div class="name">{{ item.bookManageName }}</div>
            </div>
            <div v-if="item.bookTypeName" class="tag">{{ item.bookTypeName }}</div>
            <template>
              <div v-if="item.borrowingDate && !item.reviewDateTime" class="borrow-date">申请日期：{{ parseDate(item.borrowingDate) }}</div>
              <div v-if="item.reviewDateTime" class="borrow-date">确认时间：{{ parseDate(item.reviewDateTime) }}</div>
              <!--            <div v-if="item.dateOfExpiry" class="expire-date">到期日期：{{ parseDate(item.dateOfExpiry) }}</div>-->
              <div
                v-if="item.duration"
                class="borrow-duration"
              >借阅时长：{{ item.duration }}个月</div>
            </template>
          </div>
        </div>
        <div
          v-if="item.borrowingStatus === 'TO_BE_CONFIRMED'"
          class="book-detail-bottom"
          @click="confirmSure(item.bookLendingDetailsId)"
        >确认</div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 14:26
 */
import settingTitle from '../components/settingTitle'
import {
  queryApplicationList,
  updateBorrowStatus
} from '@/service/daycare/library'
import { parseTime } from '@/utils/date'
import { Toast } from 'vant'
export default {
  name: 'Index',
  components: {
    settingTitle
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      borrowBookData: [],
      bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      borrowingStatus: {
        TO_BE_CONFIRMED: '待确认',
        CONFIRMED: '已确认',
        CANCELLED: '已取消',
        RETURNED: '已归还'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryApplicationList().then(res => {
        if (res.data.message === '成功') {
          this.borrowBookData = res.data.data
        }
      })
    },
    parseDate(time) {
      const t = parseTime(time, null)
      return t.substring(0, t.length - 3)
    },
    confirmSure(bookLendingDetailsId) {
      updateBorrowStatus({ id: [bookLendingDetailsId] }).then(res => {
        if (res.data.message === '成功') {
          setTimeout(() => {
            Toast.loading({
              message: '审批成功',
              onClose: () => this.init()
            })
          }, 500)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .content {
    padding: 12px 12px 0;
    .book-detail {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      padding: 20px 16px;
      width: 351px;
      //height: 187px;
      background: #fff;
      border-radius: 10px;
      .child-card {
        display: flex;
        justify-content: space-between;
        margin-bottom: 17px;
        padding-bottom: 17px;
        border-bottom: 1px solid #EEEEEE;
        .child-info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .child-name {
            margin-left: 8px;
            align-self: center;
            font-size: 15px;
            font-weight: 500;
            color: #181818;
          }
          .tip {
            padding: 0 3px;
            height: 19px;
            background: rgba(#46B642, .12);
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: #46B642;
            line-height: 19px;
          }
        }
        .right-renewal {
          align-self: center;
          width: 76px;
          height: 30px;
          line-height: 30px;
          background: #10C2C4;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
      .book-detail-top {
        display: flex;
        .cover {
          margin-right: 17px;
          width: 74px;
          height: 105px;
          //border: 1px solid;
        }
        .book-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          text-align: left;
          //border: 1px solid;
          .book-name {
            display: flex;
            justify-content: space-between;
            .name {
              font-size: 16px;
              font-weight: 500;
              color: #181818;
            }
            .tip {
              padding: 0 3px;
              height: 19px;
              background: #F5F5F5;
              border-radius: 4px;
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              color: #666666;
              line-height: 19px;
            }
            .borrow-count {
              color: #049294;
            }
          }
          .tag {
            width: 56px;
            height: 20px;
            line-height: 18px;
            border: 1px solid #10C2C4;
            border-radius: 3px;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: #10C2C4;
          }
          .author {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .publisher {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .borrow-date {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .expire-date {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .borrow-duration {
            margin-bottom: 26px;
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .child-name {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
        }
      }
      .book-detail-bottom {
        align-self: flex-end;
        margin-top: 12px;
        width: 56px;
        height: 30px;
        line-height: 30px;
        background: #10C2C4;
        border-radius: 15px;
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        color: #FFFFFF;
      }
    }
  }
}
</style>
