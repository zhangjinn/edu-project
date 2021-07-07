<template>
  <div class="index-wrap">
    <setting-title>
      <span>续借</span>
    </setting-title>
    <book-card :borrow-book-data="borrowBookData" />
    <div class="borrow-op">
      <div class="borrow-info">
        <van-field
          v-model="durationVal"
          label="续借时长"
          placeholder="请输入续借时长"
          input-align="right"
          type="digit"
          @input="durationValChange"
        >
          <div slot="button">个月</div>
        </van-field>
        <div class="borrow-count">
          <div class="txt">续后到期</div>
          <div class="count">{{ renewalDate }}</div>
        </div>
      </div>
    </div>
    <div class="bottom-button" @click="renewalClick">
      <span>续借</span>
    </div>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 18:30
 */
import settingTitle from '../../components/settingTitle'
import bookCard from '../../components/bookCard'
import transferDate from '@/js/date'
import { Toast } from 'vant'
import {
  updateRenewalBook
} from '@/service/daycare/library'
export default {
  name: 'Index',
  components: {
    settingTitle,
    bookCard
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      borrowBookData: [],
      durationVal: '',
      renewalDate: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    window.addEventListener('beforeunload', this.saveBorrowData)
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.saveBorrowData)
  },
  methods: {
    init() {
      const borrowBookData = JSON.parse(sessionStorage.getItem('borrowData'))
      if (!borrowBookData) {
        this.$router.push('/libraryBorrow')
      } else {
        this.borrowBookData = borrowBookData
      }
      sessionStorage.removeItem('borrowData')
    },
    durationValChange() {
      if (!this.durationVal) {
        this.renewalDate = ''
        return ''
      }
      // 日期加几个月后得到的日期
      const nowDate = new Date(this.borrowBookData[0].dateOfExpiry)
      console.log(transferDate(nowDate.getTime()).time)
      nowDate.setMonth(nowDate.getMonth() + parseInt(this.durationVal))
      this.renewalDate = transferDate(nowDate.getTime()).time
    },
    renewalClick() {
      if (!this.durationVal || this.durationVal === '0') {
        Toast.loading({
          message: '续借时长不能为0或空'
        })
        return ''
      }
      const params = {
        bookLendingDetailsId: this.borrowBookData[0].bookLendingDetailsId,
        duration: parseInt(this.borrowBookData[0].duration) + parseInt(this.durationVal),
        dateOfExpiry: this.renewalDate
      }
      console.log(params)
      updateRenewalBook(params).then(res => {
        if (res.data.message === '成功') {
          setTimeout(() => {
            Toast.loading({
              message: '续借成功',
              onClose: () => {
                this.$router.push('/libraryBorrow')
              }
            })
          }, 300)
        }
      })
    },
    saveBorrowData() {
      sessionStorage.setItem('borrowData', JSON.stringify(this.borrowBookData))
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  position: relative;
  height: 100vh;
  background: #F5F5F5;
  .borrow-op {
    padding: 0 12px;
    .borrow-info {
      padding: 0 12px;
      background: #FFFFFF;
      border-radius: 10px;
      .borrow-count {
        display: flex;
        justify-content: space-between;
        height: 54px;
        line-height: 54px;
        font-size: 14px;
        font-weight: 400;
        color: #181818;
        border-bottom: 1px solid #EEEEEE;
      }
      .van-cell {
        padding: 0;
        height: 54px;
        line-height: 54px;
        color: #181818;
        /deep/.van-field__label {
          font-size: 14px !important;
        }
        /deep/.van-field__control {
          &::placeholder {
            font-size: 14px;
            color: #999;
          }
        }
        /deep/.van-cell__value {
          font-size: 14px;
          color: #222222;
        }
      }
    }
  }
  .bottom-button {
    position: absolute;
    bottom: 0;
    padding: 0 12px 6px;
    width: 100%;
    span {
      display: block;
      height: 44px;
      line-height: 44px;
      background: #10C2C4;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
    }
  }
}
</style>
