<template>
  <div @click="toggleClick">
    <i class="iconfont hamburger" :class="{'is-active':isActive}">&#xe6b1;</i>
  <!--    <svg-->
  <!--      :class="{'is-active':isActive}"-->
  <!--      class="hamburger"-->
  <!--      viewBox="0 0 1024 1024"-->
  <!--      xmlns="http://www.w3.org/2000/svg"-->
  <!--      width="64"-->
  <!--      height="64"-->
  <!--    >-->
  <!--      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />-->
  <!--    </svg>-->
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped lang="scss">
.hamburger {
  @include c_text_color();
  display: inline-block;
  margin-top: 2px;
  font-size: $text-fontSize;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1531307 *!*/
/*  src: url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.eot');*/
/*  src: url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1531307_9z85bg0lv55.svg#iconfont') format('svg');*/
/*}*/
</style>
