<template>
  <div class="EtmCell">
    <div class="EtmCellInner" :style="{ background:bgColor(data.color) }">
      <ul>
        <li class="title" :style="{color:data.color}">
          {{ data.name }}
        </li>
        <li v-if="data.description" class="item">
          食材用量:{{ data.description }}
        </li>
      </ul>
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
    }
    // showIngredients: {
    //   type: Boolean,
    //   default: false
    // }
  },

  methods: {
    bgColor(color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
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

  }

</style>
