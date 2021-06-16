<template>
  <div class="itemWrap">
    <drag-item
      class="dragItem"
      :data.sync="dragData"
      :add-btn-text="addBtnText"
      :slot-arr="slotArr"
      :change="handleDragChange"
      @add="handleAdd"
      @delete="handleDelete"
    >
      <template #title="slotProps">
        <div class="title">
          <i class="iconfont iconcalendar" />
          <span>{{ dragData[slotProps.index][0].weekday | filter }}</span>
        </div>
      </template>
      <template #default="slotProps">
        <div class="flex-wrap">
          <span class="flex-label">开放时段1：</span>
          <div class="flex-item">
            <el-time-select
              v-model="dragData[slotProps.index][0].startTime"
              size="mini"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
              @change="handleTimeChange(slotProps.index, 0)"
            />
            <span class="cut">-</span>
            <el-time-select
              v-model="dragData[slotProps.index][0].endTime"
              size="mini"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
              @change="handleTimeChange(slotProps.index, 0)"
            />
            <el-switch
              v-model="dragData[slotProps.index][0].enable"
              @change="handleTimeEnable(slotProps.index, 0)"
            />
          </div>
        </div>
        <div class="flex-wrap">
          <span class="flex-label">开放时段2：</span>
          <div class="flex-item">
            <el-time-select
              v-model="dragData[slotProps.index][1].startTime"
              size="mini"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
              @change="handleTimeChange(slotProps.index, 1)"
            />
            <span class="cut">-</span>
            <el-time-select
              v-model="dragData[slotProps.index][1].endTime"
              size="mini"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
              @change="handleTimeChange(slotProps.index, 1)"
            />
            <el-switch
              v-model="dragData[slotProps.index][1].enable"
              @change="handleTimeEnable(slotProps.index, 1)"
            />
          </div>
        </div>
      </template>
      <template #handle="slotProps">
        <el-select
          v-model="dragData[slotProps.index].typeId"
          class="handle-item"
          placeholder="请选择套餐时长"
          @change="handleChange(slotProps.index)"
        >
          <el-option
            v-for="it in packageOption"
            :key="it.cameraServiceTypeId"
            :label="it.cameraServiceTypeName"
            :value="it.cameraServiceTypeId"
          />
        </el-select>
        <el-input
          v-model="dragData[slotProps.index].sellMoney"
          class="handle-item"
          placeholder="请输入套餐金额"
          @blur="handleInputBlur(slotProps.index)"
          @focus="handleInputFocus(slotProps.index)"
        />
        <el-input
          v-model="dragData[slotProps.index].discountMoney"
          class="handle-item"
          placeholder="请输入优惠金额"
          @blur="handleInputBlur(slotProps.index)"
          @focus="handleInputFocus(slotProps.index)"
        />
        <el-switch
          v-model="dragData[slotProps.index].enable"
          @change="handleEnable(slotProps.index)"
        />
      </template>
      <template #delete>
        <i class="iconshanchu1 iconfont" />
      </template>
      <template #drag>
        <i class="icontuozhuai iconfont" />
      </template>
    </drag-item>
  </div>
</template>
<script>
import dragItem from './dragItem'

export default {
  components: {
    dragItem
  },
  filters: {
    filter (v) {
      if (v) {
        return '星期' + '一二三四五六日'.charAt(v - 1)
      } else {
        return ''
      }
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    packageOption: {
      type: Array,
      default: () => []
    },
    addBtnText: {
      type: String,
      default: ''
    },
    slotArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dragData: this.data
    }
  },
  watch: {
    data: {
      handler (v) {
        if (v) {
          this.dragData = v
          // console.log('dragData1', v)
        }
      },
      immediate: true,
      deep: true
    },
    dragData (v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleDragChange (...arg) {
      this.$emit('dragChange', arg)
    },
    handleChange (i) {
      this.$emit('change', i)
    },
    handleInputBlur (i) {
      this.$emit('blur', i)
    },
    handleInputFocus (i) {
      this.$emit('focus', i)
    },
    handleEnable (i) {
      this.$emit('enable', i)
    },
    handleTimeChange (i, j) {
      this.$emit('timeChange', i, j)
    },
    handleTimeEnable (i, j) {
      this.$emit('timeEnable', i, j)
    },
    handleAdd (...arg) {
      this.$emit('add', arg)
    },
    handleDelete (i) {
      this.$emit('delete', i)
    }
  }
}
</script>

<style lang="scss" scoped>
.itemWrap {
  //& ::v-deep .el-input {
  //  width: 420px;
  //}

  ::v-deep .el-input.el-input--mini {
    width: 120px;
  }

  .el-switch {
    margin-left: 12px;
  }

  .iconfont {
    height: 16px;
    overflow: hidden;
    width: 16px;
  }

  .iconcalendar {
    height: auto;
    width: auto;
  }

  .iconshanchu1 {
    //margin-left: 24px;
    font-size: 12px;
  }

  .icontuozhuai {
    //margin-left: 24px;
    //margin-right: 16px;
    font-size: 12px;
  }

  .cut {
    //margin: 0 15px;
    color: #dcdee4;
  }

  .title {
    align-items: center;
    display: flex;
    font-weight: bold;
  }

  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 24px;

    .flex-label {
      align-items: center;
      color: #565656;
      display: flex;
      font-size: 14px;
      font-weight: 400;
    }

    .flex-item {
      @include bgc_bg_color();
      border-radius: 4px;
      padding: 8px 16px 8px 13px;
    }
  }

  .handle-item {
    margin-right: 24px;
    width: 120px;
  }
}

</style>
