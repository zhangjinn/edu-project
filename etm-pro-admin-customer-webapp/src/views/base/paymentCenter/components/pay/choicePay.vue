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
        <div class="tabBoxContent">
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use :xlink:href="`#${item.icon}`" />
          </svg>
          <span class="value">{{ item.value }}</span>
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
export default {
  name: 'Choice',
  data () {
    return {
      isActive: 0,
      data: [
        {
          id: 1,
          icon: 'iconwechat-pay',
          value: '微信转账'
        },
        {
          id: 2,
          icon: 'iconzhifubao',
          value: '支付宝'
        }

      ]

    }
  },
  methods: {
    tabChange (item, index) {
      this.isActive = index
      this.$emit('change', item)
    }
  }
}
</script>

<style scoped lang="scss">
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
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
      width: 120px;
      height: 40px;
      padding: 0 16px;
      border-radius: 2px;
      cursor: pointer;
      border: 1px solid #E0E0E0;
      font-size: 14px;
      &Content{
        display: flex;
        align-items: center;
        span{
          margin-left: 7px;
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
