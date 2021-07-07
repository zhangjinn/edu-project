<template>
  <div class="sidePop">
    <el-drawer
      :direction="'rtl'"
      :visible="visible"
      size="60%"
      :title="title"
      :append-to-body="!!appendToBody"
      @close="handleClose"
      @open="handleOpen"
    >
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
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'SidePop',
  props: ['visible', 'title', 'appendToBody', 'tabs', 'active', 'beforeLeave'],
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
  .sidePop {
    .el-drawer {
        .el-tabs__header {
            padding: 0;
        }
        .el-tabs__nav-wrap {
            padding: 0 16px;
        }
        .el-drawer__header {
            height: 50px;
            padding: 0 16px 0 16px;
            span {
                @include c_colorTextPrimary();
            }
        }
        .el-drawer__body {
            padding-top: 0;
            margin-top: 74px;
            @include bgc_white();
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
  }
</style>
