<template>
  <div class="index-wrap">
    <setting-title to-path="/daycare_Library">
      <span>借出管理</span>
    </setting-title>
    <search
      placeholder="搜索学员姓名"
      :book-type="bookType"
      @handleSearch="handleSearch"
    />
    <book-card :borrow-book-data="borrowBookData" @libraryRenewal="libraryRenewal" />
    <sticky-bottom>
      <div class="scan-qrcode-button">
        <div class="scan-borrow" @click="scanBorrow(that)">扫码借阅</div>
        <div class="scan-back" @click="scanBack(that)">扫码归还</div>
      </div>
    </sticky-bottom>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 14:26
 */
import bookCard from '../components/bookCard'
import settingTitle from '../components/settingTitle'
import search from '../components/search'
import stickyBottom from '../components/stickyBottom'
import {
  queryBorrowOrOverdueBook,
  queryBookType
} from '@/service/daycare/library'
import getSDKSignature from '@/service/wxSDK'
import { scanBack, scanBorrow } from '@/views/daycare/library/utils'
export default {
  name: 'Index',
  components: {
    bookCard,
    settingTitle,
    search,
    stickyBottom
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      bookType: [],
      borrowBookData: [],
      that: this,
      scanBack: scanBack,
      scanBorrow: scanBorrow
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(search = { type: true }) {
      queryBookType().then(res => {
        if (res.data.message === '成功') {
          this.bookType = res.data.data
          this.bookType.unshift({
            bookTypeId: '',
            bookTypeName: '全部类型'
          })
        }
      })
      queryBorrowOrOverdueBook(search).then(res => {
        if (res.data.message === '成功') {
          res.data.data.forEach(item => {
            item.showTopOp = true
          })
          this.borrowBookData = res.data.data
        }
      })
      getSDKSignature()
    },
    handleSearch(search) {
      console.log('handleSearch')
      search.type = true
      this.init(search)
    },
    libraryRenewal(item) {
      const borrowData = [{
        cover: item.cover,
        bookManageName: item.bookManageName,
        borrowingDate: item.borrowingDate,
        dateOfExpiry: item.dateOfExpiry,
        childName: item.childName,
        bookLendingDetailsId: item.bookLendingDetailsId,
        duration: item.duration,
        showTopOp: false
      }]
      sessionStorage.setItem('borrowData', JSON.stringify(borrowData))
      this.$router.push('/libraryRenewal')
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .scan-qrcode-button {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
    height: 50px;
    background: #fff;
    .scan-borrow, .scan-back {
      width: 160px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #10C2C4;
      border-radius: 17px;
    }
    .scan-borrow {
      font-size: 14px;
      font-weight: 500;
      color: #10C2C4;
    }
    .scan-back {
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      background: #10C2C4;
    }
  }
}
</style>
