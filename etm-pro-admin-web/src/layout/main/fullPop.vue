<template>
  <div class="fullPop">
    <el-dialog
      :visible="visible"
      :show-close="false"
      :append-to-body="!!appendToBody"
      fullscreen
      @close="handleClose"
      @open="handleOpen"
    >
      <div slot="title" class="header">
        <div class="_title">
          <i class="el-icon-arrow-left" @click.stop="handleClose" />
          {{ this.titleText }}
        </div>
      </div>
      <el-tabs v-if="tabs" class="tabs" :value="active" :before-leave="beforeLeave" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item.label"
          :name="item.name"
          :disabled="item.disabled"
        />
      </el-tabs>
      <slot />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FullWindow',
  props: ['visible', 'title', 'active', 'tabs', 'appendToBody', 'beforeLeave'],
  computed: {
    titleText() {
      return this.title ? this.title : '这里是标题'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleOpen() {
      this.$emit('open')
    },
    handleTabClick(t, e) {
      this.$emit('tabClick', t, e)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .fullPop {
    .el-dialog.is-fullscreen {
      @include bgc_backgroundColorDefault();
      .el-dialog__header {
        display: flex;
        position: fixed;
        z-index: 10;
        top: 0;
        align-items: center;
        height: 8.88vh;
        width: 100vw;
        padding: 0;
        @include bgc_white();
        .header {
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          width: 70.8%;
          ._title {
            font-size: $title-font-size;
            @include c_colorTextPrimary();
            font-weight: bold;
            line-height: 33px;
            .el-icon-arrow-left {
                cursor: pointer;
                @include c_colorTextSecondary();
            }
          }
        }
      }
      .el-dialog__body {
        width: 70.8%;
        min-height: calc(91.12vh - 32px);
        overflow: auto;
        padding: 0;
        margin: calc(8.88vh + 16px) auto 16px;
        border-radius: 4px;
        @include bgc_white();
      }
    }
    .el-tabs__header {
        padding: 0;
    }
    .el-tabs__nav-wrap {
        padding: 0 16px;
    }
    .title {
            display: block;
            @include c_colorTextPrimary();
            font-size: $regular-font-size;
            font-weight: bold;
            height: 20px;
            line-height: 20px;
            &:before {
                content: '';
                display: inline-block;
                position: relative;
                top: 3px;
                width: 3px;
                height: 17px;
                margin-right: 12px;
                @include bgc_themeColor();
            }
        }
  }
</style>
