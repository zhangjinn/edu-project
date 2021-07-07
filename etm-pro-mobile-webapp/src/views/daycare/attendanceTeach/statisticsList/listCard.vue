<template>
  <div class="listCard textLeft">
    <div class="list">
      <div class="avatarBox left">
        <template v-if="icon && hasImg">
          <van-loading v-if="imgLoad" type="spinner" size="24px" />
          <img :src="icon" @load="imgLoad = false" @error="hasImg = false">
        </template>
        <div v-else class="noImg textCenter">{{ getIconTxt(name) }}</div>
      </div>
      <div class="cardMsg left">
        <p class="van-ellipsis">
          {{ name }}
        </p>
      </div>
      <div class="van-ellipsis rightArea right">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListCard',
  props: {
    icon: {
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
    label: {
      type: String,
      default() {
        return null
      }
    },
    index: {
      type: Number,
      default() {
        return null
      }
    },
    number: {
      type: Number,
      default() {
        return null
      }
    },
    count: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      hasImg: true,
      imgLoad: true
    }
  },
  methods: {
    getIconTxt(name) {
      if (this.type !== 'organization') {
        if (name.length > 2) {
          return name.substring(name.length - 2)
        } else {
          return name
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.listCard {
  padding: 0 12px;
  background-color: $white;

  &:not(:last-child) {
    .list {
      position: relative;

      &::after {
        display: inline-block;
        position: absolute;
        bottom: 1px;
        right: 0;
        content: "";
        width: calc(100% - 50px);
        height: 1px;
        background-color: $text-e;
      }
    }
  }

  .list {
    padding: 15px 0;
    overflow: hidden;

    .avatarBox {
      position: relative;
      @include round(38px);
      overflow: hidden;

      .van-loading {
        position: absolute;
        top: 7px;
        left: 7px;
      }

      .noImg {
        @include wh(100%, 100%);
        line-height: 38px;
        color: $white;
        font-size: 13px;
        background-color: $theme;
      }
    }

    .cardMsg {
      margin-left: 9px;
      max-width: 180px;
      //height: 38px;

      p {
        line-height: 38px;
      }

      p:first-child {
        font-size: 15px;
      }

      p:last-child {
        font-size: 13px;
        color: $text-6;
      }

      .mark {
        margin-left: 4px;
        color: $theme;
      }

      .labelColor {
        margin-right: 4px;
      }
    }

    .rightArea {
      max-width: 200px;
      font-size: 13px;
      color: $text-6;
      line-height: 38px;
    }
  }
}
</style>
