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
          {{ data.courseSubjectName }}
        </li>
        <li
          v-if="data.courseName"
          class="item"
        >
          {{ data.courseName }}
        </li>
        <li
          v-if="data.employeeName"
          class="item"
        >
          授课老师：{{ data.employeeName }}
        </li>
      </ul>
      <div
        v-show="data.courseName"
        class="popTip"
      >
        <div class="popTipInner">
          <span
            v-has="{authId: 'guardcare.scheduleWeek.update'}"
            @click.stop="HandleEdit"
          >编辑</span>
          <span
            v-has="{authId: 'guardcare.scheduleWeek.remove'}"
            @click.stop="HandleDelete"
          >删除</span>
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
        text-align: center;
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
