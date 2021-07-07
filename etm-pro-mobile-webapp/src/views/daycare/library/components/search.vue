<template>
  <div class="search-wrap">
    <div class="search">
      <div class="input-box">
        <i class="iconfont iconsousuo" />
        <label>
          <input
            v-model="value"
            type="text"
            :placeholder="placeholder"
            @blur="handleSearch"
          >
        </label>
      </div>
      <div ref="bookTypeRef" class="right-txt" @click="rightClick">
        <span class="txt">{{ currentBookType.bookTypeName }}</span>
        <i :class="[typeClick ? 'iconfont iconarrow-up' : 'iconfont iconarrow-down']" />
      </div>
      <div v-if="typeClick" class="search-down">
        <template v-if="bookType.length !== 0">
          <div
            v-for="(item, index) in bookType"
            :key="index"
            :class="['book-type', index === activeType ? 'active' : '']"
            @click="bookTypeClick(item, index)"
          >{{ item.bookTypeName }}</div>
        </template>
        <template v-else>
          <div class="book-type" style="color: #999999">当前没有图书类型</div>
        </template>
      </div>
      <van-overlay :show="typeClick" @click.stop="typeClick = false" />
    </div>
  </div>

</template>

<script>
/**
 * search create by 油麦菜
 * createTime 2020/11/25 17:11
 */
export default {
  name: 'Search',
  components: {},
  filters: {},
  mixins: [],
  props: {
    bookType: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '搜索书名'
    }
  },
  data() {
    return {
      value: '',
      typeClick: false,
      currentBookType: {
        bookTypeId: '',
        bookTypeName: '全部类型'
      },
      activeType: 0
    }
  },
  computed: {},
  watch: {
    currentBookType() {
      const search = {
        name: this.value.trim(),
        bookTypeId: this.currentBookType.bookTypeId
      }
      this.$emit('handleSearch', search)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleSearch() {
      // if (!this.value.trim()) {
      //   return ''
      // }
      const search = {
        name: this.value.trim(),
        bookTypeId: this.currentBookType.bookTypeId
      }
      this.$emit('handleSearch', search)
    },
    rightClick() {
      this.typeClick = !this.typeClick
    },
    bookTypeClick(item, index) {
      this.currentBookType = item
      this.activeType = index
      this.$refs.bookTypeRef.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.search-wrap {
  .search {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-around;
    padding: 10px 0 12px;
    background: #fff;
    .input-box {
      //flex: 1;
      .iconsousuo {
        position: absolute;
        left: 25px;
        top: 50%;
        color: #666666;
        transform: translateY(-50%);
      }
      input {
        margin-left: 12px;
        width: 260px;
        height: 32px;
        background: #EEEEEE;
        border-radius: 16px;
        padding-left: 36px;
        font-size: 13px;
        border: none;
        &::placeholder {
          color: #999999;
        }
      }
    }
    .right-txt {
      display: flex;
      justify-content: flex-end;
      font-size: 13px;
      // 文本长度省略
      .txt {
        width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
        align-self: center;
      }
      .iconarrow-down, .iconarrow-up {
        align-self: center;
        padding: 3px 12px 0 6px;
        font-size: 5px;
      }
    }
    .search-down {
      overflow: auto;
      position: absolute;
      z-index: 2;
      padding: 12px;
      top: 52px;
      width: 100%;
      height: 200px;
      background: #fff;
      .book-type {
        height: 32px;
        font-size: 13px;
        font-weight: 500;
        color: #181818;
      }
      .active {
        color: #10C2C4;
      }
    }
    .van-overlay {
      height: calc(100vh - 52px - 200px - 34px);
      top: calc(52px + 200px + 34px);
      background-color: rgba(0,0,0,.5);
    }
  }
}
</style>
