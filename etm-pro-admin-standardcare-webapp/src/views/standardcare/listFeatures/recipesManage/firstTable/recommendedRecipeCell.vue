<template>
  <div class="EtmCell">
    <div
      class="EtmCellInner"
      :style="{ background:bgColor(data.color) }"
    >
      <ul>
        <li
          class="title"
          :style="{color:data.color}"
        >
          {{ data.name }}
        </li>
        <li
          v-if="data.description"
          class="item"
        >
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
    bgColor (color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
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

  }

</style>
