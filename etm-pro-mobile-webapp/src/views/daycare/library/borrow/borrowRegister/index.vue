<template>
  <div class="index-wrap">
    <setting-title to-path="/daycare_Library">
      <span>借阅登记</span>
    </setting-title>
    <book-card :borrow-book-data="borrowBookData" />
    <div class="borrow-op">
      <div class="borrow-info">
        <van-field
          v-model="phone"
          label="联系人电话"
          placeholder="请输入联系人电话"
          input-align="right"
          type="digit"
          @blur="blurChange"
        />
        <div class="borrow-count">
          <div class="txt">借阅人</div>
          <div class="count">{{ childName }}</div>
        </div>
      </div>
      <div class="borrow-info">
        <van-field
          v-model="durationVal"
          label="借阅时长"
          placeholder="请输入借阅时长"
          input-align="right"
          type="digit"
          @input="durationValChange"
        >
          <div slot="button">个月</div>
        </van-field>
        <div class="borrow-count">
          <div class="txt">借阅日期</div>
          <div class="count">{{ transferDate(createDate).time }}</div>
        </div>
        <div class="borrow-count">
          <div class="txt">到期日期</div>
          <div class="count">{{ renewalDate }}</div>
        </div>
      </div>
      <sticky-bottom>
        <div class="renewal-button">
          <div class="cancel-button" @click="handleCancel">取消</div>
          <div class="sure-button" @click="handleSure">确定</div>
        </div>
      </sticky-bottom>
    </div>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 18:18
 */
// 202011261629208717
import settingTitle from '../../components/settingTitle'
import bookCard from '../../components/bookCard'
import stickyBottom from '../../components/stickyBottom'
import { Toast } from 'vant'
import {
  queryScanBorrowBook,
  scanQRCodeBorrowBook,
  queryChildNameByPhone
} from '@/service/daycare/library'
import transferDate from '@/js/date'
export default {
  name: 'Index',
  components: {
    settingTitle,
    bookCard,
    stickyBottom
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      transferDate: transferDate,
      borrowBookData: [],
      bookBarcode: '',
      childId: '',
      childName: '',
      phone: '',
      durationVal: '',
      createDate: new Date(),
      renewalDate: ''
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
      this.bookBarcode = this.$route.query.bookBarcode
      if (!this.bookBarcode) {
        this.$router.push('/daycare_Library')
      }
      queryScanBorrowBook({ bookBarcode: this.bookBarcode }).then(res => {
        if (res.data.message === '成功') {
          res.data.data.borrowCount = true
          this.borrowBookData = [res.data.data]
        }
      }, () => {
        setTimeout(() => {
          this.$router.push('/daycare_Library')
        }, 500)
      })
    },
    durationValChange() {
      if (!this.durationVal || this.durationVal === '0') {
        this.renewalDate = ''
        return ''
      }
      const nowDate = new Date(this.createDate)
      nowDate.setMonth(nowDate.getMonth() + parseInt(this.durationVal))
      this.renewalDate = transferDate(nowDate).time
    },
    blurChange() {
      if (!this.phone) return ''
      if (this.phone.length !== 11) {
        Toast.loading({
          message: '输入的手机号长度不正确',
          duration: 500
        })
        return ''
      }
      queryChildNameByPhone({ phone: this.phone }).then(res => {
        if (res.data.message === '成功') {
          this.childName = res.data.data.childName
          this.childId = res.data.data.childId
        }
      })
    },
    handleCancel() {
      this.$router.push('/daycare_Library')
    },
    handleSure() {
      const params = {
        bookBarcode: this.bookBarcode,
        childId: this.childId,
        phone: this.phone,
        createDate: transferDate(this.createDate).time,
        duration: this.durationVal,
        endDate: this.renewalDate
      }
      console.log(params)
      scanQRCodeBorrowBook(params).then(res => {
        if (res.data.message === '成功') {
          setTimeout(() => {
            Toast.loading({
              message: '借阅成功',
              onClose: () => {
                this.$router.push('/libraryBorrow')
              }
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
  .borrow-op {
    padding: 0 12px;
    .borrow-info {
      padding: 0 12px;
      margin-bottom: 15px;
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
  .renewal-button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    height: 50px;
    line-height: 34px;
    .sure-button {
      width: 160px;
      height: 34px;
      background: #10C2C4;
      border-radius: 17px;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
    }
    .cancel-button {
      width: 160px;
      height: 34px;
      border: 1px solid #10C2C4;
      border-radius: 17px;
      font-size: 14px;
      font-weight: 500;
      color: #10C2C4;
    }
  }
}
</style>
