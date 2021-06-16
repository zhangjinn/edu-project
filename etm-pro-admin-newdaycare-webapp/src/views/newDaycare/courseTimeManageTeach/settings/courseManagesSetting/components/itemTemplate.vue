<template>
  <div class="itemWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :change="handleChange"
      :no-slot="noSlot"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-slot:color="slotProps">
        <el-color-picker
          v-model="dragData[slotProps.index].color"
          popper-class="colorPicker"
          :color-format="colorFormat"
          :predefine="predefineColors"
          :disabled="dragData[slotProps.index].editable === false"
          @click.native="clickp"
          @change="(...arg) => {
            handleColorChange(slotProps.index, ...arg)
          }"
        />
      </template>
      <template v-slot:input="slotProps">
        <el-time-select
          v-model="dragData[slotProps.index].startTime"
          placeholder="起始时间"
          :picker-options="{
            start: '08:00',
            step,
            end: '22:00',
            maxTime: dragData[slotProps.index].endTime
          }"
          @change="handleTimePicker(slotProps.index)"
        />
        <el-time-select
          v-model="dragData[slotProps.index].endTime"
          placeholder="结束时间"
          :picker-options="{
            start: '08:00',
            step,
            end: '22:00',
            minTime: dragData[slotProps.index].startTime
          }"
          @change="handleTimePicker(slotProps.index)"
        />
      </template>
      <template v-slot:delete>
        <i class="iconshanchu1 iconfont" />
      </template>
      <template v-slot:handle>
        <i class="icontuozhuai iconfont" />
      </template>
    </drag-item>
  </div>
</template>
<script>
import dragItem from '../components/dragItem'

export default {
  components: {
    dragItem
  },
  props: {
    step: {
      type: String,
      default () {
        return '00:15'
      }
    },
    data: {
      type: Array,
      required: true
    },
    noSlot: {
      type: Array,
      default () {
        return []
      }
    },
    btnText: {
      type: String,
      default: undefined
    },
    colorFormat: {
      type: String,
      default: 'rgb'
    }
  },
  data () {
    return {
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      dragData: this.data
    }
  },
  watch: {
    dragData (v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleChange (...arg) {
      this.$emit('change', arg)
    },
    handleColorChange (...arg) {
      this.$emit('colorChange', arg)
    },
    handleAdd (...arg) {
      this.$emit('add', arg)
    },
    handleDelete (...arg) {
      this.$emit('delete', arg)
    },
    clickp () {
      const pickers = document.querySelectorAll('.colorPicker')
      Array.prototype.forEach.call(pickers, picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleTimePicker (index) {
      this.$emit('timeChange', index)
    }

  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  ::v-deep .el-input {
    width: 210px;
  }

  ::v-deep .el-color-picker {
    .el-color-picker__empty,
    .el-color-picker__icon {
      display: none;
    }
  }

  .iconfont {
    height: 16px;
    overflow: hidden;
    width: 16px;
  }

  .iconshanchu1 {
    font-size: 12px;
    margin-left: 24px;
  }

  .icontuozhuai {
    font-size: 12px;
    margin-left: 24px;
    margin-right: 16px;
  }
}
</style>
