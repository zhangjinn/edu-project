<template>
  <div class="chose-page">
    <ul class="choice">
      <li
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="tabBox"
          :class="{activeColor: index === isActive}"
          @click="tabChange(item,index)"
        >
          <div :class="{tabBoxContent: index === isActive}">
            <p class="amount">
              <span
                v-if="item.discount"
                class="discount"
              >{{ item.discount }}</span>
              <span class="currentPrice">{{ item.currentPrice }}元</span>
              <span
                v-if="item.discount"
                class="originalPrice"
              >{{ item.originalPrice }}元</span>
            </p>
            <p class="quantity">
              {{ item.quantity }}个
            </p>
          </div>
          <span class="icon iconfont icontuijian" />
          <span
            v-if="index === isActive"
            class="icon iconfont iconxuanzhong"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Choice',
  data () {
    return {
      isActive: 0,
      data: []

    }
  },
  created () {
    this.getRechargePackageData()
  },
  methods: {
    tabChange (item, index) {
      if (this.isActive !== index) {
        this.isActive = index
        this.$emit('change', item)
      }
    },
    getRechargePackageData () {
      this.data = [
        {
          id: 1,
          discount: null,
          currentPrice: '200',
          originalPrice: '300',
          quantity: '400'
        },
        {
          id: 2,
          discount: '9折',
          currentPrice: '400',
          originalPrice: '300',
          quantity: '400'
        },
        {
          id: 3,
          discount: '9折',
          currentPrice: '200',
          originalPrice: '300',
          quantity: '400'
        }
      ]

      if (this.data.length > 0) {
        this.$emit('change', this.data[0])
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chose-page{
  display: flex;
}

.choice{
  display: flex;
  flex-wrap: wrap;
  color: $color-text;
  margin: -8px -12px;

  li{
    margin: 8px 12px;

    .tabBox{

      position: relative;
      display: flex;
      align-items: center;
      width: 160px;
      height: 66px;
      border-radius: 2px;
      cursor: pointer;
      border: 1px solid #E0E0E0;
      padding: 0 8px;

      .amount{
        font-size:16px;
        display: flex;
        align-items: center;

        .discount{
          display: inline-block;
          width: 26px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          background: #FF6D26;
          border-radius: 2px;
          font-size: 12px;
          color: $white;
        }

        .currentPrice{
          font-size: 16px;
          color: #222222;
          margin-left: 4px;
        }

        .originalPrice{
          font-size: 14px;
          text-decoration: line-through;
          color: #999999;
          margin-left: 4px;
        }

      }

      .quantity{
        font-size:14px;
        color: $color-info;
      }

      .tabBoxContent{
        @include etm-color();

        .quantity{
          @include etm-color();
        }
      }

      .icontuijian{
        position: absolute;
        right: -2px;
        top: -14px;
        display: inline-block;
        width: 32px;
        height: 22px;
        line-height: 22px;
        font-size: 20px;
        color: #d81e06;
      }

      .iconxuanzhong{
        position: absolute;
        right: 0;
        bottom: 0;
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        @include etm-color();
      }
    }
  }

  .activeColor{
    @include etm-bdc();
  }
}
</style>
