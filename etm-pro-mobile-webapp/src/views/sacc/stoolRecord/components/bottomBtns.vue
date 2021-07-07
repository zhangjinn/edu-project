<template>
  <div class="bottomBtnsWrap">
    <div class="cancel" @click.stop="handleCancel">
      取消
    </div>
    <div class="save" @click.stop="handleSave">
      保存
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomBtns',
  methods: {
    handleCancel() {
      this.$emit('cancel')
    },
    handleSave() {
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .bottomBtnsWrap {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        bottom: 50px;
        background-color: $white;
        width: 100vw;
        height: 61px;
        border-top: 1px solid $text-e;

        & > div {
            width: 170px;
            height: 44px;
            line-height: 44px;
            font-size: 15px;
            color: $text-5;
            text-align: center;
            border-radius: 3px;
        }

        .cancel {
            background-color: $bg-4;
        }

        .save {
            background-color: $theme;
            color: $white;
        }
    }
</style>
