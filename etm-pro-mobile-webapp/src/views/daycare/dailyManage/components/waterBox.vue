<template>
  <div class="milkBox-wrap">
    <div class="content">
      <div class="imgBox">
        <img src="../../../../assets/images/water.png">
        <div class="scaleList">
          <van-picker
            :columns="numList"
            :default-index="8"
            @change="onChange"
          />
        </div>
        <div class="scaleBox">
          <img src="../../../../assets/images/water_scale.png">
          <div class="number">{{ selectValue }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * milkBox create by Administrator
 * createTime 2020/11/6 16:00
 */

export default {
  name: 'MilkBox',
  components: {},
  filters: {},
  mixins: [],
  props: {
    updateList: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      numList: [],
      selectValue: 50
    }
  },
  computed: {},
  watch: {
    updateList: {
      deep: true,
      handler(n) {
        this.updateList = n
        // console.log(this.updateList)
        this.selectValue = this.updateList.contentObject.capacity
      }
    }
  },
  created() {
  },
  mounted() {
    this.numList = []
    this.addNum(1, 100)
  },
  methods: {
    addNum(i, count) {
      if (i < count) {
        this.numList.push((i + 1) * 5)
        i++
        this.addNum(i, count)
      }
    },
    onChange(picker, value) {
      this.selectValue = value
    }
  }
}
</script>
<style lang="scss" scoped>
.milkBox-wrap {
  //padding: 12px;

  .content {
    padding: 42.5px 0 36px;
    background-color: $white;
    border-radius: 3px;

    .imgBox {
      position: relative;
      margin: 0 auto;
      width: 160px;

      .scaleList {
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 60px;
        height: 220px;
        overflow: hidden;

        ::v-deep .van-picker {
          background-color: transparent;

          .van-picker__mask {
            display: none;
          }

          .van-picker-column__item {
            font-size: 15px;
            color: #71CEFF;

            &.van-picker-column__item--selected {
              color: #51C2FE;
              font-size: 16px;
            }
          }
        }
      }

      .scaleBox {
        position: absolute;
        top: 115px;
        left: -48px;
        width: 60px;

        .number {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          color: #51C2FE;
          line-height: 30px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
