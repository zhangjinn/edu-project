<template>
  <div class="index-wrap">
    <setting-title to-path="/daycare_Library">
      <span>图书管理</span>
    </setting-title>
    <search :book-type="bookType" @handleSearch="handleSearch" />
    <div class="total-box">
      <div class="total">
        <i class="iconfont iconshuji" />
        书籍合计 {{ borrowBookData.length }}
      </div>
    </div>
    <book-card :borrow-book-data="borrowBookData" />
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/27 14:26
 */
import settingTitle from '../components/settingTitle'
import search from '../components/search'
import bookCard from '../components/bookCard'
import {
  queryBookType,
  queryLibrary
} from '@/service/daycare/library'
export default {
  name: 'Index',
  components: {
    settingTitle,
    search,
    bookCard
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      borrowBookData: [],
      bookType: null
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
    init(search = {}) {
      queryBookType().then(res => {
        if (res.data.message === '成功') {
          this.bookType = res.data.data
          this.bookType.unshift({
            bookTypeId: '',
            bookTypeName: '全部类型'
          })
        }
      })
      const result = Object.assign({}, search)
      queryLibrary(result).then(res => {
        if (res.data.message === '成功') {
          this.borrowBookData = res.data.data
        }
      })
    },
    handleSearch(search) {
      this.init(search)
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .total-box {
    padding: 0 12px;
    margin-top: 12px;
    .total {
      height: 43px;
      line-height: 43px;
      border-radius: 5px;
      background: #fff;
      font-size: 16px;
      font-weight: 500;
      color: #10C2C4;
      .iconshuji {
        margin-right: 7px;
      }
    }
  }
}
</style>
