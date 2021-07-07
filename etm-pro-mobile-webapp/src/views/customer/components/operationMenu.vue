<template>
  <div class="operationMenu">
    <span class="up iconfont iconsanjiaoxing" />
    <div v-for="(item,index) in list" :key="index" class="list" @click="goPage(item.path)">
      <span :class="item.icon+ ' left'" />
      <span class="listName left">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OperationMenu',
  // list为菜单栏数组
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    goPage: function(val) {
      this.$router.push({
        path: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .operationMenu {
        position: fixed;
        right: 12px;
        top: 55px;
        width: 135px;
        background-color: $white;
        @include border-radius(5px);

        .up {
            position: absolute;
            color: $white;
            right: 0;
            top: -8px;
        }

        .list {
            position: relative;
            padding: 12px;
            overflow: hidden;

            &::after {
                display: inline-block;
                position: absolute;
                right: 12px;
                bottom: 1px;
                content: '';
                width: calc(100% - 50px);
                height: 1px;
                background-color: $text-e;
            }

            .iconfont {
                font-size: 20px;
                color: $text-5;
            }

            .listName {
                display: inline-block;
                margin-left: 6px;
                font-size: 14px;
                line-height: 21px;
            }
        }
    }
</style>
