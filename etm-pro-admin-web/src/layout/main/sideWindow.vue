<template>
  <div class="sideWindow">
    <el-drawer
      :direction="'rtl'"
      :visible="visible"
      :size="_size"
      :title="_title"
      :append-to-body="appendToBody"
      class="sideWindow"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-tabs v-if="_type === 'tab'" class="_inner" :value="_model" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tab"
          :key="index"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
      <slot name="body" />
      <slot name="footer" />
      <slot name="drawer" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'SideWindow',
  props: ['visible', 'size', 'title', 'type', 'tab', 'tabModel', 'appendToBody'],
  computed: {
    _size() {
      return this.size ? this.size : '60%'
    },
    _title() {
      if (this._type === 'tab') {
        return ''
      }
      return this.title ? this.title : '请输入标题'
    },
    _type() {
      return this.type ? this.type : 'title'
    },
    _model() {
      return this.tabModel
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
  .sideWindow {
    .el-drawer {
      .el-tabs._inner {
        position: absolute;
        top: 0;
        left: 42px;
        .el-tabs__header {
          padding: 0;
          margin: 0;
          .el-tabs__item {
            font-weight: bold;
          }
        }
        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
      .el-drawer__header {
        height: 50px;
        padding: 0 16px 0 16px;
        @include bg_sideWindow();
      }
      .el-drawer__body {
        padding-top: 0;
        margin-top: 50px;
      }
      .title {
        display: block;
        height: 45px;
        margin-left: 40px;
        line-height: 45px;
        background: transparent;
        @include c_colorTextSecondary();
      }
      .body {
        display: block;
        width: calc(100% - 32px);
        margin-left: 16px;
        padding: 16px;
        border-radius: 4px;
        @include bgc_white();
        & + .body {
          margin-top: 16px;
        }
      }
      .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 70px;
        @include bgc_white();
        text-align: center;
        line-height: 70px;
      }
    }
  }
</style>
