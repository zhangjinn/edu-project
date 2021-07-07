<template>
  <div class="applicationCard-wrap">
    <div class="applicationCard" @click="cardClick">
      <div class="iconBox">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="`#${icon}`" />
        </svg>
      </div>
      <div class="applicationName">{{ name }}</div>
      <div v-if="editOn" class="operationIcon">
        <span v-if="state === 'install'" class="iconfont iconshanchu" />
        <span v-else class="iconfont iconzengjia" />
      </div>
    </div>
  </div>

</template>

<script>
/**
 * applicationCard create by Administrator
 * createTime 2020/11/23 13:44
 */
export default {
  name: 'ApplicationCard',
  components: {},
  filters: {},
  mixins: [],
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
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    cardClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
.applicationCard-wrap {
  padding: 20px 0;

  .applicationCard {
    position: relative;

    .iconBox {
      margin: 0 auto;
      @include wh(41px, 41px);

      .icon {
        @include wh(41px, 41px);
      }
    }

    .applicationName {
      margin-top: 8px;
      font-size: 12px;
    }

    .operationIcon {
      position: absolute;
      right: 16px;
      top: -8px;

      .iconfont {
        font-size: 17.5px;
      }

      .iconzengjia {
        color: #4383F9;
      }

      .iconshanchu {
        color: $red;
      }
    }
  }
}
</style>
