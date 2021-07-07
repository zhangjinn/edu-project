<template>
  <div class="applicationCard" :class="state" @click="cardClick">
    <div class="iconBox">
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="`#${icon}`" />
      </svg>
    </div>
    <div class="applicationName">{{ name }}</div>
    <div v-if="editOn" class="operationIcon">
      <span v-if="state === 'install'" class="iconfont iconminus-circle" />
      <span v-else class="iconfont iconplus-circle" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplicationCard',
  // icon为应用图标
  // state为应用的状态
  // name为应用名称
  // editOn为编辑按钮显示状态
  props: {
    icon: {
      type: String,
      default() {
        return null
      }
    },
    state: {
      type: String,
      default() {
        return null
      }
    },
    name: {
      type: String,
      default() {
        return null
      }
    },
    editOn: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    cardClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>

.applicationCard {
  position: relative;
  padding: 20px 12px;

  .iconBox {
    margin: 0 auto;
    @include wh(46px, 46px);

    .icon {
      @include wh(46px, 46px);
    }
  }

  .applicationName {
    margin-top: 8px;
    font-size: 13px;
  }

  .operationIcon {
    position: absolute;
    right: 0px;
    top: 0px;

    .iconfont {
      font-size: 15px;
    }

    .iconplus-circle {
      color: $theme;
    }

    .iconminus-circle {
      color: $red;
    }
  }
}
</style>
