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
        <el-time-picker
          v-model="dragData[slotProps.index].chooseTime"
          placeholder="--:--"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :clearable="false"
          :disabled="dragData[slotProps.index].timeDisable"
          value-format="HH:mm"
          format="HH:mm"
          size="mini"
          style="width: 100px"
          @change="handleTimePicker(slotProps.index)"
        />
        后，停止次日报餐和修改已报餐
      </template>
      <template v-slot:switch="slotProps">
        <el-switch v-model="dragData[slotProps.index].switchValue" @change="switchChange(slotProps.index)" />
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
  props: {
    data: {
      type: Array,
      required: true
    },
    noSlot: {
      type: Array,
      default() {
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
  data() {
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
    dragData(v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleChange(...arg) {
      this.$emit('change', arg)
    },
    handleColorChange(...arg) {
      this.$emit('colorChange', arg)
    },
    handleAdd(...arg) {
      this.$emit('add', arg)
    },
    handleDelete(...arg) {
      this.$emit('delete', arg)
    },
    clickp() {
      const pickers = document.querySelectorAll('.colorPicker')
      Array.prototype.forEach.call(pickers, picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleTimePicker(index) {
      this.$emit('timeChange', index)
    },
    switchChange(index) {
      this.$emit('switchChange', index)
    }

  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  & >>> .el-input {
    width: 210px;
  }
  & >>> .el-color-picker {
    .el-color-picker__empty, .el-color-picker__icon {
      display: none;
    }
  }
  i.iconfont {
    width: 16px;
    height: 16px;
    overflow: hidden;
  }
  i.iconshanchu1 {
    margin-left: 24px;
    font-size: 12px;
  }
  i.icontuozhuai {
    margin-left: 24px;
    margin-right: 16px;
    font-size: 12px;
  }
  .el-switch{
    margin-left: 20px;
  }
}
</style>
