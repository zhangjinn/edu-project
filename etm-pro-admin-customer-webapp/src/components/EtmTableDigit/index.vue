<template>
  <div class="EtmTableDigit-wrap">
    <div
      v-if="data.length !== 0"
      class="table-digit"
    >
      <div
        v-for="(item, index) in data"
        :key="index"
        class="col"
      >
        <div class="top-digit">
          {{ item.digit }}
        </div>
        <div class="bottom-text">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * EtmTableDigit create by 油麦菜
   * createTime 2021/1/22 13:51
   */
export default {
  name: 'EtmTableDigit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    data: {
      type: Array,
      default () {
        return [
          {
            digit: 0,
            text: '数据名称'
          },
          {
            digit: 0,
            text: '数据名称'
          }
        ]
      }
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss">

  .EtmTableDigit-wrap {
    .table-digit {
      display: flex;
      @include etm-color;
      .col {
        padding: 0 16px;
        border-right: 1px solid #EEEEEE;
        .top-digit {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 16px;
          font-weight: 700;
        }
        .bottom-text {
          line-height: 12px;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
        }
      }
      .col:last-child {
        border-right: none;
      }
    }
  }

</style>
