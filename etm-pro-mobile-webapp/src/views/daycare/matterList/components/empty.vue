<template>
  <div class="empty-wrap">
    <div class="empty">
      <div class="empty-img">
        <img :src="emptyIcon" alt="">
      </div>
      <div class="txt">{{ text }}</div>
      <div class="add-matter">
        <van-button v-if="isClick" round color="linear-gradient(to right, #FFA943, #FFC253)" size="large" @click="clickAddBtn">
          添加事宜
        </van-button>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * empty create by 油麦菜
 * createTime 2020/10/22 19:42
 */
export default {
  name: 'Empty',
  components: {},
  filters: {},
  mixins: [],
  props: {
    text: {
      type: String,
      default: '暂无交代内容'
    },
    emptyIcon: {
      type: String,
      default: ''
    },
    isClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      icon: ''
    }
  },
  computed: {},
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    clickAddBtn() {
      this.$emit('clickAddBtn')
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-wrap {
  .empty {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .txt {
      text-align: center;
      font-size: 14px;
      color: #999999;
    }
    .add-matter {
      .van-button--large {
        margin-top: 25px;
        height: 44px;
        line-height: 44px;
        font-size: 14px;
      }
    }
  }
}
</style>
