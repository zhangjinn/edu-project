<template>
  <div clas="controlBtn">
    <div class="controlBtnInner textCenter" :type="type" :size="size" :disabled="disabled">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlBtn',
  props: {
    text: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return 'default'
      }
    },
    size: {
      type: String,
      default() {
        return 'normal'
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    }
  }
  // text按钮文字
  // type按钮类型---default： 默认
  //               primary： 主要
  //               cancel： 取消
  //               warn： 警告
  //               info: 次级重要
  //               不传时默认为default
  // disabled： 被禁止按钮
  // size为按钮大小
}
</script>

<style scoped lang="scss">

.controlBtnInner {
  @include border-radius(3px);
  letter-spacing: 1.5px;

  &[type='default'] {
    background-color: $white;
    color: $text-6;
    border: 1px solid $text-b;
  }

  &[type='primary'] {
    background-color: $theme;
    color: $white;
    border: 1px solid $theme;
  }

  &[type='info'] {
    background-color: $themeLight;
    color: $theme;
    border: 1px solid $themeLight;
  }

  &[type='cancel'] {
    background-color: $bg-4;
    color: $text-6;
    border: 1px solid $bg-4;
  }

  &[type='warn'] {
    background-color: $white;
    color: $red;
    border: 1px solid $white;
  }

  &[type='danger'] {
    background-color: $red;
    color: $white;
    border: 1px solid $red;
  }

  &[type='newtheme'] {
    background-color: #10C2C4;
    color: $white;
    border: 1px solid #10C2C4;
  }

  &[disabled='disabled'] {
    opacity: 0.3;
  }

  &[size='small'] {
    height: 29px;
    font-size: 13px;
    line-height: 29px;
  }

  &[size='normal'] {
    height: 44px;
    font-size: 15px;
    line-height: 44px;
  }

  &[size='large'] {
    height: 49px;
    font-size: 16px;
    line-height: 49px;
  }
}

</style>
