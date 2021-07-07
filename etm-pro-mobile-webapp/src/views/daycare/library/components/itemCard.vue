<template>
  <div class="itemCard-wrap">
    <div class="item-box">
      <div class="item" @click="$router.push('/libraryStoreCount')">
        <div class="value">{{ borrowData.stock }}</div>
        <div class="txt">库存数量</div>
      </div>
      <div class="item" @click="$router.push('/libraryBorrow')">
        <div class="value">{{ borrowData.loan }}</div>
        <div class="txt">在借图书</div>
      </div>
      <div class="item" @click="$router.push('/libraryApplication')">
        <div class="txt">申请记录</div>
        <div class="value">{{ borrowData.application }}</div>
      </div>
      <div class="item" @click="$router.push('/libraryOverdue')">
        <div class="txt">逾期图书</div>
        <div class="value">{{ borrowData.overdue }}</div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * itemCard create by 油麦菜
 * createTime 2020/11/27 9:32
 */
export default {
  name: 'ItemCard',
  components: {},
  filters: {},
  mixins: [],
  props: {
    borrowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.itemCard-wrap {
  .item-box {
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    flex-wrap: wrap;
    height: 215px;
    .item {
      padding-left: 20px;
      padding-top: 29px;
      width: 168px;
      height: 100px;
      text-align: left;
      .value {
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 700;
        color: #FFFFFF;
        line-height: 12px;
      }
      .txt {
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 12px;
      }
    }
    .item:nth-child(1) {
      background: url("~@/assets/images/daycare/store-count.png") no-repeat;
      background-size: 100% auto;
    }
    .item:nth-child(2) {
      background: url("~@/assets/images/daycare/borrow-booko-count.png") no-repeat;
      background-size: 100% auto;
    }
    .item:nth-child(3) {
      background: url("~@/assets/images/daycare/application-count.png") no-repeat;
      background-size: 100% auto;
    }
    .item:nth-child(4) {
      background: url("~@/assets/images/daycare/overdue-count.png") no-repeat;
      background-size: 100% auto;
    }
  }
}
</style>
