<template>
  <div class="EtmCell">
    <div
      v-if="type==='scheduleList'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.bgcolor) }"
    >
      <ul>
        <li
          class="title"
          :style="{color: data.bgcolor}"
        >
          {{ data.name }}
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
      v-if="type==='chooseSchedule'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.bgcolor) }"
    >
      <ul>
        <li
          v-if="data.scheduleType"
          class="title"
          :style="{color:data.bgcolor}"
        >
          {{ data.scheduleType }}
        </li>
      </ul>
    </div>

    <div
      v-if="type==='scheduleDetail'"
      class="EtmCellInner"
      :style="{ background:bgColor(data.bgcolor) }"
    >
      <ul>
        <li
          class="title"
          :style="{color:data.bgcolor}"
        >
          {{ data.scheduleType }}
        </li>
        <li
          v-if="data.list.length"
          class="desc"
        >
          {{ data.list[0].content }}
        </li>
      </ul>
      <div
        v-if="data.list.length"
        class="popTip"
      >
        <div class="popTipInner">
          <span @click.stop="HandleEdit">编辑</span>
          <span @click.stop="HandleDelete">删除</span>
        </div>
      </div>
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
        return ['scheduleList', 'chooseSchedule', 'scheduleDetail'].includes(value)
      }
    },
    data: {
      type: Object,
      required: true
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
