<template>
  <div class="statusItem-wrap">
    <div class="detail-box">
      <div
        v-for="(item, index) of propData"
        :key="index"
        class="item"
        :class="{
          // 'chi': ['enterDate','leaveDate'].includes(item.prop),
          // 'tui': ['enterStatus', 'leaveStatus'].includes(item.prop)
        }"
      >
        <div class="title"> {{ item.title }}:</div>
        <div class="content">{{ dataData[item.prop] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   *  2020/4/20 14:48
   *  haijinsha
   */
export default {
  name: 'StatusItem',
  filters: {},
  mixins: [],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    prop: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    propData() {
      return this.prop
    },
    dataData() {
      return this.data
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .statusItem-wrap {
    /*margin-bottom: 24px;*/
    .detail-box {
      padding: 0 24px;

      .item {
        display: flex;
        align-items: center;
        height: 40px;

        .title {
          min-width: 70px;
          /*text-align-last: justify;*/
          margin-right: 12px;
          font-size: 14px;
          color: $secondary-color;
        }

        .content {
          color: $title-color;
        }
      }

      .chi {
        color: #FBA047;
      }

      .tui {
        color: #FF3F2A;
      }
    }
  }
</style>
