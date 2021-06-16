<template>
  <div
    class="EtmCell"
    :style="{ background:bgColor(data.color) }"
  >
    <ul>
      <li
        class="title"
        :style="{color:data.color}"
      >
        {{ data.specialCourse }}
      </li>
      <li
        v-if="data.room"
        class="item marginTop"
      >
        {{ data.room }}
      </li>
      <li
        v-if="data.timeBucket"
        class="item"
      >
        时段：{{ data.timeBucket }}
      </li>
      <li
        v-if="data.scheduleRoles"
        class="item"
      >
        授课老师：{{ data.scheduleRoles }}
      </li>
    </ul>
    <div class="popTip">
      <div class="popTipInner">
        <span @click.stop="HandleDetail">详情</span>
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
      default () {
        return {}
      }
    }
  },
  methods: {
    bgColor (color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },
    HandleDetail () {
      this.$emit('handleDetail')
    }
  }
}
</script>

<style scoped lang="scss">
.EtmCell {
  border-radius: 2px;
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;

  ul {
    font-weight: 400;
    padding: 8px;

    .marginTop {
      margin-top: 8px;
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
