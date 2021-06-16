<template>
  <div class="EtmCell">
    <div
      class="EtmCellInner"
    >
      <ul>
        <li
          class="title"
          :style="{color:data.color}"
        >
          <span>{{ data.foodName }}</span>
          <el-input
            v-model="num"
            class="inputNum"
          />
        </li>
        <!--<li v-if="showIngredients && data.description" class="item">-->
        <!--  食材用量:{{ data.description }}-->
        <!--</li>-->
      </ul>
      <div class="popTip">
        <div class="popTipInner">
          <span @click.stop="HandleDelete">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rgbToRgba } from '@/utils'

export default {
  name: 'FirstTableCell',

  props: {
    data: {
      type: Object,
      required: true
    },
    showIngredients: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    bgColor (color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },

    HandleDelete () {
      this.$emit('handleDelete')
    }

  }
}
</script>

<style scoped lang="scss">
  .EtmCellInner {
    border-radius: 2px;
    margin-bottom: 8px;
    overflow: hidden;
    position: relative;
    width: 100%;

    ul {
      font-weight: 400;

      padding: 8px;

      .title {
        font-size: 14px;
        margin-bottom: 8px;

      }

      .item {
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
      }
    }

    .popTip {
      background-color: rgba(0, 0, 0, 0.3);
      bottom: 0;
      color: $white;
      display: none;
      left: 0;
      position: absolute;
      right: 0;

      &Inner {
        display: flex;
        justify-content: space-around;

        span {
          cursor: pointer;
        }
      }
    }

    &:hover .popTip {
      display: block;
    }
  }

  .inputNum {
    display: inline-block;
    height: 30px;
    margin-left: 20px;
    width: 62px;
    z-index: 999;
  }
</style>
