<template>
  <div class="EtmCell">
    <div class="EtmCellInner" :style="{ background:bgColor(data.color) }">
      <ul>
        <li class="title" :style="{color:data.color}">
          {{ data.foodName }}
        </li>
        <li v-if="showIngredients && data.description" class="item">
          食材用量:{{ data.description }}
        </li>
      </ul>
      <div class="popTip">
        <div class="popTipInner">
          <span v-if="authDelete" @click.stop="HandleDelete">删除</span>
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
    },
    authDelete: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    bgColor(color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },

    HandleDelete() {
      this.$emit('handleDelete')
    }

  }
}
</script>

<style scoped lang="scss">
  .EtmCellInner{
    width: 100%;
    position: relative;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
    ul{

      padding: 8px;
      font-weight: 400;
      .title{
        font-size: 14px;
        margin-bottom: 8px;

      }
      .item{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
      }
    }
    .popTip{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      color: $white;
      background-color:rgba(0,0,0,0.3);
      display: none;
      &Inner{
        display: flex;
        justify-content: space-around;
        span{
          cursor: pointer;
        }
      }
    }
    &:hover .popTip{
      display: block;
    }
  }

</style>
