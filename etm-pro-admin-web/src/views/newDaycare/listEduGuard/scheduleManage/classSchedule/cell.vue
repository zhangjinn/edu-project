<template>
  <div class="EtmCell">
    <div class="EtmCellInner" :style="{ background:bgColor(data.color) }">
      <ul>
        <li class="title" :style="{color:data.color}">
          {{ data.courseSubjectName }}
        </li>
        <li v-if="data.employeeName" class="item">
          授课老师：{{ data.employeeName }}
        </li>
      </ul>
      <div class="popTip">
        <div class="popTipInner">
          <span v-has="{authId: 'guardcare.scheduleCourseClazz.update'}" @click.stop="HandleEdit">编辑</span>
          <span v-has="{authId: 'guardcare.scheduleCourseClazz.remove'}" @click.stop="HandleDelete">删除</span>
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
    bgColor(color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },
    HandleDetail() {
      this.$emit('handleDetail')
    },
    HandleEdit() {
      this.$emit('handleEdit')
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
    font-size: 14px;
    /deep/ .EtmFieldLabel-wrap{
      padding-bottom: 0;
    }

    ul{
      padding: 8px;
      font-weight: 400;
      .title{
        margin-bottom: 8px;
        text-align: center;
      }
      .item{
        display: flex;
        flex-wrap: wrap;
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
