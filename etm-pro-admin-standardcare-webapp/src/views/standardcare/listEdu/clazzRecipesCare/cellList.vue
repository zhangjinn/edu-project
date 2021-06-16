<template>
  <div class="EtmCell">
    <div
      v-if="type==='recipesList'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.color) }"
    >
      <ul>
        <li
          class="title"
          :style="{color: data.color}"
        >
          {{ data.recipesName }}
        </li>
        <li
          v-if="data.remarks"
          class="item"
        >
          食材用量:{{ data.remarks }}
        </li>
      </ul>
      <div class="popTip">
        <div class="popTipInner">
          <span @click.stop="HandleDelete">删除</span>
          <span @click.stop="HandleEdit">更换</span>
          <span @click.stop="HandleDetail">详情</span>
        </div>
      </div>
    </div>

    <div
      v-if="type==='chooseRecipes'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.foodTypeColor) }"
    >
      <ul>
        <li
          class="title"
          :style="{color:data.foodTypeColor}"
        >
          {{ data.foodName }}
        </li>
        <li
          v-if="showIngredients && data.description"
          class="item"
        >
          食材用量:{{ data.description }}
        </li>
      </ul>
    </div>

    <div
      v-if="type==='recipesDetail'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.foodTypeColor) }"
    >
      <ul>
        <li
          class="title"
          :style="{color:data.foodTypeColor}"
        >
          {{ data.foodName }}
        </li>
        <li
          v-if="showIngredients && data.description"
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
  name: 'CellList',
  props: {
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ['recipesList', 'chooseRecipes', 'recipesDetail'].includes(value)
      }
    },
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
    HandleDetail () {
      this.$emit('handleDetail')
    },
    HandleEdit () {
      this.$emit('handleEdit')
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
    font-size: 14px;
    margin-bottom: 8px;
    overflow: hidden;
    position: relative;
    width: 100%;

    ::v-deep .EtmFieldLabel-wrap {
      padding-bottom: 0;
    }

    ul {
      font-weight: 400;
      padding: 8px;

      .title {
        margin-bottom: 8px;
        text-align: left;
      }

      .item {
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        margin-top: 8px;
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

</style>
