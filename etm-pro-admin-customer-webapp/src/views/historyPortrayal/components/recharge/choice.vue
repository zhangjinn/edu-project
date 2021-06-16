<template>
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
            {{ item.amount }}元
          </p>
          <p class="time">
            {{ item.time }}点
          </p>
        </div>
        <span
          v-if="index === isActive"
          class="iconfont iconxuanzhong"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import { createPortrayalSetMeal } from '@/api/base/paymentCenter'

export default {
  name: 'Choice',
  data () {
    return {
      isActive: 0,
      data: []

    }
  },
  created () {
    this.getAIPackageData()
  },
  methods: {
    tabChange (item, index) {
      if (this.isActive === index) {
        this.isActive = null
        this.$emit('change', { amount: 0, id: null, time: 0 })
      } else {
        this.isActive = index
        this.$emit('change', item)
      }
    },
    getAIPackageData () {
      const param = {
        enable: true,
        paged: false
      }
      createPortrayalSetMeal(param).then((res) => {
        const { content } = res.data
        this.data = []

        content.map((val) => {
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
  color: $color-text;
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
        color: $color-info;
      }

      .tabBoxContent{
        @include etm-color();
        .time{
          @include etm-color();
        }
      }
      .iconfont{
        position: absolute;
        right: -4px;
        bottom: -7px;
        font-size: 20px;
        @include etm-color();
      }
    }
  }
  .activeColor{
    @include etm-bdc();
  }
}
</style>
