<template>
  <div class="EtmTabs">
    <div class="EtmTabsHeader">
      <el-tabs v-model="currentName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.label" :name="item.name" />
      </el-tabs>
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentName: this.activeName
    }
  },
  watch: {
    activeName: function(val) {
      this.currentName = val
    }
  },

  methods: {
    handleClick(tab, event) {
      this.$emit('tabClick', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmTabs{
    position: relative;
    .EtmTabsHeader{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:14px;
      font-weight:400;
      & /deep/ .el-tabs{
        .el-tabs__header{
          margin: 0;
          padding: 0;
          .el-tabs__nav-wrap{
            &::after {
              height: 0;
            }
          }
        }
        .el-tabs__item{
          font-size:14px;
          font-weight:400;
        }
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: $divide-color;
        z-index: 1;
      }
    }
  }

</style>
