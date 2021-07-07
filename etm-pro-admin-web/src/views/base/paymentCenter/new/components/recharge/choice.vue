<template>
  <ul class="choice">
    <li v-for="(item, index) in data" :key="index">
      <div
        class="tabBox"
        :class="{activeColor: index === isActive}"
        @click="tabChange(item,index)"
      >
        <div :class="{tabBoxContent: index === isActive}">
          <p class="amount">{{ item.amount }}元</p>
          <p class="time">{{ item.time }}分钟</p>
        </div>
        <span v-if="index === isActive" class="iconfont iconxuanzhong" />
      </div>
    </li>
  </ul>
</template>

<script>
import { getRechargePackage } from '@/api/base/paymentCenter'

export default {
  name: 'Choice',
  data() {
    return {
      isActive: 0,
      data: []

    }
  },
  created() {
    this.getRechargePackageData()
  },
  methods: {
    tabChange(item, index) {
      if (this.isActive === index) {
        this.isActive = null
        this.$emit('change', { amount: 0, id: null, time: 0 })
      } else {
        this.isActive = index
        this.$emit('change', item)
      }
    },
    getRechargePackageData() {
      const param = {
        type: 'CALL'
      }
      getRechargePackage(param).then((res) => {
        const { data } = res
        this.data = []

        data.map((val) => {
          // const remainder = val.num % 60
          // const method = remainder >= 30 ? Math.ceil : Math.floor
          this.data.push(
            {
              id: val.id,
              amount: val.price,
              time: val.num
            }
          )
        })
        if (this.data.length > 0) {
          this.$emit('change', this.data[0], 'default')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.choice{
  display: flex;
  flex-wrap: wrap;
  color: $text-color;
  margin: -8px -12px;

  li{
    margin: 8px 12px;
    .tabBox{
      position: relative;
      display: flex;
      align-items: center;
      width: 140px;
      height: 66px;
      border-radius: 2px;
      cursor: pointer;
      border: 1px solid #E0E0E0;
      padding: 0 16px;

      .amount{
        font-size:16px;
      }
      .time{
        font-size:14px;
        color: $info-color;
      }

      .tabBoxContent{
        @include c_main_color();
        .time{
          @include c_main_color();
        }
      }
      .iconfont{
        position: absolute;
        right: -4px;
        bottom: -7px;
        font-size: 20px;
        @include c_main_color();
      }
    }
  }
  .activeColor{
    @include bc_main_color();
  }
}
</style>
